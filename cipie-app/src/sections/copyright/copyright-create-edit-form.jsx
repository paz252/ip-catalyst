import * as z from 'zod';
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
import { useRouter } from 'src/routes/hooks';

import { checkFileContent } from 'src/utils/file-validation';

import { createAndSubmitCopyrightFilingRequest } from 'src/actions/copyright';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

import { useAuthContext } from 'src/auth/hooks';

// -------------------------------------------------------------

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
const cleanTextMessage = 'Invalid characters. Please enter valid characters';

const fileSchema = (isRequired = false) => {
  const baseSchema = z.instanceof(File, { message: 'File is required' });

  const withValidation = baseSchema
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'File size must be less than 1MB',
    })
    .superRefine(async (file, ctx) => {
      const isSafe = await checkFileContent(file);

      if (!isSafe) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'File contains potentially malicious content. Please upload a valid file.',
        });
      }
    });

  if (!isRequired) {
    return z.union([withValidation, z.null(), z.undefined()]).optional();
  }

  return withValidation;
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
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: cleanTextMessage,
        });
      }
    });

export const CopyrightCreateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title is required')
      .max(200, 'Title cannot exceed 100 characters')
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
      .max(500, 'author names cannot exceed 100 characters')
      .regex(cleanTextRegex, { message: cleanTextMessage }),
    organization: optionalText(2, 200),
    ownershipType: z.string().min(1, 'Ownership type is required'),
    isWorkForHire: z.boolean(),
    publicationStatus: z.string().min(1, 'Publication status is required'),
    publicationDate: z
      .any()
      .optional()
      .transform((val) => (val ? new Date(val).toISOString() : null)),
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
        ctx.addIssue({
          path: ['publicationDate'],
          message: 'Publication date required',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.firstPublicationCountry) {
        ctx.addIssue({
          path: ['firstPublicationCountry'],
          message: 'Country required',
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // 2. Duplicate Filename Check
    const filenames = [
      data.workFile?.name,
      data.noc?.name,
      data.assignmentDeed?.name,
      data.additionalFiles?.name,
    ].filter(Boolean);

    const duplicates = filenames.filter((item, index) => filenames.indexOf(item) !== index);

    if (duplicates.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate file: ${duplicates[0]}. Please use unique files for each category.`,
        path: ['workFile'], // Highlights the primary file field
      });
    }
  });

const DOCUMENTS = [
  {
    field: 'workFile',
    label: 'Upload Work File / Sample Copy',
    category: 'WORK_FILE',
    required: true,
  },
  {
    field: 'noc',
    label: 'Upload No Objection Certificate (NoC)',
    category: 'NOC',
  },
  {
    field: 'assignmentDeed',
    label: 'Upload Assignment Deed / Ownership Proof',
    category: 'ASSIGNMENT_DEED',
  },
  {
    field: 'additionalFiles',
    label: 'Upload Additional Supporting Files',
    category: 'SUPPORTING_DOC',
  },
];

export const TYPEOFWORK_OPTIONS = [
  { value: '', label: 'Select option' }, // ✅ default
  {
    value: 'LITERARY',
    label: 'Literary',
    description: 'Books, articles, research papers, blogs',
  },
  {
    value: 'SOFTWARE',
    label: 'Software',
    description: 'Source code, applications, programs',
  },
  {
    value: 'ARTISTIC',
    label: 'Artistic',
    description: 'Drawings, paintings, designs',
  },
  {
    value: 'MUSICAL',
    label: 'Musical',
    description: 'Music compositions',
  },
  {
    value: 'CINEMATOGRAPH',
    label: 'Cinematograph Film',
    description: 'Movies, videos',
  },
  {
    value: 'SOUND_RECORDING',
    label: 'Sound Recording',
    description: 'Audio recordings, podcasts',
  },
];

export const OWNERSHIP_TYPE_OPTIONS = [
  { value: '', label: 'Select option' },
  {
    value: 'INDIVIDUAL',
    label: 'Individual',
  },
  {
    value: 'ORGANIZATION',
    label: 'Organization',
  },
  {
    value: 'JOINT',
    label: 'Joint Ownership',
  },
];

export const PUBLICATION_STATUS_OPTIONS = [
  { value: '', label: 'Select option' },
  {
    value: 'UNPUBLISHED',
    label: 'Unpublished',
  },
  {
    value: 'PUBLISHED',
    label: 'Published',
  },
];

// -------------------------------------------------------------

export function CopyrightCreateEditForm({ currentCopyright }) {
  const router = useRouter();
  const { user } = useAuthContext();

  const openWork = useBoolean(true);
  const openAuthor = useBoolean(true);
  const openPublication = useBoolean(true);
  const openAdditional = useBoolean(true);
  const openDocuments = useBoolean(true);
  const confirmSubmit = useBoolean();

  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);
  const [fileErrors, setFileErrors] = useState({});

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
    resolver: zodResolver(CopyrightCreateSchema),
    defaultValues,
    values: currentCopyright
      ? {
          ...currentCopyright,
          publicationDate: currentCopyright.publicationDate ?? '',
          firstPublicationCountry: currentCopyright.firstPublicationCountry ?? '',
          organization: currentCopyright.organization ?? '',
          language: currentCopyright.language ?? '',
          natureOfWork: currentCopyright.natureOfWork ?? '',
        }
      : defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { control } = methods;

  const values = watch();
  const publicationStatus = watch('publicationStatus');
  const isPublished = publicationStatus === 'PUBLISHED';

  useEffect(() => {
    if (currentCopyright?.documents) {
      const mappedDocs = currentCopyright.documents.map((doc) => ({
        ...doc,
        name: doc.originalFileName,
        isExisting: true,
      }));

      reset({
        ...currentCopyright,
        publicationDate: currentCopyright?.publicationDate ?? '',
        firstPublicationCountry: currentCopyright?.firstPublicationCountry ?? '',
        organization: currentCopyright?.organization ?? '',
        language: currentCopyright?.language ?? '',
        natureOfWork: currentCopyright?.natureOfWork ?? '',
        documents: mappedDocs,
      });
    }
  }, [currentCopyright, reset]);

  useEffect(() => {
    if (publicationStatus !== 'PUBLISHED') {
      setValue('publicationDate', '');
      setValue('firstPublicationCountry', '');
    }
  }, [publicationStatus, setValue]);

  // -------------------------------------------------------------

  const onSubmit = handleSubmit(async (payload) => {
    const formatStatus = (status) => {
      if (!status) return '';
      return status.charAt(0) + status.slice(1).toLowerCase();
    };

    try {
      const formData = new FormData();
      // console.log(payload)

      formData.append('Title', payload.title);
      formData.append('TypeOfWork', payload.typeOfWork);
      formData.append('Description', payload.description);

      formData.append('AuthorNames', payload.authorNames);
      formData.append('Organization', payload.organization || '');
      formData.append('OwnershipType', payload.ownershipType);
      formData.append('IsWorkForHire', payload.isWorkForHire);

      formData.append('PublicationStatus', formatStatus(payload.publicationStatus));
      if (isPublished) {
        formData.append('PublicationDate', payload.publicationDate);
        formData.append('FirstPublicationCountry', payload.firstPublicationCountry || '');
      }

      formData.append('NatureOfWork', payload.natureOfWork || '');
      formData.append('Language', payload.language || '');

      DOCUMENTS.forEach((doc) => {
        const file = payload[doc.field];
        if (file) {
          formData.append('Files', file);
          formData.append('DocumentCategories', doc.category);
        }
      });

      // console.log("FormData", formData)
      const result = await createAndSubmitCopyrightFilingRequest(
        formData,
        isDraftAction,
        (msg) => setLoadingMsg(msg) // Callback to update UI text
      );

      if (result.success) {
        toast.success(
          result.message || (isDraftAction ? 'Draft saved!' : 'Submitted successfully!')
        );
        router.push(paths.dashboard.copyright.root);
      } else {
        setLoadingMsg(result.message || 'An error occurred');
        toast.error(result.message || 'Action failed');
      }

      router.push(paths.dashboard.copyright.root);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Server connection failed.';

      toast.error(`Critical Failure: ${errorMessage}`);
    }
  });

  const onError = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorKey]?.message;

    toast.error(firstErrorMessage || 'Please check the required details.');
  };

  // -------------------------------------------------------------

  const handleConfirmAndRun = () => {
    confirmSubmit.onFalse();
    setIsDraftAction(false);
    methods.handleSubmit(onSubmit, onError)();
  };

  // -------------------------------------------------------------

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
      content={
        <>
          Are you sure you want to submit this application?
          {/* <br />
                    <strong>Once submitted, you will no longer be able to edit or delete this record.</strong> */}
        </>
      }
      action={
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmAndRun} // <--- Triggers the logic
        >
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

  // -------------------------------------------------------------

  const renderWorkDetails = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader
        title="Work Details"
        action={renderCollapseButton(openWork.value, openWork.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openWork.value}>
        <Divider />

        <Stack spacing={2} sx={{ p: 2 }}>
          <Field.Text name="title" label="Title of Work *" />

          <Field.Select
            fullWidth
            name="typeOfWork"
            label="Type of Work *"
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {TYPEOFWORK_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ textTransform: 'capitalize' }}
              >
                {option.value === '' ? <em>{option.label}</em> : option.label}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text name="description" label="Description of Work *" multiline rows={3} />
        </Stack>
      </Collapse>
    </Card>
  );

  // -------------------------------------------------------------

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
          <Field.Text name="authorNames" label="Author Name(s) *" />

          <Field.Text name="organization" label="Organization / Department" />

          <Field.Select
            fullWidth
            name="ownershipType"
            label="Ownership Type *"
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {OWNERSHIP_TYPE_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ textTransform: 'capitalize' }}
              >
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
            label="Publication Status *"
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
                label="Date of Publication *"
                InputLabelProps={{ shrink: true }}
              />

              <Field.Text name="firstPublicationCountry" label="Country of First Publication *" />
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

      <Stack spacing={2} sx={{ p: 2 }}>
        {DOCUMENTS.map((doc) => {
          const file = watch(doc.field);
          const error = methods.formState.errors[doc.field];
          return (
            <React.Fragment key={doc.field}>
              {/* Show Zod or Manual File Error */}
              {(error || fileErrors[doc.field]) && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: 'block', fontWeight: 'bold' }}
                >
                  {error?.message || fileErrors[doc.field]}
                </Typography>
              )}
              <Box
                key={doc.field}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: file ? 'success.main' : 'divider',
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">
                    {doc.label} {doc.required && '*'}
                  </Typography>
                  <Button component="label" variant="soft">
                    {file ? 'Change' : 'Upload'}
                    <input
                      hidden
                      type="file"
                      // onChange={(e) => setValue(doc.field, e.target.files?.[0])}

                      onChange={(e) => {
                        const fileUpload = e.target.files?.[0];
                        if (fileUpload && fileUpload.size > MAX_FILE_SIZE) {
                          // Set error for this field
                          setFileErrors((prev) => ({
                            ...prev,
                            [doc.field]: 'File must be less than 1MB',
                          }));
                          toast.error('File must be less than 1MB'); // optional global toast
                          return;
                        } else {
                          // Clear error if valid
                          setFileErrors((prev) => ({ ...prev, [doc.field]: null }));
                        }
                        setValue(doc.field, fileUpload, { shouldValidate: true });
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
    </Card>
  );

  const renderLoadingOverlay = () => (
    <Backdrop
      open={isSubmitting}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(2px)',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <CircularProgress color="inherit" sx={{ mb: 2 }} />
      <Typography variant="h6">Saving Changes...</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Please wait, do not refresh the page.
      </Typography>
    </Backdrop>
  );

  // -------------------------------------------------------------

  const renderActions = () => (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <LoadingButton
        type="submit"
        variant="soft"
        color="primary"
        size="small"
        loading={isSubmitting && isDraftAction}
        onClick={() => {
          setIsDraftAction(true);
        }}
      >
        {currentCopyright ? 'Save Changes' : 'Save as Draft'}
      </LoadingButton>

      {/* DIRECT SUBMIT BUTTON */}
      <LoadingButton
        variant="soft"
        color="warning"
        size="small"
        loading={isSubmitting && !isDraftAction}
        onClick={confirmSubmit.onTrue}
      >
        Submit Application
      </LoadingButton>
    </Box>
  );

  // -------------------------------------------------------------

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
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
      {/* <div>New Trademark</div> */}
    </Form>
  );
}
