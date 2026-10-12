import * as z from 'zod';
import { sha256 } from 'js-sha256';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import React, { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { handleFileUpload } from 'src/utils/fileUploadHelper';

import {
  createAndSubmitCopyrightFilingRequest,
  updateCopyrightFilingRequest,
  submitCopyrightFilingRequest,
} from 'src/actions/copyright';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
const cleanTextMessage = 'Invalid characters. Please enter valid characters';

const fileSchema = (isRequired = false) => {
  const baseSchema = z.instanceof(File, { message: 'File is required' });
  const withValidation = baseSchema
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'File size must be less than 5MB' });
  if (!isRequired) {
    return z.union([withValidation, z.null(), z.undefined()]).optional();
  }
  return withValidation;
};

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

const MIN_DATE_STR = MIN_DATE.toISOString().split('T')[0];

// Local calendar date as YYYY-MM-DD, for the date input's `max`
const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const optionalText = (min, max) =>
  z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .superRefine((val, ctx) => {
      if (!val) return;
      if (val.length < min) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: min,
          type: 'string',
          inclusive: true,
          message: `Must be at least ${min} characters.`,
        });
      }
      if (val.length > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: max,
          type: 'string',
          inclusive: true,
          message: `Must not exceed ${max} characters.`,
        });
      }
      if (!cleanTextRegex.test(val)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: cleanTextMessage });
      }
    });

export const CopyrightCreateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title is required')
      .max(200, 'Title cannot exceed 200 characters')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    typeOfWork: z
      .string()
      .trim()
      .min(1, 'Type of work is required')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    description: z
      .string()
      .trim()
      .min(10, 'Description is required')
      .max(500, 'Description cannot exceed 500 characters')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    authorNames: z
      .string()
      .trim()
      .min(2, 'Author name is required')
      .max(500, 'Author names cannot exceed 500 characters')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    organization: optionalText(2, 200),
    ownershipType: z.string().min(1, 'Ownership type is required'),
    isWorkForHire: z.boolean(),
    publicationStatus: z.string().min(1, 'Publication status is required'),
    publicationDate: z
      .any()
      .optional()
      .transform((val) => (val ? toUtcIsoDate(val) : null)),
    firstPublicationCountry: optionalText(2, 100),
    natureOfWork: optionalText(2, 200),
    language: optionalText(2, 50),
    // File Fields
    workFile: fileSchema(true), // Required
    noc: fileSchema(false), // Optional
    assignmentDeed: fileSchema(false), // Optional
    additionalFiles: fileSchema(false), // Optional
  })
  .superRefine((data, ctx) => {
    // 1. Conditional Publication Validation
    if (data.publicationStatus === 'PUBLISHED') {
      if (!data.publicationDate) {
        ctx.addIssue({ path: ['publicationDate'], message: 'Publication date required', code: z.ZodIssueCode.custom });
      } else {
        const dateError = validateDate(data.publicationDate);
        if (dateError) {
          ctx.addIssue({ path: ['publicationDate'], message: dateError, code: z.ZodIssueCode.custom });
        }
      }
      if (!data.firstPublicationCountry) {
        ctx.addIssue({ path: ['firstPublicationCountry'], message: 'Country required', code: z.ZodIssueCode.custom });
      }
    }
    // 2. Duplicate Filename Check (weak, name-based — the real check is the
    // content-hash check done at upload time in renderDocuments below; this
    // is kept as a cheap extra guard at submit time).
    const filenames = [data.workFile?.name, data.noc?.name, data.assignmentDeed?.name, data.additionalFiles?.name].filter(
      Boolean
    );
    const duplicates = filenames.filter((item, index) => filenames.indexOf(item) !== index);
    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate file: ${duplicates[0]}. Please use unique files for each category.`,
        path: ['workFile'], // Highlights the primary file field
      });
    }
  });

const existingFile = (label, required = false) => {
  const schema = z.any().refine((value) => !required || (value !== null && value !== undefined && value !== ''), {
    message: `${label} is required`,
  });
  return required ? schema : schema.optional();
};

export const CopyrightUpdateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title is required')
      .max(200, 'Title cannot exceed 200 characters')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    typeOfWork: z
      .string()
      .trim()
      .min(1, 'Type of work is required')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    description: z
      .string()
      .trim()
      .min(10, 'Description is required')
      .max(500, 'Description cannot exceed 500 characters')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    authorNames: z
      .string()
      .trim()
      .min(2, 'Author name is required')
      .max(500, 'Author names cannot exceed 500 characters')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    organization: optionalText(2, 200),
    ownershipType: z.string().min(1, 'Ownership type is required'),
    isWorkForHire: z.boolean(),
    publicationStatus: z.string().min(1, 'Publication status is required'),
    publicationDate: z
      .any()
      .optional()
      .transform((value) => (value ? new Date(value).toISOString() : null)),
    firstPublicationCountry: optionalText(2, 100),
    natureOfWork: optionalText(2, 200),
    language: optionalText(2, 50),
    workFile: existingFile('Work file', true),
    noc: existingFile('No Objection Certificate'),
    assignmentDeed: existingFile('Assignment deed'),
    additionalFiles: existingFile('Additional supporting file'),
  })
  .superRefine((data, ctx) => {
    if (data.publicationStatus === 'PUBLISHED') {
      if (!data.publicationDate) {
        ctx.addIssue({ path: ['publicationDate'], message: 'Publication date required', code: z.ZodIssueCode.custom });
      } else {
        const dateError = validateDate(data.publicationDate);
        if (dateError) {
          ctx.addIssue({ path: ['publicationDate'], message: dateError, code: z.ZodIssueCode.custom });
        }
      }
      if (!data.firstPublicationCountry) {
        ctx.addIssue({ path: ['firstPublicationCountry'], message: 'Country required', code: z.ZodIssueCode.custom });
      }
    }
    const filenames = [data.workFile?.name, data.noc?.name, data.assignmentDeed?.name, data.additionalFiles?.name].filter(
      Boolean
    );
    const duplicates = filenames.filter((item, index) => filenames.indexOf(item) !== index);
    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate file: ${duplicates[0]}. Please use unique files for each category.`,
        path: ['workFile'],
      });
    }
  });

const DraftRequiredSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .regex(cleanTextRegex, { message: cleanTextMessage }),
});

const DOCUMENTS = [
  { field: 'workFile', label: 'Upload Work File / Sample Copy', category: 'WORK_FILE', required: true },
  { field: 'noc', label: 'Upload No Objection Certificate (NoC)', category: 'NOC' },
  { field: 'assignmentDeed', label: 'Upload Assignment Deed / Ownership Proof', category: 'ASSIGNMENT_DEED' },
  { field: 'additionalFiles', label: 'Upload Additional Supporting Files', category: 'SUPPORTING_DOC' },
];

const UPLOAD_FILE_FIELDS = ['workFile', 'noc', 'assignmentDeed', 'additionalFiles'];

const FIELD_LABELS = DOCUMENTS.reduce((acc, doc) => {
  acc[doc.field] = doc.label;
  return acc;
}, {});

const getFileHash = async (file) => {
  const buffer = await file.arrayBuffer();
  return sha256(new Uint8Array(buffer));
};

const findDuplicateFile = async (file, currentField, values) => {
  const fileHash = await getFileHash(file);
  for (const doc of DOCUMENTS) {
    if (doc.field === currentField) continue;
    const existingFileValue = values[doc.field];
    if (!(existingFileValue instanceof File)) continue;
    const existingHash = await getFileHash(existingFileValue);
    if (fileHash === existingHash) {
      return doc.field;
    }
  }
  return null;
};

export const TYPEOFWORK_OPTIONS = [
  { value: '', label: 'Select option' }, // ✅ default
  { value: 'LITERARY', label: 'Literary', description: 'Books, articles, research papers, blogs' },
  { value: 'SOFTWARE', label: 'Software', description: 'Source code, applications, programs' },
  { value: 'ARTISTIC', label: 'Artistic', description: 'Drawings, paintings, designs' },
  { value: 'MUSICAL', label: 'Musical', description: 'Music compositions' },
  { value: 'CINEMATOGRAPH', label: 'Cinematograph Film', description: 'Movies, videos' },
  { value: 'SOUND_RECORDING', label: 'Sound Recording', description: 'Audio recordings, podcasts' },
];

export const OWNERSHIP_TYPE_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'INDIVIDUAL', label: 'Individual' },
  { value: 'ORGANIZATION', label: 'Organization' },
  { value: 'JOINTOWNERSHIP', label: 'Joint Ownership' },
];

export const PUBLICATION_STATUS_OPTIONS = [
  { value: '', label: 'Select option' },
  { value: 'UNPUBLISHED', label: 'Unpublished' },
  { value: 'PUBLISHED', label: 'Published' },
];

// ----------------------------------------------------------------------

export function CopyrightCreateEditForm({ currentCopyright }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();

  const openWork = useBoolean(true);
  const openAuthor = useBoolean(true);
  const openPublication = useBoolean(true);
  const openAdditional = useBoolean(true);
  const openDocuments = useBoolean(true);
  const confirmSubmit = useBoolean();

  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [fileErrors, setFileErrors] = useState({});

  const [existingDocuments, setExistingDocuments] = useState({});
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);

  const defaultValues = {
    title: '',
    typeOfWork: '',
    description: '',
    authorNames: '',
    organization: '',
    ownershipType: '',
    isWorkForHire: false,
    publicationStatus: '',
    publicationDate: '',
    firstPublicationCountry: '',
    natureOfWork: '',
    language: '',
    workFile: null,
    noc: null,
    assignmentDeed: null,
    additionalFiles: null,
  };

  const methods = useForm({
    resolver: zodResolver(currentCopyright ? CopyrightUpdateSchema : CopyrightCreateSchema),
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
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  const publicationStatus = watch('publicationStatus');
  const isPublished = publicationStatus === 'PUBLISHED';

  useEffect(() => {
    if (!currentCopyright) {
      setIsHydrated(true);
      return;
    }

    setIsHydrated(false);

    const documents = currentCopyright.documents || [];
    const mappedFiles = {};
    const existingMap = {};

    DOCUMENTS.forEach((doc) => {
      const existingDoc = documents.find((d) => d.documentCategory === doc.category);
      if (existingDoc) {
        mappedFiles[doc.field] = {
          ...existingDoc,
          name: existingDoc.originalFileName,
          isExisting: true,
        };
        existingMap[doc.field] = {
          applicationDocumentId: existingDoc.applicationDocumentId,
          category: doc.category,
        };
      }
    });

    reset({
      ...defaultValues,
      title: currentCopyright.title || '',
      typeOfWork: (currentCopyright.typeOfWork || '').toUpperCase(),
      description: currentCopyright.description || '',
      authorNames: currentCopyright.authorNames || '',
      organization: currentCopyright.organization || '',
      ownershipType: (currentCopyright.ownershipType || '').toUpperCase(),
      isWorkForHire: !!currentCopyright.isWorkForHire,
      publicationStatus: (currentCopyright.publicationStatus || '').toUpperCase(),
      publicationDate: currentCopyright.publicationDate || '',
      firstPublicationCountry: currentCopyright.firstPublicationCountry || '',
      natureOfWork: currentCopyright.natureOfWork || '',
      language: currentCopyright.language || '',
      ...mappedFiles,
    });
    setExistingDocuments(existingMap);
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCopyright, reset]);

  useEffect(() => {
    if (publicationStatus !== 'PUBLISHED') {
      setValue('publicationDate', '');
      setValue('firstPublicationCountry', '');
    }
  }, [publicationStatus, setValue]);

  // ----------------------------------------------------------------------

  const onSubmit = useCallback(
    async (payload, isDraft) => {
      setLoadingMsg(isDraft ? 'Saving draft...' : 'Submitting application...');
      const formatStatus = (status) => {
        if (!status) return '';
        return status.charAt(0) + status.slice(1).toLowerCase();
      };

      try {
        const formData = new FormData();
        if (currentCopyright?.applicationId) formData.append('Id', currentCopyright.applicationId);

        formData.append('Title', payload.title);
        formData.append('TypeOfWork', payload.typeOfWork);
        formData.append('Description', payload.description);
        formData.append('AuthorNames', payload.authorNames);
        formData.append('Organization', payload.organization || '');
        formData.append('OwnershipType', payload.ownershipType);
        formData.append('IsWorkForHire', payload.isWorkForHire);
        formData.append('PublicationStatus', formatStatus(payload.publicationStatus));
        if (isPublished) {
          formData.append('PublicationDate', toUtcIsoDate(payload.publicationDate));
          formData.append('FirstPublicationCountry', payload.firstPublicationCountry || '');
        }
        formData.append('NatureOfWork', payload.natureOfWork || '');
        formData.append('Language', payload.language || '');

        let replaceIndex = 0;
        DOCUMENTS.forEach((doc) => {
          const file = payload[doc.field];
          if (!(file instanceof File)) return; // untouched, or still the existing metadata object
          const existing = currentCopyright ? existingDocuments[doc.field] : null;
          if (existing) {
            formData.append(`DocumentsToReplace[${replaceIndex}].ApplicationDocumentId`, existing.applicationDocumentId);
            formData.append(`DocumentsToReplace[${replaceIndex}].File`, file);
            replaceIndex += 1;
          } else {
            formData.append('Files', file);
            formData.append('DocumentCategories', doc.category);
          }
        });

        if (currentCopyright) {
          const updateResult = await updateCopyrightFilingRequest(currentCopyright.applicationId, formData);
          if (!updateResult.success) {
            setLoadingMsg(updateResult.message || 'An error occurred');
            toast.error(updateResult.message || 'Update failed');
            return;
          }

          let finalResult = updateResult;
          if (!isDraft) {
            finalResult = await submitCopyrightFilingRequest(currentCopyright.applicationId);
          }

          if (finalResult.success) {
            toast.success(finalResult.message || (isDraft ? 'Updated successfully!' : 'Submitted successfully!'));
            reset(payload);
            router.push(paths.dashboard.copyright.root);
          } else {
            setLoadingMsg(finalResult.message || 'An error occurred');
            toast.error(finalResult.message || 'Submit failed');
          }
          return;
        }

        const result = await createAndSubmitCopyrightFilingRequest(formData, isDraft, (msg) => setLoadingMsg(msg));

        if (result.success) {
          toast.success(result.message || (isDraft ? 'Draft saved!' : 'Submitted successfully!'));
          router.push(paths.dashboard.copyright.root);
        } else {
          setLoadingMsg(result.message || 'An error occurred');
          toast.error(result.message || 'Action failed');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Server connection failed.';
        toast.error(`Critical Failure: ${errorMessage}`);
      } finally {
        setLoadingMsg('');
      }
    },
    [currentCopyright, isPublished, existingDocuments, reset, router]
  );

  const onError = (validationErrors) => {
    const firstErrorKey = Object.keys(validationErrors)[0];
    const firstErrorMessage = validationErrors[firstErrorKey]?.message;
    toast.error(firstErrorMessage || 'Please check the required details.');
  };

  useEffect(() => {
    if (!isHydrated || searchParams.get('finalSubmit') !== 'true') return;
    handleSubmit(() => { }, onError)();
  }, [isHydrated, searchParams, handleSubmit]);

  // ----------------------------------------------------------------------

  const handleConfirmAndRun = () => {
    confirmSubmit.onFalse();
    setIsDraftAction(false);
    handleSubmit((payload) => onSubmit(payload, false), onError)();
  };

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting || isDraftSubmitting) return;

    clearErrors(['title', 'publicationDate']);
    const draftValidation = DraftRequiredSchema.safeParse(getValues());
    if (!draftValidation.success) {
      draftValidation.error.issues.forEach((issue) => {
        setError(issue.path[0], { type: 'manual', message: issue.message });
      });
      return;
    }
    if (isPublished) {
      const dateError = validateDate(getValues('publicationDate'));
      if (dateError) {
        setError('publicationDate', { type: 'manual', message: dateError });
        return;
      }
    }

    setIsDraftAction(true);
    setIsDraftSubmitting(true);
    try {
      await onSubmit(getValues(), true);
    } finally {
      setIsDraftSubmitting(false);
    }
  }, [isSubmitting, isDraftSubmitting, getValues, setError, clearErrors, onSubmit]);

  const handleRemoveFile = useCallback(
    (fieldName) => {
      const existingInfo = existingDocuments[fieldName];

      if (existingInfo) {
        setDeletedDocumentIds((prev) =>
          prev.includes(existingInfo.applicationDocumentId)
            ? prev
            : [...prev, existingInfo.applicationDocumentId]
        );

        setExistingDocuments((prev) => ({
          ...prev,
          [fieldName]: existingInfo,
        }));
      }

      setValue(fieldName, null, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setFileErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    },
    [setValue, existingDocuments]
  );

  // ----------------------------------------------------------------------

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

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

  const RenderRequiredDocumnets = () => (
    <DownloadCard
      title="Supporting Documents"
      description="Templates & sample files for copyright filing"
      items={['NOC Template']}
      downloadUrl="/templates/Copyright-Required-Document.zip"
      fileName="Copyright_Documents.zip"
    />
  );

  // ----------------------------------------------------------------------

  const renderWorkDetails = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader title="Work Details" action={renderCollapseButton(openWork.value, openWork.onToggle)} sx={{ mb: 3 }} />
      <Collapse in={openWork.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          <Field.Text name="title" label="Title of Work*" />
          <Field.Select fullWidth name="typeOfWork" label="Type of Work*" slotProps={{ inputLabel: { shrink: true } }}>
            {TYPEOFWORK_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value} sx={{ textTransform: 'capitalize' }}>
                {option.value === '' ? <em>{option.label}</em> : option.label}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Text name="description" label="Description of Work*" multiline rows={3} />
        </Stack>
      </Collapse>
    </Card>
  );

  const renderAuthorDetails = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Author & Ownership"
        action={renderCollapseButton(openAuthor.value, openAuthor.onToggle)}
        sx={{ mb: 3 }}
      />
      <Collapse in={openAuthor.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          <Field.Text name="authorNames" label="Author Name(s)*" />
          <Field.Text name="organization" label="Organization / Department" />
          <Field.Select
            fullWidth
            name="ownershipType"
            label="Ownership Type*"
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {OWNERSHIP_TYPE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value} sx={{ textTransform: 'capitalize' }}>
                {option.value === '' ? <em>{option.label}</em> : option.label}
              </MenuItem>
            ))}
          </Field.Select>
          <Field.Switch name="isWorkForHire" label="Created during employment?" />
        </Stack>
      </Collapse>
    </Card>
  );

  const renderPublicationDetails = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Publication Details"
        action={renderCollapseButton(openPublication.value, openPublication.onToggle)}
        sx={{ mb: 3 }}
      />
      <Collapse in={openPublication.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          <Field.Select
            fullWidth
            name="publicationStatus"
            label="Publication Status*"
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {PUBLICATION_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>
          {/* ✅ Show ONLY when Published */}
          {isPublished && (
            <>
              <Field.Text
                name="publicationDate"
                type="date"
                label="Date of Publication*"
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { min: MIN_DATE_STR, max: getTodayStr() } }}
              />
              <Field.Text name="firstPublicationCountry" label="Country of First Publication*" />
            </>
          )}
        </Stack>
      </Collapse>
    </Card>
  );

  const renderAdditionalDetails = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Additional Information"
        action={renderCollapseButton(openAdditional.value, openAdditional.onToggle)}
        sx={{ mb: 3 }}
      />
      <Collapse in={openAdditional.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          <Field.Text name="natureOfWork" label="Nature Of Work" />
          <Field.Text name="language" label="Language of Work" />
        </Stack>
      </Collapse>
    </Card>
  );

  const renderDocuments = () => (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardHeader
        title="Upload Document"
        action={renderCollapseButton(openDocuments.value, openDocuments.onToggle)}
        sx={{ mb: 3 }}
      />
      <Collapse in={openDocuments.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          {DOCUMENTS.map((doc) => {
            const file = watch(doc.field);
            const error = methods.formState.errors[doc.field];

            return (
              <React.Fragment key={doc.field}>
                {/* Show Zod or Manual File Error */}
                {(error || fileErrors[doc.field]) && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block', fontWeight: 'bold' }}>
                    {error?.message || fileErrors[doc.field]}
                  </Typography>
                )}
                <Box
                  key={doc.field}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: error || fileErrors[doc.field] ? 'error.main' : file ? 'success.main' : 'divider',
                    borderRadius: 2,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      {doc.label}
                      {doc.required && '*'}
                    </Typography>
                    <Button component="label" variant="soft">
                      {file ? 'Change' : 'Upload'}
                      <input
                        hidden
                        type="file"
                        onChange={async (e) => {
                          const fileUpload = e.target.files?.[0];
                          if (!fileUpload) return;

                          await handleFileUpload({
                            file: fileUpload,
                            fieldName: doc.field,
                            getValues,
                            setValue,
                            clearErrors: methods.clearErrors,
                            setFileErrors,
                            uploadFields: UPLOAD_FILE_FIELDS,
                            fieldLabels: FIELD_LABELS,
                            existingDocuments,
                            setDeletedDocumentIds,
                          });

                          e.target.value = '';
                        }}
                      />
                    </Button>
                  </Stack>
                  {file && <Typography variant="caption">{file.name}</Typography>}
                  {fileErrors[doc.field] && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                      {fileErrors[doc.field]}
                    </Typography>
                  )}
                </Box>
              </React.Fragment>
            );
          })}
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
      <Typography variant="h6">Saving Changes...</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Please wait, do not refresh the page.
      </Typography>
    </Backdrop>
  );

  // ----------------------------------------------------------------------

  const renderActions = () => (
    <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <LoadingButton
        type="button"
        variant="soft"
        color="primary"
        size="small"
        loading={isDraftSubmitting}
        disabled={isSubmitting || isDraftSubmitting}
        onClick={handleSaveDraft}
      >
        {currentCopyright ? 'Save Changes' : 'Save as Draft'}
      </LoadingButton>

      {/* DIRECT SUBMIT BUTTON */}
      <LoadingButton
        variant="soft"
        color="warning"
        size="small"
        loading={isSubmitting && !isDraftAction}
        disabled={isSubmitting || isDraftSubmitting}
        onClick={confirmSubmit.onTrue}
      >
        Submit Application
      </LoadingButton>
    </Box>
  );

  // ----------------------------------------------------------------------

  return (
    <Form methods={methods} onSubmit={(event) => event.preventDefault()}>
      <Stack spacing={4} sx={{ mx: 'auto', maxWidth: 880 }}>
        {renderLoadingOverlay()}
        {RenderRequiredDocumnets()}
        {renderWorkDetails()}
        {renderAuthorDetails()}
        {renderPublicationDetails()}
        {renderAdditionalDetails()}
        {renderDocuments()}
        {renderActions()}
        {renderSubmitDialog()}
      </Stack>
    </Form>
  );
}
