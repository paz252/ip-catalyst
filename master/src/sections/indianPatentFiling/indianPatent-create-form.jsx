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

import { validateFileUpload, FILE_CATEGORIES, checkFileContent } from 'src/utils/file-validation';

import {
  createAndSubmitIndianPatent,
  updateIndianPatentDetails,
  submitIndianPatent
} from 'src/actions/indianPatentFiling';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PriorArtSelector } from 'src/components/priorArtSelector'
import { DownloadCard } from 'src/components/download-card/DownloadCard';

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UPLOAD_FILE_FIELDS = ['priorArtReport', 'organizationNoc', 'patentForm1', 'patentForm2', 'patentForm3'];

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

export const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .superRefine(async (file, ctx) => {
    const error = validateFileUpload(file, FILE_CATEGORIES.PDF);

    if (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error,
      });
    }

    const isSafe = await checkFileContent(file);

    if (!isSafe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File contains potentially malicious content and cannot be uploaded. Please Upload other file",
      });
    }
  });

const isPdfFile = (file) =>
  file?.name?.toLowerCase().endsWith('.pdf') && file.type === 'application/pdf';

export const IndianPatentCreateSchema = z.object({
  priorArtApplicationId: z.string().min(1, "Prior Art selection is required"),
  priorArtReport: fileSchema,
  organizationNoc: fileSchema,
  patentForm1: fileSchema,
  patentForm2: fileSchema,
  patentForm3: fileSchema,
}).superRefine((data, ctx) => {
  const filenames = [
    data.priorArtReport?.name,
    data.organizationNoc?.name,
    data.patentForm1?.name,
    data.patentForm2?.name,
    data.patentForm3?.name,
  ].filter(Boolean);

  const duplicates = filenames.filter((item, index) => filenames.indexOf(item) !== index);

  if (duplicates.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Duplicate files detected: ${duplicates[0]}. Each document must be a unique file.`,
      path: ['priorArtReport'],
    });
  }
});

const existingOrNewFile = (label) =>
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

export const IndianPatentUpdateSchema = z.object({
  priorArtApplicationId: z.string().min(1, 'Prior Art selection is required'),
  priorArtReport: existingOrNewFile('Positive Prior Art Search Report'),
  organizationNoc: existingOrNewFile('Organization NOC'),
  patentForm1: existingOrNewFile('Patent Form 1'),
  patentForm2: existingOrNewFile('Patent Form 2'),
  patentForm3: existingOrNewFile('Patent Form 3'),
});

// ----------------------------------------------------------------------

const DOCUMENTS = [
  {
    field: "priorArtReport",
    label: "Upload Positive Prior Art Search Report received from IP Catalyst",
    category: "PRIOR_ART_REPORT",
  },
  {
    field: "organizationNoc",
    label: "Upload No Objection Certificate (NoC) from Organization",
    category: "ORG_NOC",
  },
  {
    field: "patentForm1",
    label: "Upload Indian Patent Form 1 – Application for Grant of Patent",
    category: "PATENT_FORM_1",
  },
  {
    field: "patentForm2",
    label: "Upload Indian Patent Form 2 – Complete or Provisional Specification",
    category: "PATENT_FORM_2",
  },
  {
    field: "patentForm3",
    label: "Upload Indian Patent Form 3 – Statement and Undertaking regarding Foreign Applications",
    category: "PATENT_FORM_3",
  },
];

// ----------------------------------------------------------------------

export function IndianPatentCreateForm({ indianPatent }) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const priorArtId = searchParams.get('priorArtId');

  const openDocuments = useBoolean(true);
  const confirmSubmit = useBoolean();

  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [fileErrors, setFileErrors] = useState({});
  const [existingDocuments, setExistingDocuments] = useState({});
  const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);
  const [removedDocumentIds, setRemovedDocumentIds] = useState({});

  const defaultValues = {
    priorArtApplicationId: "",
    priorArtReport: null,
    organizationNoc: null,
    patentForm1: null,
    patentForm2: null,
    patentForm3: null,
  };

  const schema = indianPatent ? IndianPatentUpdateSchema : IndianPatentCreateSchema;
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
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (!indianPatent) return;

    setIsHydrated(false);

    const documents = indianPatent.documents || [];
    const mappedFiles = {};
    const existingMap = {};

    DOCUMENTS.forEach((document) => {
      const savedDocument = documents.find(
        (item) => item.documentCategory === document.category
      );
      if (!savedDocument) return;

      mappedFiles[document.field] = {
        ...savedDocument,
        name: savedDocument.originalFileName,
        size: savedDocument.fileSize || 0,
        isExisting: true,
      };
      existingMap[document.field] = {
        applicationDocumentId: savedDocument.applicationDocumentId,
        category: document.category,
      };
    });

    reset({
      ...defaultValues,
      priorArtApplicationId: indianPatent.priorArtApplicationId || '',
      ...mappedFiles,
    });
    setExistingDocuments(existingMap);
    setDeletedDocumentIds([]);
    setIsHydrated(true);

  }, [indianPatent, reset]);

  // ----------------------------------------------------------------------

  const handleRemoveFile = useCallback(
    (fieldName) => {
      const existingInfo = existingDocuments[fieldName];

      if (existingInfo) {
        setDeletedDocumentIds((prev) =>
          prev.includes(existingInfo.applicationDocumentId)
            ? prev
            : [...prev, existingInfo.applicationDocumentId]
        );

        // Keep the document ID associated with this field.
        // It may be used later if the user uploads a replacement.
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

  const buildFormData = (payload, { isUpdate = false } = {}) => {
    const formData = new FormData();

    if (isUpdate && indianPatent?.applicationId) {
      formData.append('Id', indianPatent.applicationId);
    }

    if (!isUpdate && payload.priorArtApplicationId) {
      formData.append('PriorArtApplicationId', payload.priorArtApplicationId);
    }

    DOCUMENTS.forEach((doc) => {
      const file = payload[doc.field];

      if (!(file instanceof File)) return;

      if (!isUpdate) {
        formData.append('Files', file);
        formData.append('DocumentCategories', doc.category);
        return;
      }

      const existingInfo = existingDocuments[doc.field];

      if (existingInfo) {
        formData.append('ReplacementFiles', file);
        formData.append(
          'ReplaceDocumentIds',
          existingInfo.applicationDocumentId
        );
      } else {
        formData.append('Documents', file);
      }
    });

    if (isUpdate) {
      deletedDocumentIds.forEach((id) => {
        formData.append('DocumentsToDelete', id);
      });
    }

    return formData;
  };

  const onSubmit = useCallback(
    async (payload, isDraft) => {
      setLoadingMsg(isDraft ? 'Saving draft...' : 'Submitting application...');

      try {
        if (indianPatent) {
          if (!isDraft && !payload.priorArtApplicationId) {
            toast.error('Please select a prior art application');
            return;
          }

          const formData = buildFormData(payload, { isUpdate: true });
          formData.append('IsDraft', String(isDraft));

          const result = await updateIndianPatentDetails(
            indianPatent.applicationId,
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
            finalResult = await submitIndianPatent(indianPatent.applicationId);
          }

          if (finalResult.success) {
            toast.success(finalResult.message || (isDraft ? 'Updated successfully!' : 'Submitted successfully!'));
            reset(payload);
            setDeletedDocumentIds([]);
            router.push(paths.dashboard.indianPatentFiling.root);
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

        const formData = buildFormData(payload, { isUpdate: false });
        const result = await createAndSubmitIndianPatent(formData, isDraft, (msg) => setLoadingMsg(msg));

        if (result.success) {
          toast.success(result.message || (isDraft ? 'Draft saved!' : 'Submitted successfully!'));
          router.push(paths.dashboard.indianPatentFiling.root);
        } else {
          setLoadingMsg(result.message || 'An error occurred');
          toast.error(result.message?.trim() || 'Action failed');
        }
      } catch (error) {
        console.error(error);
        toast.error(indianPatent ? 'Failed to update patent filing' : 'Failed to submit patent filing');
      } finally {
        setLoadingMsg('');
      }
    },
    [indianPatent, existingDocuments, deletedDocumentIds, reset, router]
  );

  const onError = (validationErrors) => {
    console.error("Validation Errors:", validationErrors);
    const firstErrorKey = Object.keys(validationErrors)[0];
    const firstErrorMessage = validationErrors[firstErrorKey]?.message;
    toast.error(firstErrorMessage || "Please check the required documents.");
  };

  const handleConfirmAndRun = () => {
    confirmSubmit.onFalse();
    setIsDraftAction(false);
    handleSubmit((payload) => onSubmit(payload, false), onError)();
  };

  useEffect(() => {
    if (!isHydrated || searchParams.get('finalSubmit') !== 'true') return;
    handleSubmit(() => { }, onError)();
  }, [isHydrated, searchParams, handleSubmit]);

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting || isDraftSubmitting) return;
    setIsDraftAction(true);
    setIsDraftSubmitting(true);
    try {
      await onSubmit(getValues(), true);
    } finally {
      setIsDraftSubmitting(false);
    }
  }, [isSubmitting, isDraftSubmitting, getValues, onSubmit]);

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify
        icon={value ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"}
      />
    </IconButton>
  );

  // ----------------------------------------------------------------------

  const renderDocuments = () => (
    <Card
      sx={{
        borderRadius: 3,
        background: (theme) => `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
        boxShadow: (theme) => theme.shadows[3],
      }}
    >
      <CardHeader
        title="Indian Patent Filing Documents"
        subheader="Upload all mandatory documents (PDF only)"
        action={renderCollapseButton(openDocuments.value, openDocuments.onToggle)}
        sx={{ pb: 1 }}
      />

      <Collapse in={openDocuments.value}>
        <Divider />
        <Stack spacing={2} sx={{ p: 2 }}>
          {DOCUMENTS.map((doc) => {
            const error = errors[doc.field];
            const file = values[doc.field];
            const isUploaded = !!file;
            const isExisting = file?.isExisting;
            const uploadErrorMsg = fileErrors[doc.field] || error?.message;

            return (
              <Box
                key={doc.field}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: "background.paper",
                  border: (theme) => `1px solid ${uploadErrorMsg ? theme.palette.error.main : isUploaded ? theme.palette.success.main : theme.palette.divider}`,
                  borderLeft: (theme) => `4px solid ${uploadErrorMsg ? theme.palette.error.main : isUploaded ? theme.palette.success.main : "transparent"}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[3],
                    borderColor: "primary.main",
                  },
                }}
              >
                {!!uploadErrorMsg && (
                  <Typography variant="caption" sx={{ color: 'error.main', mb: 1, display: 'block', fontWeight: 'bold' }}>
                    {uploadErrorMsg}
                  </Typography>
                )}

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {doc.label} <span>*</span>
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      PDF format • Max size recommended 5MB
                    </Typography>
                  </Box>

                  <Button
                    component="label"
                    size="small"
                    type="button"
                    variant={isUploaded ? "soft" : "outlined"}
                    color={isUploaded ? "success" : "primary"}
                    disabled={isUploaded}
                    startIcon={<Iconify icon={isUploaded ? "eva:checkmark-circle-2-fill" : "eva:cloud-upload-fill"} />}
                    sx={{ minWidth: 110, fontWeight: 500 }}
                  >
                    {isUploaded ? "Uploaded" : "Upload"}

                    <input
                      hidden
                      type="file"
                      accept=".pdf"
                      disabled={isUploaded}
                      onClick={(e) => e.stopPropagation()}
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

                        const isSafe = await checkFileContent(fileUpload);
                        if (!isSafe) {
                          setFileErrors((prev) => ({ ...prev, [doc.field]: 'File contains potentially malicious content and cannot be uploaded.' }));
                          toast.error('File contains potentially malicious content.');
                          e.target.value = '';
                          return;
                        }

                        const duplicateField = await findDuplicateFile(fileUpload, doc.field, getValues());
                        if (duplicateField) {
                          const message = `This file was already uploaded for another field. Each document must be a unique file.`;
                          setFileErrors((prev) => ({ ...prev, [doc.field]: message }));
                          toast.error(message);
                          e.target.value = '';
                          return;
                        }

                        setFileErrors((prev) => ({ ...prev, [doc.field]: null }));

                        const replacementDocument = existingDocuments[doc.field];

                        if (replacementDocument) {
                          // If this document was previously removed, this upload
                          // is actually a replacement for the original document.
                          setDeletedDocumentIds((prev) =>
                            prev.filter(
                              (id) => id !== replacementDocument.applicationDocumentId
                            )
                          );
                        }

                        setValue(doc.field, fileUpload, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });

                        methods.clearErrors(doc.field);
                        e.target.value = '';
                      }}
                    />
                  </Button>
                </Box>

                <Collapse in={isUploaded}>
                  {file && (
                    <Box
                      sx={{
                        mt: 1.8,
                        px: 1.5,
                        py: 1.2,
                        borderRadius: 2,
                        bgcolor: "background.neutral",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: (theme) => `1px dashed ${theme.palette.divider}`,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, overflow: "hidden" }}>
                        <Iconify icon="solar:file-text-bold" width={20} sx={{ color: isExisting ? "text.secondary" : "primary.main" }} />
                        <Box sx={{ overflow: "hidden" }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, display: "block", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {isExisting ? 'Already uploaded' : 'Ready to upload'}
                          </Typography>
                        </Box>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(doc.field)}
                        sx={{
                          bgcolor: "background.paper",
                          "&:hover": { bgcolor: "error.lighter", color: "error.main" },
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
  );

  const renderLoadingOverlay = () => (
    <Backdrop
      open={isSubmitting || isDraftSubmitting}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(2px)', bgcolor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <CircularProgress color="inherit" sx={{ mb: 2 }} />
      <Typography variant="h6">{loadingMsg || 'Saving Changes...'}</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>Please wait, do not refresh the page.</Typography>
    </Backdrop>
  );

  const renderPriorArtSelector = () => {
    if (priorArtId) return null;
    return (
      <PriorArtSelector
        value={watch("priorArtApplicationId")}
        onChange={(val) => setValue("priorArtApplicationId", val, { shouldValidate: true })}
      />
    );
  };

  const RenderRequiredDocumnets = () => (
    <DownloadCard
      title="Supporting Documents"
      description="Templates & sample files for Indian Patent filing"
      items={["NOC Template", "Form 1, 2, 3"]}
      downloadUrl="/templates/Indian-Patent-Required-Document.zip"
      fileName="Indian_Patent_Documents.zip"
    />
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
    <Form methods={methods} onSubmit={(event) => event.preventDefault()}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: "auto", maxWidth: { xs: 920, xl: 880 } }}>
        {renderLoadingOverlay()}
        {RenderRequiredDocumnets()}
        {renderPriorArtSelector()}
        {renderDocuments()}
        {renderActions()}
        {renderSubmitDialog()}
      </Stack>
    </Form>
  );
}