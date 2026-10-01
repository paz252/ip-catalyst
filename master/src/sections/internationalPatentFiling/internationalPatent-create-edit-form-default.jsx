import * as z from 'zod';
import { sha256 } from 'js-sha256';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useCallback, useState } from 'react';

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
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { FILE_CATEGORIES, validateFileUpload, checkFileContent } from 'src/utils/file-validation';

import {
  createAndSubmitInternationalPatent,
  updateInternationalPatentDetails,
  submitInternationalPatent,
} from 'src/actions/internationalPatentFiling';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PriorArtSelector } from 'src/components/priorArtSelector';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TEXT_LENGTH = 300;

const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
const cleanTextMessage =
  'Invalid characters. Please use only letters, numbers, and standard punctuation characters';

const isPdfFile = (file) =>
  file?.name?.toLowerCase().endsWith('.pdf') && file.type === 'application/pdf';

// ----------------------------------------------------------------------
// DUPLICATE FILE VALIDATION
// ----------------------------------------------------------------------

const UPLOAD_FILE_FIELDS = ['organizationNoc', 'form25'];

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
    if (fileHash === existingHash) return key;
  }
  return null;
};

// ----------------------------------------------------------------------
// SCHEMAS
// ----------------------------------------------------------------------

export const InternationalPatentCreateSchema = z
  .object({
    priorArtApplicationId: z.string().min(1, 'Prior Art selection is required'),
    organizationNoc: z
      .instanceof(File, { message: 'Organization NOC is required' })
      .refine(isPdfFile, { message: 'Only PDF files are allowed' })
      .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'Max file size is 5MB' }),
    filingRoute: z.string().min(1, 'Filing route is required'),
    form25: z
      .any()
      .optional()
      .refine(
        (file) => {
          if (!file) return true;
          return isPdfFile(file) && file.size <= MAX_FILE_SIZE;
        },
        { message: 'Max file size is 5MB' }
      ),
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
  });

const requiredExistingOrNewFile = (label) =>
  z
    .union([z.instanceof(File), z.object({}).passthrough(), z.null()])
    .refine((value) => value !== null && value !== undefined && value !== '', {
      message: `${label} is required`,
    })
    .refine(
      (val) => {
        if (!(val instanceof File)) return true;
        return isPdfFile(val) && val.size <= MAX_FILE_SIZE;
      },
      { message: `${label}: Max file size is 5MB` }
    );

const existingOrNewFile = (label) =>
  z
    .union([z.instanceof(File), z.object({}).passthrough(), z.null()])
    .optional()
    .refine((value) => !(value instanceof File) || value.size <= MAX_FILE_SIZE, {
      message: `${label}: Max file size is 5MB`,
    });

export const InternationalPatentUpdateSchema = z
  .object({
    filingRoute: z.string().min(1, 'Filing route is required'),
    organizationNoc: requiredExistingOrNewFile('Organization NOC'),
    form25: existingOrNewFile('Form 25'),
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
  });

const DraftRequiredSchema = z.object({
  filingRoute: z.string().min(1, 'Filing route is required'),
  justification: z
    .string()
    .min(20, 'Justification is required (min 20 chars)')
    .max(MAX_TEXT_LENGTH, `Justification cannot exceed ${MAX_TEXT_LENGTH} characters`)
    .regex(cleanTextRegex, { message: cleanTextMessage }),
});

// ----------------------------------------------------------------------

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
    label: 'Direct Foreign Filing (with prior permission – Form 25)',
    description:
      'If you wish to file directly in foreign countries without using the Paris Convention or PCT route, you must obtain a Foreign Filing License (Form 25).',
  },
  {
    value: 'PCTWithoutIndian',
    label: 'PCT Route without Indian Filing (with Form 25)',
    description:
      'If you plan to file a PCT application directly without first filing in India, you must obtain a Foreign Filing License (Form 25).',
  },
];

const DOCUMENTS = [
  {
    field: 'organizationNoc',
    label: 'Upload No Objection Certificate (NoC) from Organization',
    type: 'upload',
    category: 'ORG_NOC',
  },
];

const FORM25_CATEGORY = 'FORM_25';

const APPLICANT_TYPE_MAP = {
  STARTUP: 'Startup',
  MSME: 'MSME',
  ACADEMIA: 'Academia',
  'R&D': 'RAndD',
};

// ----------------------------------------------------------------------

export function InternationalPatentDefaultCreateEditForm({ internationalPatent, role }) {
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

  const [existingDocuments, setExistingDocuments] = useState({});
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);

  const defaultValues = {
    priorArtApplicationId: '',
    priorArtReport: null,
    organizationNoc: null,
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
  const showForm25 = filingRoute === 'DirectForeign' || filingRoute === 'PCTWithoutIndian';

  useEffect(() => {
    if (!internationalPatent) return;

    setIsHydrated(false);

    const documents = internationalPatent.documents || [];
    const mappedFields = {};
    const existingMap = {};

    DOCUMENTS.forEach((doc) => {
      if (doc.type !== 'upload') return;
      const existingDoc = documents.find((d) => d.documentCategory === doc.category);
      if (existingDoc) {
        mappedFields[doc.field] = {
          ...existingDoc,
          name: existingDoc.originalFileName,
          size: existingDoc.fileSize || 0,
          isExisting: true,
        };
        existingMap[doc.field] = {
          applicationDocumentId: existingDoc.applicationDocumentId,
          category: doc.category,
        };
      }
    });

    const form25Doc = documents.find((d) => d.documentCategory === FORM25_CATEGORY);
    if (form25Doc) {
      mappedFields.form25 = {
        ...form25Doc,
        name: form25Doc.originalFileName,
        size: form25Doc.fileSize || 0,
        isExisting: true,
      };
      existingMap.form25 = {
        applicationDocumentId: form25Doc.applicationDocumentId,
        category: FORM25_CATEGORY,
      };
    }

    reset({
      ...defaultValues,
      filingRoute:
        internationalPatent.filingRoute === 'PARIS' ? 'Paris' : internationalPatent.filingRoute || '',
      justification: internationalPatent.justification || '',
      ...mappedFields,
    });
    setExistingDocuments(existingMap);
    setDeletedDocumentIds([]);
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internationalPatent, reset]);

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
  // UPDATED FILE QUEUING & REMOVAL LOGIC (Synced with Startup Form)
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

    if (isUpdate && internationalPatent?.applicationId) {
      formData.append('Id', internationalPatent.applicationId);
    } else {
      formData.append('PriorArtApplicationId', payload.priorArtApplicationId);
      formData.append('ApplicantType', applicantType);
    }

    formData.append('FilingRoute', payload.filingRoute);
    formData.append('Justification', payload.justification);

    let replaceIndex = 0;
    const appendDocOrReplacement = (file, category, fieldName) => {
      if (!(file instanceof File)) return;
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
          if (!isDirty && isDraft) {
            toast.info('No changes detected.');
            return;
          }

          const formData = buildFormData(payload, { isUpdate: true });
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

  const onError = (validationErrors) => {
    const firstErrorKey = Object.keys(validationErrors)[0];
    const firstErrorMessage = validationErrors[firstErrorKey]?.message;
    toast.error(firstErrorMessage || 'Please check the required details.');
  };

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting || isDraftSubmitting) return;

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
      await onSubmit(getValues(), true);
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
    handleSubmit(() => {}, onError)();
  }, [isHydrated, searchParams, handleSubmit]);

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  // ----------------------------------------------------------------------

  const renderDocuments = () => (
    <Card
      sx={{
        borderRadius: 3,
        background: (theme) => `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
      }}
    >
      <CardHeader
        title="Upload Documents"
        subheader="Upload mandatory document (PDF only)"
        action={renderCollapseButton(openDocuments.value, openDocuments.onToggle)}
        sx={{ pb: 1 }}
      />
      <Collapse in={openDocuments.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          {DOCUMENTS.map((doc) => {
            const file = values[doc.field];
            const isUploaded = !!file;
            const isExisting = file?.isExisting;
            const uploadErrorMsg = fileErrors[doc.field] || errors?.[doc.field]?.message;

            return (
              <Box
                key={doc.field}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: 'background.paper',
                  border: (theme) =>
                    `1px solid ${
                      uploadErrorMsg
                        ? theme.palette.error.main
                        : isUploaded
                          ? theme.palette.success.main
                          : theme.palette.divider
                    }`,
                  borderLeft: (theme) =>
                    `4px solid ${
                      uploadErrorMsg
                        ? theme.palette.error.main
                        : isUploaded
                          ? theme.palette.success.main
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
                      <span>*</span>
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      PDF format
                    </Typography>
                  </Box>
                  <Button
                    component="label"
                    size="small"
                    variant={isUploaded ? 'soft' : 'outlined'}
                    disabled={isUploaded}
                    color={isUploaded ? 'success' : 'primary'}
                    startIcon={<Iconify icon={isUploaded ? 'eva:checkmark-circle-2-fill' : 'eva:cloud-upload-fill'} />}
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
                          setFileErrors((prev) => ({ ...prev, [doc.field]: 'File must be less than 5MB' }));
                          toast.error('File must be less than 5MB');
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
                        sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'error.lighter', color: 'error.main' } }}
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
  );

  const RenderRequiredDocumnets = () => (
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
    const form25Error = fileErrors.form25 || errors?.form25?.message;

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
                `1px solid ${
                  form25Error
                    ? theme.palette.error.main
                    : isUploaded
                      ? theme.palette.success.main
                      : theme.palette.divider
                }`,
              borderLeft: (theme) =>
                `4px solid ${
                  form25Error ? theme.palette.error.main : isUploaded ? theme.palette.success.main : 'transparent'
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
                variant={isUploaded ? 'soft' : 'outlined'}
                color={isUploaded ? 'success' : 'primary'}
                startIcon={<Iconify icon={isUploaded ? 'eva:checkmark-circle-2-fill' : 'eva:cloud-upload-fill'} />}
              >
                {isUploaded ? 'Replace' : 'Upload'}
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
                      setFileErrors((prev) => ({ ...prev, form25: 'File must be less than 5MB' }));
                      toast.error('File must be less than 5MB');
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

            {form25Error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {form25Error}
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
          <Field.Text
            name="justification"
            multiline
            rows={4}
            inputProps={{ maxLength: MAX_TEXT_LENGTH }}
            placeholder="Enter detailed justification..."
          />
        </Stack>
      </Collapse>
    </Card>
  );

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
        Save as Draft
      </LoadingButton>

      <LoadingButton
        type="button"
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
    if (priorArtId) {
      setValue('priorArtApplicationId', priorArtId, { shouldValidate: true });
    }
  }, [priorArtId, setValue]);

  return (
    <Form
      methods={methods}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 920, xl: 880 } }}>
        {renderLoadingOverlay()}
        {RenderRequiredDocumnets()}
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