import * as z from 'zod';
import { sha256 } from 'js-sha256';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { TextField, MenuItem } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { checkFileContent } from 'src/utils/file-validation';

import {
  createAndSubmitInternationalPatent,
  updateInternationalPatentDetails,
  submitInternationalPatent
} from 'src/actions/internationalPatentFiling';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PriorArtSelector } from 'src/components/priorArtSelector';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE_LABEL = `${MAX_FILE_SIZE / (1024 * 1024)}MB`;
const MAX_TEXT_LENGTH = 300;

const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
const cleanTextMessage = 'Filing Justification is required';
const phoneRegex = /^[0-9+\-\s]{7,15}$/;

const isPdfFile = (file) =>
  file?.name?.toLowerCase().endsWith('.pdf') && file.type === 'application/pdf';

const MIN_DATE = new Date('1951-01-01T00:00:00.000Z');

const toUtcIsoDate = (value) => {
  if (!value) return value;
  let date;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split('-');
    date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date = new Date(`${value}T00:00:00.000Z`);
  } else {
    date = new Date(value);
  }
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const validateDate = (val) => {
  if (!val) return null;

  let dateObj;
  if (/^\d{2}-\d{2}-\d{4}$/.test(val)) {
    const [day, month, year] = val.split('-');
    dateObj = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    dateObj = new Date(`${val}T00:00:00.000Z`);
  } else {
    dateObj = new Date(val);
  }

  if (Number.isNaN(dateObj.getTime())) {
    return 'Invalid date format. Use DD-MM-YYYY';
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (dateObj < MIN_DATE) {
    return 'Date cannot be earlier than 01-01-1951';
  }
  if (dateObj > today) {
    return 'Future dates are not allowed';
  }
  return null;
};

// ----------------------------------------------------------------------
// SCHEMA HELPERS
// ----------------------------------------------------------------------

const requiredPdfFile = (label) =>
  z
    .instanceof(File, { message: `${label} is required` })
    .refine(isPdfFile, { message: `${label}: Only PDF files are allowed` })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `${label}: Max file size is ${MAX_FILE_SIZE_LABEL}`,
    });

const optionalPdfFile = (label) =>
  z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        if (!(file instanceof File)) return true; // existing backend file object
        return isPdfFile(file) && file.size <= MAX_FILE_SIZE;
      },
      { message: `${label}: Max file size is ${MAX_FILE_SIZE_LABEL}` }
    );

const requiredExistingOrNewFile = (label) =>
  z
    .any()
    .refine((val) => val !== null && val !== undefined && val !== '', {
      message: `${label} is required`,
    })
    .refine(
      (val) => {
        if (!(val instanceof File)) return true;
        return isPdfFile(val) && val.size <= MAX_FILE_SIZE;
      },
      { message: `${label}: Max file size is ${MAX_FILE_SIZE_LABEL}` }
    );

const optionalExistingOrNewFile = (label) =>
  z
    .any()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        if (!(val instanceof File)) return true;
        return val.size <= MAX_FILE_SIZE;
      },
      { message: `${label}: Max file size is ${MAX_FILE_SIZE_LABEL}` }
    );

const requiredText = (label) =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(MAX_TEXT_LENGTH, `${label} cannot exceed ${MAX_TEXT_LENGTH} characters`);

const optionalText = () =>
  z.string().max(MAX_TEXT_LENGTH, `Cannot exceed ${MAX_TEXT_LENGTH} characters`).optional();

const requiredEmail = (label) =>
  z.string().min(1, `${label} is required`).email('Enter a valid email address');

const requiredPhone = (label) =>
  z.string().min(1, `${label} is required`).regex(phoneRegex, 'Enter a valid contact number');

const requiredPercentage = () =>
  z.union([z.string(), z.number()]).refine(
    (value) => {
      if (value === '' || value === null || value === undefined) return false;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 51 && num <= 100;
    },
    { message: 'Indian promoter shareholding must be between 51% and 100%' }
  );

// ----------------------------------------------------------------------
// DUPLICATE FILE VALIDATION
// ----------------------------------------------------------------------

const UPLOAD_FILE_FIELDS = [
  'dpiitCertificate',
  'incorporationCertificate',
  'promoterShareholdingProof',
  'auditedBalanceSheet',
  'panCard',
  'gstCertificate',
  'form1',
  'form2',
  'form3',
  'form5',
  'indianPatentApplicationCopy',
  'pctApplication',
  'form25',
];

const getFileHash = async (file) => {
  const buffer = await file.arrayBuffer();
  return sha256(new Uint8Array(buffer));
};

const findDuplicateFile = async (file, currentField, values) => {
  const fileHash = await getFileHash(file);
  for (const key of UPLOAD_FILE_FIELDS) {
    if (key === currentField) continue;
    const existingFile = values[key];
    if (!(existingFile instanceof File)) continue;
    const existingHash = await getFileHash(existingFile);
    if (fileHash === existingHash) {
      return key;
    }
  }
  return null;
};

// ----------------------------------------------------------------------
// CONDITIONAL "Indian Patent Application already filed" VALIDATION
// ----------------------------------------------------------------------

const CONDITIONAL_INDIAN_PATENT_FIELDS = [
  { field: 'form1', label: 'Form 1 – Application for Grant of Patent' },
  { field: 'form2', label: 'Form 2 – Provisional/Complete Specification' },
  { field: 'form3', label: 'Form 3 – Statement and Undertaking under Section 8' },
  { field: 'form5', label: 'Form 5 – Declaration as to Inventorship' },
];

const applyIndianPatentApplicationRules = (data, ctx) => {
  if (!data.hasIndianPatentApplication) {
    ctx.addIssue({
      path: ['hasIndianPatentApplication'],
      code: z.ZodIssueCode.custom,
      message: 'Please specify whether an Indian patent application has been filed',
    });
    return;
  }
  if (data.hasIndianPatentApplication !== 'true') return;

  if (!data.indianPatentApplicationFilingDate) {
    ctx.addIssue({
      path: ['indianPatentApplicationFilingDate'],
      code: z.ZodIssueCode.custom,
      message: 'Indian Patent Application Filing Date is required',
    });
  } else {
    const dateErr = validateDate(data.indianPatentApplicationFilingDate);
    if (dateErr) {
      ctx.addIssue({
        path: ['indianPatentApplicationFilingDate'],
        code: z.ZodIssueCode.custom,
        message: dateErr,
      });
    }
  }

  CONDITIONAL_INDIAN_PATENT_FIELDS.forEach(({ field, label }) => {
    const val = data[field];
    const isEmpty = val === null || val === undefined || val === '';
    if (isEmpty) {
      ctx.addIssue({
        path: [field],
        code: z.ZodIssueCode.custom,
        message: `${label} is required when an Indian patent application has been filed`,
      });
    }
  });
};

const applyPCTApplicationRules = (data, ctx) => {
  if (!data.HasPCTApplication) {
    ctx.addIssue({
      path: ['HasPCTApplication'],
      code: z.ZodIssueCode.custom,
      message: 'Please specify whether a PCT application has been filed',
    });
    return;
  }
  if (data.HasPCTApplication !== 'true') return;
  if (!data.PctApplicationNumber)
    ctx.addIssue({
      path: ['PctApplicationNumber'],
      code: z.ZodIssueCode.custom,
      message: 'PCT Application Number is required',
    });

  if (!data.PCTFilingDate) {
    ctx.addIssue({
      path: ['PCTFilingDate'],
      code: z.ZodIssueCode.custom,
      message: 'PCT Filing Date is required',
    });
  } else {
    const dateErr = validateDate(data.PCTFilingDate);
    if (dateErr) {
      ctx.addIssue({
        path: ['PCTFilingDate'],
        code: z.ZodIssueCode.custom,
        message: dateErr,
      });
    }
  }

  if (!data.HasISRGenerated)
    ctx.addIssue({
      path: ['HasISRGenerated'],
      code: z.ZodIssueCode.custom,
      message: 'Please specify whether the ISR has been generated',
    });
  if (data.HasISRGenerated === 'true' && !data.ISR)
    ctx.addIssue({
      path: ['ISR'],
      code: z.ZodIssueCode.custom,
      message: 'ISR is required when the ISR has been generated',
    });
};

// ----------------------------------------------------------------------
// CREATE schema
// ----------------------------------------------------------------------

export const InternationalPatentCreateSchema = z
  .object({
    priorArtApplicationId: z.string().min(1, 'Prior Art selection is required'),

    // Eligibility & Organization Documents
    dpiitCertificate: requiredPdfFile('DPIIT Startup Recognition Certificate'),
    dpiitRecognitionNumber: requiredText('DPIIT Recognition Number'),
    incorporationCertificate: requiredPdfFile('Certificate of Incorporation / Registration'),
    cin: optionalText(),
    registrationNumber: optionalText(),
    promoterShareholdingProof: requiredPdfFile('Proof of Indian Promoter Shareholding'),
    indianPromoterShareholdingPercentage: requiredPercentage(),
    auditedBalanceSheet: requiredPdfFile('Latest Audited Balance Sheet'),
    panCard: requiredPdfFile('PAN Card of the Startup'),
    gstCertificate: optionalPdfFile('GST Registration Certificate'),

    // Patent-Related Documents
    // NOTE: "Has Indian Patent Application already been filed?" gates Form 1/2/3/5
    // (and the visibility of the number/filing date/copy fields below).
    hasIndianPatentApplication: z.string().optional(),
    indianPatentApplicationNumber: optionalText(),
    indianPatentApplicationFilingDate: optionalText(),
    indianPatentApplicationCopy: optionalPdfFile('Indian Patent Application Copy'),
    form1: optionalPdfFile('Form 1'),
    form2: optionalPdfFile('Form 2'),
    form3: optionalPdfFile('Form 3'),
    form5: optionalPdfFile('Form 5'),

    HasPCTApplication: z.string().optional(),
    PctApplicationNumber: optionalText(),
    PCTFilingDate: optionalText(),
    HasISRGenerated: z.string().optional(),
    ISR: optionalPdfFile('ISR'),

    // Applicant/Contact Details
    authorizedRepresentativeName: requiredText('Name of Authorized Representative'),
    authorizedRepresentativeDesignation: requiredText('Designation of Authorized Representative'),
    officialEmail: requiredEmail('Official Email ID'),
    contactNumber: requiredPhone('Contact Number'),
    registeredOfficeAddress: requiredText('Registered Office Address'),

    // Filing Details
    filingRoute: z.string().min(1, 'Filing route is required'),
    form25: z
      .any()
      .optional()
      .refine((file) => !file || (isPdfFile(file) && file.size <= MAX_FILE_SIZE), {
        message: `Max file size is ${MAX_FILE_SIZE_LABEL}`,
      }),
    justification: z
      .string()
      .min(20, 'Justification is required (min 20 chars)')
      .max(MAX_TEXT_LENGTH, {
        message: `Justification cannot exceed ${MAX_TEXT_LENGTH} characters`,
      })
      .regex(cleanTextRegex, { message: cleanTextMessage }),
  })
  .superRefine((data, ctx) => {
    if (
      (data.filingRoute === 'DirectForeign' || data.filingRoute === 'PCTWithoutIndian') &&
      !data.form25
    ) {
      ctx.addIssue({
        path: ['form25'],
        message: 'Form 25 is required for selected route',
        code: z.ZodIssueCode.custom,
      });
    }
    applyIndianPatentApplicationRules(data, ctx);
    applyPCTApplicationRules(data, ctx);
  });

// FIX (bug2): drafts must only require what the user is told they need to
// fill in to save a draft — Filing Route + Justification. This schema
// previously also required `hasIndianPatentApplication` to be answered (via
// applyIndianPatentApplicationRules) and, if answered "Yes", required Forms
// 1/2/3/5 to already be uploaded. That silently blocked "Save as Draft" for
// anyone who hadn't gotten that far yet, which defeats the point of a draft.
const DraftRequiredSchema = z.object({
  filingRoute: z.string().min(1, 'Filing route is required'),
  justification: z
    .string()
    .min(20, 'Justification is required (min 20 chars)')
    .max(MAX_TEXT_LENGTH, `Justification cannot exceed ${MAX_TEXT_LENGTH} characters`)
    .regex(cleanTextRegex, { message: cleanTextMessage }),
});

// ----------------------------------------------------------------------
// UPDATE schema
// ----------------------------------------------------------------------

export const InternationalPatentUpdateSchema = z
  .object({
    dpiitCertificate: requiredExistingOrNewFile('DPIIT Startup Recognition Certificate'),
    dpiitRecognitionNumber: requiredText('DPIIT Recognition Number'),
    incorporationCertificate: requiredExistingOrNewFile('Certificate of Incorporation / Registration'),
    cin: optionalText(),
    registrationNumber: optionalText(),
    promoterShareholdingProof: requiredExistingOrNewFile('Proof of Indian Promoter Shareholding'),
    indianPromoterShareholdingPercentage: requiredPercentage(),
    auditedBalanceSheet: requiredExistingOrNewFile('Latest Audited Balance Sheet'),
    panCard: requiredExistingOrNewFile('PAN Card of the Startup'),
    gstCertificate: optionalExistingOrNewFile('GST Registration Certificate'),

    hasIndianPatentApplication: z.string().optional(),
    indianPatentApplicationNumber: optionalText(),
    indianPatentApplicationFilingDate: optionalText(),
    indianPatentApplicationCopy: optionalExistingOrNewFile('Indian Patent Application Copy'),
    form1: optionalExistingOrNewFile('Form 1'),
    form2: optionalExistingOrNewFile('Form 2'),
    form3: optionalExistingOrNewFile('Form 3'),
    form5: optionalExistingOrNewFile('Form 5'),

    HasPCTApplication: z.string().optional(),
    PctApplicationNumber: optionalText(),
    PCTFilingDate: optionalText(),
    HasISRGenerated: z.string().optional(),
    ISR: optionalExistingOrNewFile('ISR'),

    authorizedRepresentativeName: requiredText('Name of Authorized Representative'),
    authorizedRepresentativeDesignation: requiredText('Designation of Authorized Representative'),
    officialEmail: requiredEmail('Official Email ID'),
    contactNumber: requiredPhone('Contact Number'),
    registeredOfficeAddress: requiredText('Registered Office Address'),

    filingRoute: z.string().min(1, 'Filing route is required'),
    form25: optionalExistingOrNewFile('Form 25'),
    justification: z
      .string()
      .min(20, 'Justification is required (min 20 chars)')
      .max(300, { message: 'Justification cannot exceed 300 characters' })
      .regex(cleanTextRegex, { message: cleanTextMessage }),
  })
  .superRefine((data, ctx) => {
    if (
      (data.filingRoute === 'DirectForeign' || data.filingRoute === 'PCTWithoutIndian') &&
      !data.form25
    ) {
      ctx.addIssue({
        path: ['form25'],
        message: 'Form 25 is required for selected route',
        code: z.ZodIssueCode.custom,
      });
    }
    applyIndianPatentApplicationRules(data, ctx);
    applyPCTApplicationRules(data, ctx);
  });

const FILING_ROUTES = [
  {
    value: 'Paris',
    label: 'Paris Convention Route (with Indian Patent Filing)',
    description:
      'If you have already filed a patent application in India and are planning to file in foreign countries claiming priority from the Indian application.',
  },
  {
    value: 'PCTWithIndian',
    label: 'PCT Route (with Indian Patent Filing)',
    description:
      'If you have already filed a patent application in India and wish to file an international application under the PCT, followed by entry into selected countries.',
  },
  {
    value: 'DirectForeign',
    label: 'Direct Foreign Filing (with prior permission under Form 25)',
    description:
      'If you wish to file directly in foreign countries without using the Paris Convention or PCT route, you must obtain a Foreign Filing License (Form 25).',
  },
  {
    value: 'PCTWithoutIndian',
    label: 'PCT Route without Indian Filing (with prior permission under Form 25)',
    description:
      'If you plan to file a PCT application directly without first filing in India, you must obtain a Foreign Filing License (Form 25).',
  },
  {
    value: 'PCTWithISR',
    label: 'PCT with Positive ISR (Seeking support for National Phase Filing)',
    description:
      'If you have filed a PCT application and received a positive International Search Report (ISR), you can seek support for national phase filing in selected countries.',
  },
];

const HAS_INDIAN_PATENT_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

const HAS_PCT_APPLICATION_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

const HAS_ISR_GENERATED_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

const TODAY_STR = new Date().toISOString().split('T')[0];

const DOCUMENTS = [
  // ---------------- 1. Eligibility & Organization Documents ----------------
  {
    field: 'dpiitCertificate',
    label: 'DPIIT Startup Recognition Certificate',
    type: 'upload',
    category: 'STARTUP_DPIIT_CERTIFICATE',
    section: 'Eligibility & Organization Documents',
    required: true,
  },
  {
    field: 'dpiitRecognitionNumber',
    label: 'DPIIT Recognition Number',
    type: 'text',
    section: 'Eligibility & Organization Documents',
    required: true,
  },
  {
    field: 'incorporationCertificate',
    label: 'Certificate of Incorporation / Registration',
    type: 'upload',
    category: 'STARTUP_INCORPORATION_CERTIFICATE',
    section: 'Eligibility & Organization Documents',
    required: true,
  },
  {
    field: 'cin',
    label: 'CIN',
    type: 'text',
    section: 'Eligibility & Organization Documents',
    required: false,
  },
  {
    field: 'registrationNumber',
    label: 'Registration Number, as applicable',
    type: 'text',
    section: 'Eligibility & Organization Documents',
    required: false,
  },
  {
    field: 'promoterShareholdingProof',
    label: 'Proof of Indian Promoter Shareholding',
    type: 'upload',
    category: 'STARTUP_PROMOTER_SHAREHOLDING_PROOF',
    section: 'Eligibility & Organization Documents',
    required: true,
  },
  {
    field: 'indianPromoterShareholdingPercentage',
    label: 'Indian Promoter Shareholding (%)',
    type: 'percentage',
    section: 'Eligibility & Organization Documents',
    required: true,
    helperText:
      'Indian promoters should hold at least 51% shareholding in the Startup at the time of application',
    inputProps: { min: 51, max: 100, step: 0.01 },
  },
  {
    field: 'auditedBalanceSheet',
    label: 'Latest Audited Balance Sheet / Audited Financial Statements',
    type: 'upload',
    category: 'STARTUP_AUDITED_FINANCIAL_STATEMENT',
    section: 'Eligibility & Organization Documents',
    required: true,
  },
  {
    field: 'panCard',
    label: 'PAN Card of the Startup',
    type: 'upload',
    category: 'STARTUP_PAN_CARD',
    section: 'Eligibility & Organization Documents',
    required: true,
  },
  {
    field: 'gstCertificate',
    label: 'GST Registration Certificate / GSTIN, if applicable',
    type: 'upload',
    category: 'STARTUP_GST_CERTIFICATE',
    section: 'Eligibility & Organization Documents',
    required: false,
  },

  // ---------------- 2. Patent-Related Documents ----------------
  // Everything below except `pctApplication` is gated by
  // `hasIndianPatentApplication === 'true'` — see `dependsOnIndianPatent`.
  {
    field: 'hasIndianPatentApplication',
    label: 'Has an Indian patent application already been filed for this invention?',
    type: 'radio',
    options: HAS_INDIAN_PATENT_OPTIONS,
    section: 'Patent Related Documents',
    required: true,
  },
  {
    field: 'indianPatentApplicationNumber',
    label: 'Indian Patent Application Number, if the patent application has already been filed',
    type: 'text',
    section: 'Patent Related Documents',
    required: true,
    dependsOnIndianPatent: true,
  },
  {
    field: 'indianPatentApplicationFilingDate',
    label: 'Indian Patent Application Filing Date',
    type: 'date',
    section: 'Patent Related Documents',
    required: true,
    dependsOnIndianPatent: true,
    helperText: 'Date range allowed: 01-01-1951 to Today',
    inputProps: {
      min: '1951-01-01',
      max: TODAY_STR,
    },
  },
  {
    field: 'indianPatentApplicationCopy',
    label: 'Copy of the filed Indian Patent Application, where applicable',
    type: 'upload',
    category: 'INDIAN_PATENT_APPLICATION_COPY',
    section: 'Patent Related Documents',
    required: true,
    dependsOnIndianPatent: true,
  },
  {
    field: 'form1',
    label: 'Form 1 – Application for Grant of Patent',
    type: 'upload',
    category: 'PATENT_FORM_1',
    section: 'Patent Related Documents',
    required: true,
    dependsOnIndianPatent: true,
  },
  {
    field: 'form2',
    label: 'Form 2 – Provisional/Complete Specification',
    type: 'upload',
    category: 'PATENT_FORM_2',
    section: 'Patent Related Documents',
    required: true,
    dependsOnIndianPatent: true,
  },
  {
    field: 'form3',
    label: 'Form 3 – Statement and Undertaking under Section 8',
    type: 'upload',
    category: 'PATENT_FORM_3',
    section: 'Patent Related Documents',
    required: true,
    dependsOnIndianPatent: true,
  },
  {
    field: 'form5',
    label: 'Form 5 – Declaration as to Inventorship',
    type: 'upload',
    category: 'PATENT_FORM_5',
    section: 'Patent Related Documents',
    required: true,
    dependsOnIndianPatent: true,
  },

  // ---------------- 3. PCT Application ----------------
  {
    field: 'HasPCTApplication',
    label: 'Has a PCT Patent Application already been filed for this invention?',
    type: 'radio',
    options: HAS_PCT_APPLICATION_OPTIONS,
    section: 'PCT Application',
    required: true,
  },
  {
    field: 'PctApplicationNumber',
    label: 'PCT Application Number',
    type: 'text',
    section: 'PCT Application',
    required: true,
    dependsOnPCTApplication: true,
  },
  {
    field: 'PCTFilingDate',
    label: 'Date of Filing of PCT Application',
    type: 'date',
    section: 'PCT Application',
    required: true,
    dependsOnPCTApplication: true,
    helperText: 'Date range allowed: 01-01-1951 to Today',
    inputProps: {
      min: '1951-01-01',
      max: TODAY_STR,
    },
  },
  {
    field: 'HasISRGenerated',
    label: 'Has the International Search Report (ISR) been generated?',
    type: 'radio',
    options: HAS_ISR_GENERATED_OPTIONS,
    section: 'PCT Application',
    required: true,
    dependsOnPCTApplication: true,
  },
  {
    field: 'ISR',
    label: 'If Yes, please attach the ISR',
    type: 'upload',
    category: 'ISR',
    section: 'PCT Application',
    required: true,
    dependsOnISRGenerated: true,
  },

  // ---------------- 4. Applicant/Contact Details ----------------
  {
    field: 'authorizedRepresentativeName',
    label: 'Name of Authorized Representative',
    type: 'text',
    section: 'Applicant Contact Details',
    required: true,
  },
  {
    field: 'authorizedRepresentativeDesignation',
    label: 'Designation of Authorized Representative',
    type: 'text',
    section: 'Applicant Contact Details',
    required: true,
  },
  {
    field: 'officialEmail',
    label: 'Official Email ID',
    type: 'email',
    section: 'Applicant Contact Details',
    required: true,
  },
  {
    field: 'contactNumber',
    label: 'Contact Number',
    type: 'tel',
    section: 'Applicant Contact Details',
    required: true,
  },
  {
    field: 'registeredOfficeAddress',
    label: 'Registered Office Address',
    type: 'textarea',
    section: 'Applicant Contact Details',
    required: true,
    rows: 3,
  },
];

const DOCUMENT_SECTIONS = [
  'Eligibility & Organization Documents',
  'Patent Related Documents',
  'PCT Application',
  'Applicant Contact Details',
];

const FORM25_CATEGORY = 'FORM_25';

// Backend enum: InternationalPatentApplicantType = Startup | MSME | Academia | RAndD.
// There is no "Any" value.
const APPLICANT_TYPE_MAP = {
  STARTUP: 'Startup',
  MSME: 'MSME',
  ACADEMIA: 'Academia',
  'R&D': 'RAndD',
};

// The fields below are appended to FormData generically. Kept as a map so
// new scalar fields can be wired up without hand-listing every append call.
const SCALAR_FIELD_TO_BACKEND_KEY = {
  cin: 'CIN',
  registrationNumber: 'RegistrationNumber',
  dpiitRecognitionNumber: 'DPIITRecognitionNumber',
  indianPromoterShareholdingPercentage: 'IndianPromoterShareholdingPercentage',
  hasIndianPatentApplication: 'HasIndianPatentApplication',
  indianPatentApplicationNumber: 'IndianPatentApplicationNumber',
  indianPatentApplicationFilingDate: 'IndianPatentApplicationFilingDate',
  authorizedRepresentativeName: 'AuthorizedRepresentativeName',
  authorizedRepresentativeDesignation: 'AuthorizedRepresentativeDesignation',
  officialEmail: 'OfficialEmail',
  contactNumber: 'ContactNumber',
  registeredOfficeAddress: 'RegisteredOfficeAddress',
  HasPCTApplication: 'HasPCTApplication',
  PctApplicationNumber: 'PctApplicationNumber',
  PCTFilingDate: 'PCTFilingDate',
  HasISRGenerated: 'HasISRGenerated',
};

// ----------------------------------------------------------------------

export function InternationalPatentStartupCreateEditForm({ internationalPatent, role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const priorArtId = searchParams.get('priorArtId');

  const openDocuments = useBoolean(true);
  const openFilingRoute = useBoolean(true);
  const openJustification = useBoolean(true);
  const confirmSubmit = useBoolean();

  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [fileErrors, setFileErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  // Sections are independently collapsible (all 4 open by default):
  // Eligibility & Organization Documents, Patent-Related Documents,
  // PCT-Application, Applicant/Contact Details.
  const [openDocumentSections, setOpenDocumentSections] = useState(() =>
    Object.fromEntries(DOCUMENT_SECTIONS.map((section) => [section, true]))
  );

  // field -> { applicationDocumentId, category } for documents that already
  // exist on the backend for this application (edit mode only).
  const [existingDocuments, setExistingDocuments] = useState({});
  // applicationDocumentIds the user has removed and that must be sent to
  // the backend as DocumentsToDelete on update.
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);

  const defaultValues = {
    priorArtApplicationId: '',
    filingRoute: '',
    form25: null,
    justification: '',
    ...DOCUMENTS.reduce((acc, doc) => {
      acc[doc.field] = doc.type === 'upload' ? null : '';
      return acc;
    }, {}),
  };

  const applicantType = APPLICANT_TYPE_MAP[role?.toUpperCase()] || null;
  const schema = internationalPatent ? InternationalPatentUpdateSchema : InternationalPatentCreateSchema;

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting, isDirty, errors },
  } = methods;

  const values = watch();
  const filingRoute = watch('filingRoute');
  const hasIndianPatentApplication = watch('hasIndianPatentApplication');

  const showForm25 = filingRoute === 'DirectForeign' || filingRoute === 'PCTWithoutIndian';
  const isIndianPatentFiled = hasIndianPatentApplication === 'true';

  // ----------------------------------------------------------------------
  // Hydrate the form from the GET response.
  useEffect(() => {
    if (!internationalPatent) return;

    setIsHydrated(false);

    const documents = internationalPatent.documents || [];
    const findDocByCategory = (category) => documents.find((d) => d.documentCategory === category);
    const toExistingFileShape = (doc) => ({
      ...doc,
      name: doc.originalFileName,
      size: doc.fileSize || 0,
      isExisting: true,
    });

    const mappedFiles = {};
    const existingMap = {};

    DOCUMENTS.forEach((doc) => {
      if (doc.type !== 'upload') return;
      const existingDoc = findDocByCategory(doc.category);
      if (existingDoc) {
        mappedFiles[doc.field] = toExistingFileShape(existingDoc);
        existingMap[doc.field] = {
          applicationDocumentId: existingDoc.applicationDocumentId || existingDoc.documentId,
          category: doc.category,
        };
      }
    });

    const form25Doc = findDocByCategory(FORM25_CATEGORY);
    if (form25Doc) {
      mappedFiles.form25 = toExistingFileShape(form25Doc);
      existingMap.form25 = {
        applicationDocumentId: form25Doc.applicationDocumentId || form25Doc.documentId,
        category: FORM25_CATEGORY,
      };
    }

    const rawHasIndianPatentApplication = internationalPatent.hasIndianPatentApplication;
    const hasIndianPatentApplicationValue =
      rawHasIndianPatentApplication === undefined || rawHasIndianPatentApplication === null
        ? internationalPatent.indianPatentApplicationNumber
          ? 'true'
          : ''
        : String(!!rawHasIndianPatentApplication);

    const indianPatentApplicationFilingDateValue = internationalPatent.indianPatentApplicationFilingDate
      ? String(internationalPatent.indianPatentApplicationFilingDate).slice(0, 10)
      : '';

    const rawHasPCTApplicationValue = internationalPatent.hasPCTApplication;
    const hasPCTApplicationValue = rawHasPCTApplicationValue === undefined || rawHasPCTApplicationValue === null
      ? internationalPatent.hasPCTApplication
        ? 'true'
        : ''
      : String(!!rawHasPCTApplicationValue);

    const rawHasISRGeneratedValue = internationalPatent.hasISRGenerated;
    const hasISRGeneratedValue = rawHasISRGeneratedValue === undefined || rawHasISRGeneratedValue === null
      ? internationalPatent.hasISRGenerated
        ? 'true'
        : ''
      : String(!!rawHasISRGeneratedValue);

    const scalarFields = {
      priorArtApplicationId: internationalPatent.priorArtApplicationId || '',
      filingRoute: internationalPatent.filingRoute || '',
      justification: internationalPatent.justification || '',
      dpiitRecognitionNumber: internationalPatent.dpiitRecognitionNumber || '',
      cin: internationalPatent.cin || '',
      registrationNumber: internationalPatent.registrationNumber || '',
      indianPromoterShareholdingPercentage: internationalPatent.indianPromoterShareholdingPercentage ?? '',
      hasIndianPatentApplication: hasIndianPatentApplicationValue,
      indianPatentApplicationNumber: internationalPatent.indianPatentApplicationNumber || '',
      indianPatentApplicationFilingDate: indianPatentApplicationFilingDateValue,
      HasPCTApplication: hasPCTApplicationValue,
      PctApplicationNumber: internationalPatent.pctApplicationNumber || '',
      PCTFilingDate: internationalPatent.pctFilingDate
        ? String(internationalPatent.pctFilingDate).slice(0, 10)
        : '',
      HasISRGenerated: hasISRGeneratedValue,
      authorizedRepresentativeName: internationalPatent.authorizedRepresentativeName || '',
      authorizedRepresentativeDesignation: internationalPatent.authorizedRepresentativeDesignation || '',
      officialEmail: internationalPatent.officialEmail || '',
      contactNumber: internationalPatent.contactNumber || '',
      registeredOfficeAddress: internationalPatent.registeredOfficeAddress || '',
    };

    reset({ ...defaultValues, ...scalarFields, ...mappedFiles });
    setExistingDocuments(existingMap);
    setDeletedDocumentIds([]);
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internationalPatent, reset]);

  // warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // ----------------------------------------------------------------------

  const queueDocumentDeletion = useCallback(
    (fieldName) => {
      const doc = existingDocuments[fieldName];
      if (!doc) return;
      setDeletedDocumentIds((prev) => [...prev, doc.applicationDocumentId]);
      setExistingDocuments((prev) => {
        if (!prev[fieldName]) return prev;
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    },
    [existingDocuments]
  );

  // Only ever called from an explicit user action (clicking the trash
  // icon). Deliberately NOT called reactively from a useEffect watching
  // showForm25 / hasIndianPatentApplication — see the FIX notes further down
  // for why that caused files to be lost just from toggling radio options.
  const handleRemoveFile = useCallback(
    (fieldName) => {
      const currentValue = getValues(fieldName);
      if (currentValue?.isExisting) {
        queueDocumentDeletion(fieldName);
      }
      setValue(fieldName, null, { shouldValidate: true, shouldDirty: true });
    },
    [setValue, getValues, queueDocumentDeletion]
  );

  // ----------------------------------------------------------------------

  const buildFormData = (payload, { isUpdate = false } = {}) => {
    const formData = new FormData();

    const appendScalar = (key, value) => {
      if (value === null || value === undefined || value === '') return;
      formData.append(key, String(value));
    };

    if (isUpdate && internationalPatent?.applicationId) {
      formData.append('Id', internationalPatent.applicationId);
    } else {
      formData.append('PriorArtApplicationId', payload.priorArtApplicationId);
      formData.append('ApplicantType', applicantType);
    }

    formData.append('FilingRoute', payload.filingRoute);
    formData.append('Justification', payload.justification);

    Object.entries(SCALAR_FIELD_TO_BACKEND_KEY).forEach(([field, backendKey]) => {
      const value =
        field === 'indianPatentApplicationFilingDate' || field === 'PCTFilingDate'
          ? toUtcIsoDate(payload[field])
          : payload[field];
      appendScalar(backendKey, value);
    });

    let replaceIndex = 0;
    const appendDocOrReplacement = (file, category, fieldName) => {
      if (!(file instanceof File)) return; // skip empty or existing-mapped object
      const existing = isUpdate ? existingDocuments[fieldName] : null;
      if (existing) {
        const documentId = existing.applicationDocumentId;
        formData.append(`DocumentsToReplace[${replaceIndex}].ApplicationDocumentId`, documentId);
        formData.append(`DocumentsToReplace[${replaceIndex}].DocumentId`, documentId);
        formData.append(`DocumentsToReplace[${replaceIndex}].File`, file);
        replaceIndex += 1;
      } else {
        formData.append('Files', file);
        formData.append('DocumentCategories', category);
      }
    };

    DOCUMENTS.forEach((doc) => {
      if (doc.type !== 'upload') return;
      appendDocOrReplacement(payload[doc.field], doc.category, doc.field);
    });

    const requiresForm25 = payload.filingRoute === 'DirectForeign' || payload.filingRoute === 'PCTWithoutIndian';
    if (requiresForm25 && payload.form25) {
      appendDocOrReplacement(payload.form25, FORM25_CATEGORY, 'form25');
    }

    if (isUpdate) {
      deletedDocumentIds.forEach((id) => formData.append('DocumentsToDelete', id));
    }

    return formData;
  };

  const onSubmit = useCallback(
    async (payload, isDraft) => {
      setLoadingMsg(isDraft ? 'Saving draft...' : 'Submitting application...');
      try {
        if (internationalPatent) {
          // A Submit click must always go through to the backend even with
          // zero field changes; only skip the round-trip for a genuine
          // no-op *draft* save.
          if (!isDirty && isDraft) {
            toast.info('No changes detected.');
            return;
          }

          const formData = buildFormData(payload, { isUpdate: true });
          // Draft vs Submit are mutually exclusive, explicit signals sent
          // to the backend every time — no ambiguity about which state the
          // application should end up in.
          formData.append('IsDraft', String(isDraft));

          const result = await updateInternationalPatentDetails(
            internationalPatent.applicationId,
            formData,
            isDraft
          );

          if (!result.success) {
            setLoadingMsg(result.message || 'An error occurred');
            toast.error(result.message || (isDraft ? 'Update failed' : 'Submit failed'));
            return;
          }

          let finalResult = result;
          if (!isDraft) {
            finalResult = await submitInternationalPatent(internationalPatent.applicationId);
          }

          if (finalResult.success) {
            toast.success(finalResult.message || (isDraft ? 'Updated successfully!' : 'Submitted successfully!'));
            reset(payload);
            setDeletedDocumentIds([]);
            router.push(paths.dashboard.internationalPatentFiling.root);
          } else {
            setLoadingMsg(finalResult.message || 'An error occurred');
            toast.error(finalResult.message || 'Submit failed');
          }
          return;
        }

        if (!isDraft && !payload.priorArtApplicationId) {
          toast.error('Please select a prior art application');
          return;
        }

        if (!applicantType) {
          toast.error('We could not determine a valid applicant type for your account. Please contact support before saving.');
          return;
        }

        const formData = buildFormData(payload, { isUpdate: false });
        const result = await createAndSubmitInternationalPatent(formData, isDraft, (msg) => setLoadingMsg(msg));

        if (result.success) {
          toast.success(result.message || (isDraft ? 'Draft saved!' : 'Submitted successfully!'));
          router.push(paths.dashboard.internationalPatentFiling.root);
        } else {
          setLoadingMsg(result.message || 'An error occurred');
          toast.error(result.message || 'Action failed');
        }
      } catch (error) {
        console.error(error);
        toast.error(internationalPatent ? 'Failed to update patent filing' : 'Failed to submit patent filing');
      } finally {
        setLoadingMsg('');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [internationalPatent, isDirty, applicantType, existingDocuments, deletedDocumentIds, reset, router]
  );

  const onError = (error) => {
    const firstErrorKey = Object.keys(error)[0];
    const firstErrorMessage = error[firstErrorKey]?.message;
    toast.error(firstErrorMessage || 'Please check the required details.');
  };

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting || isDraftSubmitting) return;

    // Only Filing Route + Justification are required to save a draft —
    // see DraftRequiredSchema.
    clearErrors(['filingRoute', 'justification']);
    const draftValidation = DraftRequiredSchema.safeParse(getValues());
    if (!draftValidation.success) {
      draftValidation.error.issues.forEach((issue) => {
        setError(issue.path[0], { type: 'manual', message: issue.message });
      });
      return;
    }

    const hasUploadedDocument = DOCUMENTS.some(({ field, type }) => {
      if (type !== 'upload') return false;
      const value = getValues(field);
      return value instanceof File || value?.isExisting;
    });

    if (!hasUploadedDocument) {
      const firstUploadField = DOCUMENTS.find((doc) => doc.type === 'upload')?.field;
      setError(firstUploadField, {
        type: 'manual',
        message: 'At least one file must be uploaded to save a draft.',
      });
      toast.error('At least one file must be uploaded to save a draft.');
      return;
    }

    setIsDraftAction(true);
    setIsDraftSubmitting(true);
    try {
      const currentValues = getValues();
      await onSubmit(currentValues, true);
    } finally {
      setIsDraftSubmitting(false);
    }
  }, [isSubmitting, isDraftSubmitting, getValues, onSubmit, clearErrors, setError]);

  const handleConfirmAndRun = () => {
    confirmSubmit.onFalse();
    setIsDraftAction(false);
    handleSubmit((payload) => onSubmit(payload, false), onError)();
  };

  useEffect(() => {
    if (!isHydrated || searchParams.get('finalSubmit') !== 'true') return;
    handleSubmit(() => { }, onError)(); // The edit form owns validation and field highlighting for redirected submits.
  }, [isHydrated, searchParams, handleSubmit]);

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  // ----------------------------------------------------------------------

  const renderDocuments = () => (
    <Stack spacing={2}>
      {DOCUMENT_SECTIONS.map((section) => (
        <Card key={section} sx={{ borderRadius: 3 }}>
          <CardHeader
            title={section}
            //subheader="Upload all mandatory documents (PDF only)"
            action={renderCollapseButton(openDocumentSections[section], () =>
              setOpenDocumentSections((previous) => ({
                ...previous,
                [section]: !previous[section],
              }))
            )}
            sx={{ pb: 1 }}
          />
          <Collapse in={openDocumentSections[section]}>
            <Divider />
            <Stack spacing={2} sx={{ p: 2 }}>
              {DOCUMENTS.filter(
                (doc) =>
                  doc.section === section &&
                  (!doc.dependsOnIndianPatent || isIndianPatentFiled) &&
                  (!doc.dependsOnPCTApplication || values.HasPCTApplication === 'true') &&
                  (!doc.dependsOnISRGenerated || values.HasISRGenerated === 'true')
              ).map((doc) => {
                // Nesting: fields gated by "hasIndianPatentApplication" or
                // "HasPCTApplication" render as a subsection (indent level 1)
                // of that radio question, with a lightly tinted background.
                // ISR is gated by HasPCTApplication *and* HasISRGenerated, so
                // it is a sub-sub-section — it gets double the indentation
                // (level 2) and a distinct, slightly stronger background.
                const dependencyLevel = doc.dependsOnISRGenerated
                  ? 2
                  : doc.dependsOnIndianPatent || doc.dependsOnPCTApplication
                    ? 1
                    : 0;
                const isNested = dependencyLevel > 0;
                const dependencyBackground =
                  dependencyLevel === 2
                    ? 'action.hover'
                    : dependencyLevel === 1
                      ? 'grey.50'
                      : 'background.paper';
                const nestedSx = {
                  ml: dependencyLevel * 3,
                  bgcolor: dependencyBackground,
                  borderLeft: (theme) =>
                    `3px solid ${isNested ? theme.palette.primary.main : 'transparent'}`,
                };

                if (doc.type === 'radio') {
                  const radioError = !!errors?.[doc.field];
                  return (
                    <Box
                      key={doc.field}
                      sx={{
                        p: 2,
                        ...nestedSx,
                        borderRadius: 2.5,
                        border: (theme) =>
                          `1px solid ${radioError ? theme.palette.error.main : theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        {doc.label}
                        {doc.required && <span>*</span>}
                      </Typography>
                      {/* FIX (bug1): Field.RadioGroup already renders this field's
                          validation message itself (same way Field.Text does for
                          Justification below) — the manual <Typography> that used
                          to sit here duplicated the exact same "Please specify..."
                          text a second time underneath it. Removed; `radioError`
                          is still used above only to color the box border. */}
                      <Field.RadioGroup name={doc.field} options={doc.options} row />
                    </Box>
                  );
                }

                if (doc.type !== 'upload') {
                  const value = values[doc.field] ?? '';
                  const errorMsg = fieldErrors?.[doc.field] || errors?.[doc.field]?.message;

                  const validateField = (val) => {
                    if (doc.required && (val === '' || val === null || val === undefined)) {
                      return `${doc.label.replace(/[*].*/, '').trim()} is required`;
                    }
                    if (val === '' || val === null || val === undefined) return null;
                    if (doc.type === 'date') {
                      return validateDate(val);
                    }
                    if (doc.type === 'email') {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(val)) return 'Enter a valid email address';
                    }
                    if (doc.type === 'tel') {
                      if (!phoneRegex.test(val)) return 'Enter a valid contact number';
                    }
                    if (doc.type === 'percentage') {
                      const num = Number(val);
                      const min = doc.inputProps?.min ?? 0;
                      const max = doc.inputProps?.max ?? 100;
                      if (Number.isNaN(num)) return 'Enter a valid number';
                      if (num < min || num > max) return `Value must be between ${min} and ${max}`;
                    }
                    if ((doc.type === 'text' || doc.type === 'textarea') && val.length > MAX_TEXT_LENGTH) {
                      return `Cannot exceed ${MAX_TEXT_LENGTH} characters`;
                    }
                    return null;
                  };

                  const commonProps = {
                    fullWidth: true,
                    label: doc.label + (doc.required ? '*' : ''),
                    value,
                    error: !!errorMsg,
                    helperText: errorMsg || doc.helperText || (!doc.required ? 'Optional' : ''),
                    onChange: (e) => {
                      const newValue = e.target.value;
                      setValue(doc.field, newValue, { shouldValidate: true, shouldDirty: true });
                      const validationError = validateField(newValue);
                      setFieldErrors((prev) => ({ ...prev, [doc.field]: validationError }));
                    },
                    onBlur: (e) => {
                      const newValue =
                        doc.type === 'percentage' && e.target.value !== ''
                          ? Number(e.target.value).toFixed(2)
                          : e.target.value;
                      if (newValue !== e.target.value) {
                        setValue(doc.field, newValue, { shouldValidate: true, shouldDirty: true });
                      }
                      const validationError = validateField(newValue);
                      setFieldErrors((prev) => ({ ...prev, [doc.field]: validationError }));
                    },
                  };

                  return (
                    <Box
                      key={doc.field}
                      sx={{
                        p: 2,
                        ...nestedSx,
                        borderRadius: 2.5,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      {doc.type === 'select' ? (
                        <TextField select {...commonProps}>
                          {doc.options.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : doc.type === 'textarea' ? (
                        <TextField
                          {...commonProps}
                          multiline
                          rows={doc.rows || 3}
                          inputProps={{ maxLength: MAX_TEXT_LENGTH }}
                        />
                      ) : (
                        <TextField
                          {...commonProps}
                          type={doc.type === 'percentage' ? 'number' : doc.type}
                          inputProps={
                            doc.type === 'text'
                              ? { maxLength: MAX_TEXT_LENGTH, ...doc.inputProps }
                              : doc.inputProps
                          }
                          InputLabelProps={doc.type === 'date' ? { shrink: true } : undefined}
                        />
                      )}
                    </Box>
                  );
                }

                // UPLOAD FIELD — supports existing (already-saved) documents.
                const file = values[doc.field];
                const isUploaded = !!file;
                const isExisting = file?.isExisting;
                const uploadErrorMsg = fileErrors[doc.field] || errors?.[doc.field]?.message;

                return (
                  <Box
                    key={doc.field}
                    sx={{
                      p: 2,
                      ...nestedSx,
                      borderRadius: 2.5,
                      border: (theme) =>
                        `1px solid ${uploadErrorMsg
                          ? theme.palette.error.main
                          : isUploaded
                            ? theme.palette.success.main
                            : theme.palette.divider
                        }`,
                      borderLeft: (theme) =>
                        `4px solid ${uploadErrorMsg
                          ? theme.palette.error.main
                          : isUploaded
                            ? theme.palette.success.main
                            : isNested
                              ? theme.palette.primary.main
                              : 'transparent'
                        }`,
                      transition: 'all 0.2s ease',
                      '&:hover': { boxShadow: (theme) => theme.shadows[3], borderColor: 'primary.main' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {doc.label}
                          {doc.required && <span>*</span>}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          PDF format{!doc.required && ' • Optional'}
                        </Typography>
                      </Box>
                      <Button
                        component="label"
                        size="small"
                        disabled={isUploaded}
                        variant={isUploaded ? 'soft' : 'outlined'}
                        color={isUploaded ? 'success' : 'primary'}
                        startIcon={
                          <Iconify icon={isUploaded ? 'eva:checkmark-circle-2-fill' : 'eva:cloud-upload-fill'} />
                        }
                        sx={{ minWidth: 110, fontWeight: 500 }}
                      >
                        {isUploaded ? 'Uploaded' : 'Upload'}
                        <input
                          hidden
                          type="file"
                          accept=".pdf"
                          onChange={async (e) => {
                            const fileUpload = e.target.files?.[0];
                            if (!fileUpload) return;

                            if (!isPdfFile(fileUpload)) {
                              setFileErrors((prev) => ({ ...prev, [doc.field]: 'Only PDF files are allowed' }));
                              toast.error('Only PDF files are allowed');
                              e.target.value = '';
                              return;
                            }

                            if (fileUpload.size > MAX_FILE_SIZE) {
                              setFileErrors((prev) => ({
                                ...prev,
                                [doc.field]: `File must be less than ${MAX_FILE_SIZE_LABEL}`,
                              }));
                              toast.error(`File must be less than ${MAX_FILE_SIZE_LABEL}`);
                              e.target.value = '';
                              return;
                            }

                            setFileErrors((prev) => ({ ...prev, [doc.field]: null }));

                            const isSafe = await checkFileContent(fileUpload);
                            if (!isSafe) {
                              setFileErrors((prev) => ({ ...prev, [doc.field]: 'File contains forbidden content' }));
                              toast.error('File contains forbidden content');
                              e.target.value = '';
                              return;
                            }

                            const duplicateField = await findDuplicateFile(fileUpload, doc.field, getValues());
                            if (duplicateField) {
                              const message =
                                `This file was already uploaded for "${duplicateField}". ` +
                                `Please upload a different document.`;
                              setFileErrors((prev) => ({ ...prev, [doc.field]: message }));
                              toast.error(message);
                              e.target.value = '';
                              return;
                            }

                            setFileErrors((prev) => ({ ...prev, [doc.field]: null }));
                            setValue(doc.field, fileUpload, { shouldValidate: true, shouldDirty: true });
                            e.target.value = '';
                          }}
                        />
                      </Button>
                    </Box>

                    {uploadErrorMsg && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {uploadErrorMsg}
                      </Typography>
                    )}

                    <Collapse in={isUploaded}>
                      {file && (
                        <Box
                          sx={{
                            mt: 1.8,
                            px: 1.5,
                            py: 1.2,
                            borderRadius: 2,
                            bgcolor: 'background.neutral',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: (theme) => `1px dashed ${theme.palette.divider}`,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, overflow: 'hidden' }}>
                            <Iconify
                              icon="solar:file-text-bold"
                              width={20}
                              sx={{ color: isExisting ? 'text.secondary' : 'primary.main' }}
                            />
                            <Box sx={{ overflow: 'hidden' }}>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 600,
                                  display: 'block',
                                  maxWidth: 220,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {file.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {isExisting ? 'Already uploaded' : 'Ready to upload'}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFile(doc.field)}
                            sx={{
                              bgcolor: 'background.paper',
                              '&:hover': { bgcolor: 'error.lighter', color: 'error.main' },
                            }}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Box>
                      )}
                    </Collapse>
                  </Box>
                );
              })}
            </Stack>
          </Collapse>
        </Card>
      ))}
    </Stack>
  );

  const RenderRequiredDocuments = () => (
    <DownloadCard
      title="Supporting Documents"
      description="Templates & sample files for Foreign Patent filing"
      items={['NOC Template', 'Form-25']}
      downloadUrl="/templates/Foreign-Patent-Required-Document.zip"
      fileName="Foreign_Patent_Documents.zip"
    />
  );

  const renderFilingRoute = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Select Filing Route*"
        action={renderCollapseButton(openFilingRoute.value, openFilingRoute.onToggle)}
        sx={{ pb: 1 }}
      />
      <Collapse in={openFilingRoute.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          <Field.RadioGroup name="filingRoute" options={FILING_ROUTES} />
        </Stack>
      </Collapse>
    </Card>
  );

  const renderLoadingOverlay = () => (
    <Backdrop
      open={isSubmitting || isDraftSubmitting}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(2px)',
        bgcolor: 'rgba(0,0,0,0.5)',
      }}
    >
      <CircularProgress color="inherit" sx={{ mb: 2 }} />
      <Typography variant="h6">{loadingMsg || 'Saving Changes...'}</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Please wait, do not refresh the page.
      </Typography>
    </Backdrop>
  );

  const renderForm25 = () => {
    const file = values.form25;
    const isUploaded = !!file;
    const isExisting = file?.isExisting;
    const form25ErrorMsg = fileErrors.form25 || methods.formState.errors.form25?.message;

    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardHeader title="Upload Form 25 (Foreign Filing License)" />
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              border: (theme) =>
                `1px solid ${form25ErrorMsg
                  ? theme.palette.error.main
                  : isUploaded
                    ? theme.palette.success.main
                    : theme.palette.divider
                }`,
              borderLeft: (theme) =>
                `4px solid ${form25ErrorMsg
                  ? theme.palette.error.main
                  : isUploaded
                    ? theme.palette.success.main
                    : 'transparent'
                }`,
              transition: 'all 0.2s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Upload Form 25<span>*</span>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PDF format only
                </Typography>
              </Box>
              <Button
                component="label"
                size="small"
                disabled={isUploaded}
                variant={isUploaded ? 'soft' : 'outlined'}
                color={isUploaded ? 'success' : 'primary'}
                startIcon={<Iconify icon={isUploaded ? 'eva:checkmark-circle-2-fill' : 'eva:cloud-upload-fill'} />}
              >
                {isUploaded ? 'Uploaded' : 'Upload'}
                <input
                  hidden
                  type="file"
                  accept=".pdf"
                  onChange={async (e) => {
                    const fileUpload = e.target.files?.[0];
                    if (!fileUpload) return;

                    if (!isPdfFile(fileUpload)) {
                      setFileErrors((prev) => ({ ...prev, form25: 'Only PDF files are allowed' }));
                      toast.error('Only PDF files are allowed');
                      e.target.value = '';
                      return;
                    }

                    if (fileUpload.size > MAX_FILE_SIZE) {
                      setFileErrors((prev) => ({ ...prev, form25: `File must be less than ${MAX_FILE_SIZE_LABEL}` }));
                      toast.error(`File must be less than ${MAX_FILE_SIZE_LABEL}`);
                      e.target.value = '';
                      return;
                    }

                    setFileErrors((prev) => ({ ...prev, form25: null }));

                    const isSafe = await checkFileContent(fileUpload);
                    if (!isSafe) {
                      setFileErrors((prev) => ({ ...prev, form25: 'File contains forbidden content' }));
                      toast.error('File contains forbidden content');
                      e.target.value = '';
                      return;
                    }

                    const duplicateField = await findDuplicateFile(fileUpload, 'form25', getValues());
                    if (duplicateField) {
                      const message =
                        `This file was already uploaded for "${duplicateField}". ` +
                        `Please upload a different document.`;
                      setFileErrors((prev) => ({ ...prev, form25: message }));
                      toast.error(message);
                      e.target.value = '';
                      return;
                    }

                    setFileErrors((prev) => ({ ...prev, form25: null }));
                    setValue('form25', fileUpload, { shouldValidate: true, shouldDirty: true });
                    e.target.value = '';
                  }}
                />
              </Button>
            </Box>

            {form25ErrorMsg && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {form25ErrorMsg}
              </Typography>
            )}

            <Collapse in={isUploaded}>
              {file && (
                <Box
                  sx={{
                    mt: 2,
                    px: 1.5,
                    py: 1.2,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: (theme) => `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, overflow: 'hidden' }}>
                    <Iconify icon="solar:file-text-bold" width={20} sx={{ color: 'error.main' }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        maxWidth: 220,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {file.name}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => handleRemoveFile('form25')}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Box>
              )}
            </Collapse>
          </Box>
        </Box>
      </Card>
    );
  };

  const renderJustification = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Foreign Filing Justification*"
        action={renderCollapseButton(openJustification.value, openJustification.onToggle)}
        sx={{ pb: 1 }}
      />
      <Collapse in={openJustification.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Include:
            <br />
            • Commercial potential / market relevance
            <br />
            • Technology Transfer opportunities
            <br />
            • Strategic importance
          </Typography>
          <Field.Text name="justification" multiline rows={4} placeholder="Enter detailed justification..." />
        </Stack>
      </Collapse>
    </Card>
  );

  // ----------------------------------------------------------------------

  const renderActions = () => (
    <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <LoadingButton
        type="button"
        variant="soft"
        color="primary"
        size="small"
        disabled={(internationalPatent && !isDirty) || isSubmitting || isDraftSubmitting}
        loading={isDraftSubmitting}
        onClick={handleSaveDraft}
      >
        Save as Draft
      </LoadingButton>

      <LoadingButton
        type="button"
        variant="soft"
        color="warning"
        size="small"
        disabled={isSubmitting || isDraftSubmitting}
        loading={isSubmitting && !isDraftAction}
        onClick={confirmSubmit.onTrue}
      >
        Submit Application
      </LoadingButton>
    </Box>
  );

  const renderPriorArtSelector = () => {
    if (priorArtId || internationalPatent) return null;
    return (
      <PriorArtSelector
        value={watch('priorArtApplicationId')}
        onChange={(val) => setValue('priorArtApplicationId', val, { shouldValidate: true, shouldDirty: true })}
      />
    );
  };

  const renderSubmitDialog = () => (
    <ConfirmDialog
      open={confirmSubmit.value}
      onClose={confirmSubmit.onFalse}
      title="Submit Application"
      content={<>Are you sure you want to submit this application?</>}
      action={
        <Button variant="contained" color="primary" onClick={handleConfirmAndRun}>
          Confirm & Submit
        </Button>
      }
    />
  );

  useEffect(() => {
    if (priorArtId && !internationalPatent) {
      setValue('priorArtApplicationId', priorArtId, { shouldValidate: true, shouldDirty: true });
    }
  }, [priorArtId, internationalPatent, setValue]);

  // FIX (bugs 3 & 4): these two effects used to reactively call
  // setValue(field, null) — and queue existing documents for deletion — the
  // instant showForm25 / isIndianPatentFiled became false. That meant just
  // clicking through filing-route options, or toggling the "Has an Indian
  // patent application" radio while filling out the form, permanently
  // discarded already-uploaded files (Form 25, Form 1/2/3/5, the Indian
  // patent copy) before the user ever got near Submit.
  //
  // That reactive clearing has been removed entirely. Hiding the
  // now-irrelevant fields from view is handled purely by the conditional
  // rendering below ({showForm25 && renderForm25()} and the DOCUMENTS
  // filter in renderDocuments) — nothing needs to also wipe the underlying
  // form state. The create/update schema's superRefine still correctly
  // requires Form 25 / Forms 1-3-5 to be present at the moment the user
  // actually submits, based on whatever the final filingRoute /
  // hasIndianPatentApplication value is at that time. Files are only ever
  // removed when the user explicitly clicks the delete icon (handleRemoveFile).

  return (
    <Form
      methods={methods}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 920, xl: 880 } }}>
        {renderLoadingOverlay()}
        <RenderRequiredDocuments />
        {renderPriorArtSelector()}
        {renderDocuments()}
        {renderFilingRoute()}
        {showForm25 && renderForm25()}
        {renderJustification()}
        {renderActions()}
        {renderSubmitDialog()}
      </Stack>
    </Form>
  );
}