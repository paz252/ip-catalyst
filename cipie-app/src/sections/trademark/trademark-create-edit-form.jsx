import * as z from 'zod';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useCallback, useEffect } from 'react';

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

import {
  createAndSubmitTrademark,
  updateTrademark,
  submitTrademark,
} from 'src/actions/trademark';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE_LABEL = `${MAX_FILE_SIZE / (1024 * 1024)}MB`;

const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
const cleanTextMessage = 'Invalid characters. Please use only letters, numbers.';

const validateCleanText = (val) => {
  if (!val) return true;
  return cleanTextRegex.test(val);
};

// ----------------------------------------------------------------------
// Schemas
// ----------------------------------------------------------------------

export const TrademarkCreateSchema = z.object({
  trademarkName: z
    .string()
    .min(1, 'Trademark name is required!')
    .max(100, 'Trademark name cannot exceed 100 characters')
    .refine(validateCleanText, { message: cleanTextMessage }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters')
    .refine(validateCleanText, { message: cleanTextMessage }),
  organizations: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, 'Organization name is required')
          .max(100, 'Organization name cannot exceed 100 characters')
          .refine(validateCleanText, { message: cleanTextMessage }),
        address: z
          .string()
          .min(1, 'Organization address is required')
          .max(100, 'Address cannot exceed 100 characters')
          .refine(validateCleanText, { message: cleanTextMessage }),
        contactNumber: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .min(1, 'At least one organization is required'),
  inventors: z
    .array(
      z.object({
        fullName: z
          .string()
          .min(1, 'Inventor name is required')
          .max(100, 'Full name cannot exceed 100 characters')
          .refine(validateCleanText, { message: cleanTextMessage }),
        country: z.string().optional(),
        email: z.string().min(1, 'Email is required').email('Invalid email format'),
      })
    )
    .min(1, 'At least one inventor is required'),
  documents: z
    .array(
      z.union([
        z.string(),
        z.instanceof(File),
        z
          .object({
            applicationDocumentId: z.string().optional(),
            documentId: z.string().optional(),
            documentCategory: z.string().optional(),
            documentType: z.string().optional(),
            originalFileName: z.string().optional(),
            name: z.string().optional(),
            isExisting: z.boolean().optional(),
          })
          .passthrough(),
      ])
    )
    .optional()
    .default([])
    .refine((files) => files.every((file) => (file instanceof File ? file.size <= MAX_FILE_SIZE : true)), {
      message: `File size must not exceed ${MAX_FILE_SIZE_LABEL}.`,
    }),
});

export const TrademarkUpdateSchema = TrademarkCreateSchema;

// "Save as Draft" must not require the same fields a full Submit does —
// see handleSaveDraft below.
const DraftRequiredSchema = z.object({
  trademarkName: z
    .string()
    .min(1, 'Trademark name is required!')
    .max(100, 'Trademark name cannot exceed 100 characters')
    .refine(validateCleanText, { message: cleanTextMessage }),
});

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

const safeParseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// ----------------------------------------------------------------------

export function TrademarkCreateEditForm({ currentTrademark }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthContext();

  const openDetails = useBoolean(true);
  const openParticipants = useBoolean(true);
  const openDocuments = useBoolean(true);
  const confirmSubmit = useBoolean();

  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * Existing backend documents are kept separately from newly uploaded
   * File objects. This prevents backend document DTOs from being appended
   * to FormData as if they were actual Files.
   */
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [documentsToDelete, setDocumentsToDelete] = useState([]);

  const defaultValues = {
    trademarkName: '',
    description: '',
    organizations: [{ name: '', address: '', contactNumber: '', isPrimary: false }],
    inventors: [{ fullName: '', country: '', email: '' }],
    documents: [],
  };

  const methods = useForm({
    resolver: zodResolver(currentTrademark ? TrademarkUpdateSchema : TrademarkCreateSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    getValues,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const { control } = methods;

  // ----------------------------------------------------------------------
  // Populate form when editing an existing Trademark application
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!currentTrademark) {
      setExistingDocuments([]);
      setDocumentsToDelete([]);
      setIsHydrated(true);
      return;
    }

    setIsHydrated(false);

    const trademarkName = currentTrademark.trademarkName ?? '';
    const description = currentTrademark.description ?? '';
    const rawOrganizations = safeParseArray(currentTrademark.organizations);
    const rawInventors = safeParseArray(currentTrademark.inventors);
    const rawDocuments = safeParseArray(currentTrademark.documents);

    if (!('trademarkName' in currentTrademark) && !('applicationId' in currentTrademark)) {
      console.warn(
        'TrademarkCreateEditForm: currentTrademark does not look like a TrademarkDetailsDto — check what the parent page is passing in.'
      );
    }

    // --------------------------------------------------------------
    // Organizations
    // --------------------------------------------------------------
    const mappedOrganizations =
      rawOrganizations.length > 0
        ? rawOrganizations.map((organization) => ({
            name: organization?.name ?? '',
            address: organization?.address ?? '',
            contactNumber: organization?.contactNumber ?? '',
            isPrimary: organization?.isPrimary ?? false,
          }))
        : [{ name: '', address: '', contactNumber: '', isPrimary: false }];

    // --------------------------------------------------------------
    // Inventors
    // --------------------------------------------------------------
    const mappedInventors =
      rawInventors.length > 0
        ? rawInventors.map((inventor) => ({
            fullName: inventor?.fullName ?? '',
            country: inventor?.country ?? '',
            email: inventor?.email ?? '',
          }))
        : [{ fullName: '', country: '', email: '' }];

    // --------------------------------------------------------------
    // Existing documents
    // --------------------------------------------------------------
    const mappedExistingDocuments = rawDocuments
      .filter((document) => document && typeof document === 'object')
      .map((document) => ({
        applicationDocumentId: document?.applicationDocumentId ?? null,
        documentId: document?.documentId ?? null,
        documentCategory: document?.documentCategory ?? null,
        documentType: document?.documentType ?? null,
        originalFileName: document?.originalFileName ?? document?.fileName ?? document?.name ?? 'Attached Document',
        uploadedAt: document?.uploadedAt ?? null,
        isExisting: true,
      }));

    /**
     * Only existing documents are stored here.
     * They are NOT put into `documents` because Field.Upload expects
     * actual File objects for newly uploaded files.
     */
    setExistingDocuments(mappedExistingDocuments);
    setDocumentsToDelete([]);
    reset({
      ...defaultValues,
      trademarkName,
      description,
      organizations: mappedOrganizations,
      inventors: mappedInventors,
      documents: [],
    });
    
    setExistingDocuments(mappedExistingDocuments);
    setDocumentsToDelete([]);
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrademark, reset]);

  // ----------------------------------------------------------------------
  // Submit
  // ----------------------------------------------------------------------
  const onSubmit = useCallback(
    async (payload, isDraft) => {
      try {
        setLoadingMsg(isDraft ? 'Saving draft...' : 'Submitting application...');

        // ----------------------------------------------------------
        // UPDATE
        // ----------------------------------------------------------
        if (currentTrademark) {
          const applicationId = currentTrademark.applicationId;
          if (!applicationId) {
            toast.error('Application ID is missing. Unable to update the application.');
            return;
          }

          /**
           * Only actual newly uploaded File objects go into `documents`.
           */
          const newDocuments = (payload.documents || []).filter((document) => document instanceof File);
          const updatePayload = {
            ...payload,
            documents: newDocuments,
            documentsToDelete: [...documentsToDelete],
          };

          const updateResult = await updateTrademark(applicationId, updatePayload);
          if (!updateResult?.success) {
            setLoadingMsg(updateResult?.message || 'An error occurred');
            toast.error(updateResult?.message || 'Update failed');
            return;
          }

          let finalResult = updateResult;
          if (!isDraft) {
            finalResult = await submitTrademark(applicationId);
          }

          if (finalResult?.success) {
            toast.success(finalResult?.message || (isDraft ? 'Updated successfully!' : 'Submitted successfully!'));
            router.push(paths.dashboard.trademark.root);
          } else {
            setLoadingMsg(finalResult?.message || 'An error occurred');
            toast.error(finalResult?.message || 'Submit failed');
          }
          return;
        }

        // ----------------------------------------------------------
        // CREATE
        // ----------------------------------------------------------
        const result = await createAndSubmitTrademark(payload, isDraft, (msg) => setLoadingMsg(msg));

        if (result?.success) {
          toast.success(result?.message || (isDraft ? 'Draft saved!' : 'Submitted successfully!'));
          router.push(paths.dashboard.trademark.root);
        } else {
          setLoadingMsg(result?.message || 'An error occurred');
          toast.error(result?.message || 'Request failed');
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Server connection failed.';
        toast.error(`Critical Failure: ${errorMessage}`);
      } finally {
        setLoadingMsg('');
      }
    },
    [currentTrademark, router, documentsToDelete]
  );

  // ----------------------------------------------------------------------
  // Validation error
  // ----------------------------------------------------------------------
  const onError = (validationErrors) => {
    const firstErrorKey = Object.keys(validationErrors)[0];
    const firstError = validationErrors[firstErrorKey];
    const firstErrorMessage = firstError?.message || firstError?.root?.message;
    toast.error(firstErrorMessage || 'Please check the required details.');
  };

  // ----------------------------------------------------------------------
  // Final submit trigger
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!isHydrated || searchParams.get('finalSubmit') !== 'true') {
      return;
    }
    handleSubmit(() => {}, onError)();
  }, [isHydrated, searchParams, handleSubmit]);

  // ----------------------------------------------------------------------
  // Document handling
  // ----------------------------------------------------------------------
  const handleRemoveFile = useCallback(
    (inputFile) => {
      /**
       * If the removed item is an existing backend document, mark its
       * applicationDocumentId for deletion.
       */
      if (inputFile && !(inputFile instanceof File) && inputFile.isExisting && inputFile.applicationDocumentId) {
        setDocumentsToDelete((previous) => {
          if (previous.includes(inputFile.applicationDocumentId)) {
            return previous;
          }
          return [...previous, inputFile.applicationDocumentId];
        });
        setExistingDocuments((previous) =>
          previous.filter((document) => document.applicationDocumentId !== inputFile.applicationDocumentId)
        );
        return;
      }

      const currentDocuments = getValues('documents') || [];
      const filteredDocuments = currentDocuments.filter((file) => file !== inputFile);
      setValue('documents', filteredDocuments, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleRemoveAllFiles = useCallback(() => {
    // FIX: this used to search `getValues('documents')` for
    // existing-document objects to queue for deletion — but existing
    // documents are never stored there, only in the `existingDocuments`
    // state (that's the whole point of tracking them separately, per the
    // comment above). So `existingIds` was always empty, the deletion
    // branch never ran, and "Remove All" only ever cleared the on-screen
    // list — the backend never actually deleted those documents. Reading
    // from `existingDocuments` directly (which this callback already has
    // in scope) fixes that. This also exposed a dormant typo —
    // `newSet(...)` instead of `new Set(...)` — that would have thrown the
    // moment this branch actually ran; fixed alongside it.
    const existingIds = existingDocuments.map((document) => document.applicationDocumentId).filter(Boolean);

    if (existingIds.length > 0) {
      setDocumentsToDelete((previous) => [...new Set([...previous, ...existingIds])]);
    }

    setExistingDocuments([]);
    setValue('documents', [], { shouldValidate: true, shouldDirty: true });
  }, [existingDocuments, setValue]);

  // ----------------------------------------------------------------------
  // Submit handlers
  // ----------------------------------------------------------------------
  const handleConfirmAndRun = () => {
    confirmSubmit.onFalse();
    setIsDraftAction(false);
    handleSubmit((payload) => onSubmit(payload, false), onError)();
  };

  const handleSaveDraft = useCallback(async () => {
    if (isSubmitting || isDraftSubmitting) {
      return;
    }

    clearErrors(['trademarkName']);
    const currentValues = getValues();
    const draftValidation = DraftRequiredSchema.safeParse(currentValues);
    if (!draftValidation.success) {
      draftValidation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        setError(fieldName, { type: 'manual', message: issue.message });
      });
      return;
    }

    setIsDraftAction(true);
    setIsDraftSubmitting(true);
    try {
      await onSubmit(currentValues, true);
    } finally {
      setIsDraftSubmitting(false);
    }
  }, [isSubmitting, isDraftSubmitting, getValues, setError, clearErrors, onSubmit]);

  // ----------------------------------------------------------------------
  // UI helpers
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
      description="Templates & sample files for trademark filing"
      items={['NOC Template', 'Sample Application']}
      downloadUrl="/templates/Trademark-Required-Document.zip"
      fileName="Trademark_Documents.zip"
    />
  );

  // ----------------------------------------------------------------------
  // Details
  // ----------------------------------------------------------------------
  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Trademark Details"
        subheader="Basic trademark information"
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
      />
      <Collapse in={openDetails.value}>
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="trademarkName" label="Trademark Name" required />
          <Field.Text name="description" label="Description" multiline rows={3} required />
        </Stack>
      </Collapse>
    </Card>
  );

  // ----------------------------------------------------------------------
  // Participants
  // ----------------------------------------------------------------------
  const {
    fields: orgFields,
    append: addOrg,
    remove: removeOrg,
  } = useFieldArray({ control, name: 'organizations' });

  const {
    fields: inventorFields,
    append: addInventor,
    remove: removeInventor,
  } = useFieldArray({ control, name: 'inventors' });

  const renderParticipants = () => (
    <Card>
      <CardHeader
        title="Applicants / Organizations"
        subheader="People or organizations involved"
        action={renderCollapseButton(openParticipants.value, openParticipants.onToggle)}
      />
      <Collapse in={openParticipants.value}>
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          {/* ORGANIZATIONS */}
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">Organizations</Typography>
          </Stack>
          {orgFields.map((item, index) => (
            <Stack key={item.id} direction="row" spacing={2}>
              <Field.Text name={`organizations.${index}.name`} label="Organization Name" required />
              <Field.Text name={`organizations.${index}.address`} label="Address" required />
              <IconButton color="error" onClick={() => removeOrg(index)}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Stack>
          ))}
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => addOrg({ name: '', address: '', contactNumber: '', isPrimary: false })}
            sx={{ flexShrink: 0 }}
          >
            Add Organization
          </Button>

          <Divider sx={{ my: 2 }} />

          {/* INVENTORS */}
          <Typography variant="subtitle2">Inventors</Typography>
          {inventorFields.map((item, index) => (
            <Stack key={item.id} direction="row" spacing={2}>
              <Field.Text name={`inventors.${index}.fullName`} label="Full Name" required />
              <Field.Text name={`inventors.${index}.email`} label="Email" required />
              <IconButton color="error" onClick={() => removeInventor(index)}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Stack>
          ))}
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => addInventor({ fullName: '', country: '', email: '' })}
            sx={{ flexShrink: 0 }}
          >
            Add Inventor
          </Button>
        </Stack>
      </Collapse>
    </Card>
  );

  // ----------------------------------------------------------------------
  // Documents
  // ----------------------------------------------------------------------
  const renderDocuments = () => (
    <Card>
      <CardHeader
        title="Upload Image / Logo"
        subheader="Upload image files only (JPG, JPEG, PNG)."
        action={renderCollapseButton(openDocuments.value, openDocuments.onToggle)}
      />
      <Collapse in={openDocuments.value}>
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          {existingDocuments.length > 0 && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Existing Documents</Typography>
              {existingDocuments.map((document) => (
                <Stack
                  key={document.applicationDocumentId || document.documentId || document.originalFileName}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 2, py: 1 }}
                >
                  <Typography variant="body2" noWrap>
                    {document.originalFileName}
                  </Typography>
                  <IconButton color="error" size="small" onClick={() => handleRemoveFile(document)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          )}
          <Field.Upload
            multiple
            name="documents"
            maxSize={MAX_FILE_SIZE}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
          />
        </Stack>
      </Collapse>
    </Card>
  );

  // ----------------------------------------------------------------------
  // Actions
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
        {currentTrademark ? 'Save Changes' : 'Save as Draft'}
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

  // ----------------------------------------------------------------------
  // Loading overlay
  // ----------------------------------------------------------------------
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

  // ----------------------------------------------------------------------

  return (
    <Form methods={methods} onSubmit={(event) => event.preventDefault()}>
      <Stack spacing={4} sx={{ mx: 'auto', maxWidth: 880 }}>
        {renderLoadingOverlay()}
        {RenderRequiredDocumnets()}
        {renderDetails()}
        {renderParticipants()}
        {renderDocuments()}
        {renderActions()}
        {renderSubmitDialog()}
      </Stack>
    </Form>
  );
}