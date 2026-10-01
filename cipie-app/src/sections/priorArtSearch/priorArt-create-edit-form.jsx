import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useRouter } from 'src/routes/hooks';

import { checkFileContent } from 'src/utils/file-validation';

import { createAndSubmitPriorArt, updatePriorArtDetails } from 'src/actions/priorArt';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

import { useAuthContext } from 'src/auth/hooks';
import { setFormServerErrors } from 'src/auth/view/jwt/form-server-error-helper';

// ----------------------------------------------------------------------
// Maximum file size in bytes
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
// const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
// const cleanTextMessage =
//   'Invalid characters. Please use only letters, numbers, and standard punctuation characters';

// Modified
// const cleanTextRegex = /^[a-zA-Z0-9\s.,!?'"()\-_:;/&+=<>\[\]{}*@#°±≥≤%]+$/;
// const cleanTextMessage = 'Please enter valid text.';

const optionalStringValidation = z
  .string()
  .trim()
  // .regex(cleanTextRegex, { message: cleanTextMessage })
  .max(3000, { message: 'Cannot exceed 3000 characters' })
  .optional()
  .or(z.literal('')); // Allows the field to be completely empty

export const PriorArtCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, { message: 'Title must be at least 10 characters' })
    .max(200, { message: 'Title cannot exceed 200 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  problemStatement: z
    .string()
    .trim()
    .min(20, {
      message: 'Problem statement must be at least 20 characters',
    })
    .max(3000, { message: 'Problem Statement cannot exceed 3000 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  solution: z
    .string()
    .trim()
    .min(20, {
      message: 'Solution must be at least 20 characters',
    })
    .max(3000, { message: 'Solution cannot exceed 3000 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  inventionDescription: z
    .string()
    .trim()
    .min(20, {
      message: 'Invention description must be at least 20 characters',
    })
    .max(3000, { message: 'Invention Description cannot exceed 3000 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  novelty: z
    .string()
    .trim()
    .min(10, {
      message: 'Novelty is required',
    })
    .max(3000, { message: 'Novelty cannot exceed 3000 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  apparatusDescription: optionalStringValidation,

  keyComponents: optionalStringValidation,

  technicalAdvantages: optionalStringValidation,

  priorDisclosureHistory: optionalStringValidation,

  relatedPublications: optionalStringValidation,

  // Custom definition to allow 0 files
  documents: z
    .array(z.union([z.string(), z.instanceof(File)]))
    .optional()
    .default([])
    .refine(
      (files) =>
        files.every((file) => {
          if (file instanceof File) {
            const acceptedTypes = [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'image/jpeg',
              'image/png',
            ];
            return acceptedTypes.includes(file.type);
          }
          return true;
        }),
      { message: 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, and PNG are allowed.' }
    )
    .refine(
      (files) =>
        files.every((file) => {
          if (file instanceof File) {
            // console.log(`File size`, file.size);
            // console.log(MAX_FILE_SIZE);
            return file.size <= MAX_FILE_SIZE;
          }
          return true;
        }),
      { message: 'File size must not exceed 5 MB' }
    )
    .refine(
      async (files) => {
        const results = await Promise.all(
          files.map(async (file) => {
            if (file instanceof File) {
              return await checkFileContent(file);
            }
            return true;
          })
        );

        return results.every(Boolean);
      },
      { message: 'File contains unsafe content' }
    ),
});

export const PriorArtUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, { message: 'Title must be at least 10 characters' })
    .max(200, { message: 'Title cannot exceed 200 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  problemStatement: z
    .string()
    .trim()
    .min(20, {
      message: 'Problem statement must be at least 20 characters',
    })
    .max(3000, { message: 'Problem Statement cannot exceed 3000 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  solution: z
    .string()
    .trim()
    .min(20, {
      message: 'Solution must be at least 20 characters',
    })
    .max(3000, { message: 'Solution cannot exceed 3000 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  inventionDescription: z
    .string()
    .trim()
    .min(50, {
      message: 'Invention description must be at least 50 characters',
    })
    .max(3000, { message: 'Invention Description cannot exceed 3000 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  novelty: z
    .string()
    .trim()
    .min(10, {
      message: 'Novelty is required',
    })
    .max(3000, { message: 'Novelty cannot exceed 3000 characters' }),
  // .regex(cleanTextRegex, { message: cleanTextMessage }),

  apparatusDescription: optionalStringValidation,

  keyComponents: optionalStringValidation,

  technicalAdvantages: optionalStringValidation,

  priorDisclosureHistory: optionalStringValidation,

  relatedPublications: optionalStringValidation,
});

// ----------------------------------------------------------------------

export function PriorArtCreateEditForm({ currentPriorArt }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);
  const confirmSubmit = useBoolean();

  // Track which step is running for the progress indicator
  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);

  const [submissionStatus, setSubmissionStatus] = useState('loading');

  const defaultValues = {
    title: '',
    problemStatement: '',
    solution: '',
    inventionDescription: '',
    novelty: '',
    apparatusDescription: '',
    keyComponents: '',
    technicalAdvantages: '',
    priorDisclosureHistory: '',
    relatedPublications: '',
    documents: [],
  };

  const schema = currentPriorArt ? PriorArtUpdateSchema : PriorArtCreateSchema;

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    values: currentPriorArt,
  });

  const {
    reset,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPriorArt?.documents) {
      const mappedDocs = currentPriorArt.documents.map((doc) => ({
        ...doc,
        name: doc.originalFileName,
        size: doc.fileSize || 0,
        isExisting: true,
      }));

      reset({
        ...currentPriorArt,
        documents: mappedDocs,
      });
    }
  }, [currentPriorArt, reset]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // If the form is modified OR currently saving, show the browser warning
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ''; // Required by most browsers to trigger the dialog
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  useEffect(() => {
    const validateFiles = async () => {
      if (!values.documents || values.documents.length === 0) return;

      const validFiles = [];
      const invalidFiles = [];

      for (const file of values.documents) {
        if (file instanceof File) {
          const isSafe = await checkFileContent(file);

          if (isSafe) {
            validFiles.push(file);
          } else {
            invalidFiles.push(file);
          }
        } else {
          // existing files (strings/objects)
          validFiles.push(file);
        }
      }

      // If any invalid files found → update state
      if (invalidFiles.length > 0) {
        setValue('documents', validFiles, { shouldValidate: true });

        invalidFiles.forEach((file) => {
          toast.error(`${file.name} contains unsafe content`);
        });
      }
    };

    validateFiles();
  }, [values.documents, setValue]);

  const onSubmit = handleSubmit(async (payload) => {
    try {
      if (currentPriorArt && !isDirty) {
        toast.info('No changes detected.');
        return;
      }
      setSubmissionStatus('loading');

      let result;

      if (currentPriorArt) {
        result = await updatePriorArtDetails(currentPriorArt.applicationId, {
          id: currentPriorArt.applicationId,
          ...payload,
        });
      } else {
        result = await createAndSubmitPriorArt(payload, isDraftAction, (msg) => setLoadingMsg(msg));
      }

      if (result.success) {
        setSubmissionStatus('success');
        reset(payload);
        toast.success(
          result.message || (currentPriorArt ? 'Updated successfully!' : 'Saved successfully!')
        );
        // setTimeout(() => {
        //     router.push(paths.dashboard.priorArtSearch.root);
        // }, 15000);
        router.push(paths.dashboard.priorArtSearch.root);
      } else {
        setSubmissionStatus('error');

        const errorMessage =
          result.errors?.length > 0 ? result.errors : [result.message || 'Action failed'];
        // setFormServerErrors(result, setError);
        // toast.error('Validation error');
        setLoadingMsg(errorMessage);

        toast.error(
          <div style={{ width: '100%' }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: '15px',
                marginBottom: '8px',
              }}
            >
              Upload failed
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
              }}
            >
              {errorMessage.map((error, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: '6px',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                  }}
                >
                  {error}
                </li>
              ))}
            </ul>
          </div>,
          {
            autoClose: 50000,
            closeOnClick: true,
            pauseOnHover: true,
            style: {
              width: '550px',
              maxWidth: 'calc(100vw - 40px)',
            },
          }
        );
      }
    } catch (error) {
      setSubmissionStatus('error');
      setLoadingMsg('Critical system error');
      console.error('Submission Error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoadingMsg('');
    }
  });

  const onError = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorKey]?.message;

    toast.error(firstErrorMessage || 'Please check the required details.');
  };

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const currentDocs = methods.getValues('documents') || [];

      const filtered = currentDocs.filter((file) => file !== inputFile);

      setValue('documents', filtered, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, methods]
  );

  const handleRemoveAllFiles = useCallback(() => {
    // Reset the documents array to empty
    setValue('documents', [], { shouldValidate: true });
  }, [setValue]);

  // const handleSaveDraft = () => {
  //   console.log(isDraftAction);
  //   setIsDraftAction(true);
  //   methods.handleSubmit(onSubmit, onError)();
  // };

  //   const handleSaveDraft = () => {
  //   console.log('Saving as draft');

  //   methods.handleSubmit(
  //     (payload) => onSubmit(payload, true),
  //     onError
  //   )();
  // };
  const handleConfirmAndRun = () => {
    confirmSubmit.onFalse();
    setIsDraftAction(false);
    methods.handleSubmit(onSubmit, onError)();
  };

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const RenderRequiredDocumnets = () => (
    <DownloadCard
      title="Supporting Documents"
      description="Invention disclosure form for reference"
      items={['Invention disclosure form']}
      downloadUrl="/templates/Prior-Art-Invention-Disclosure-Form.zip"
      fileName="Prior_art_Documents.zip"
    />
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

  const renderCharacterCount = (name, maxLength = 3000) => {
    const value = values?.[name] || '';

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: -2,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {value.length} / {maxLength}
        </Typography>
      </Box>
    );
  };

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Invention Details"
        subheader="Core information about the invention"
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="title" label="Title of Invention" required />

          <Field.Text
            name="problemStatement"
            label="Problem Statement"
            multiline
            rows={6}
            required
          />
          {renderCharacterCount('problemStatement')}

          <Field.Text name="solution" label="Proposed Solution" multiline rows={6} required />
          {renderCharacterCount('solution')}

          <Field.Text
            name="inventionDescription"
            label="Detailed Invention Description"
            multiline
            rows={6}
            required
          />
          {renderCharacterCount('inventionDescription')}

          <Field.Text name="novelty" label="Novelty" multiline rows={6} required />
          {renderCharacterCount('novelty')}
        </Stack>
      </Collapse>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Technical Information"
        subheader="Additional technical details"
        action={renderCollapseButton(openProperties.value, openProperties.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openProperties.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text
            name="apparatusDescription"
            label="Apparatus Description"
            multiline
            rows={6}
          />
          {renderCharacterCount('apparatusDescription')}

          <Field.Text name="keyComponents" label="Key Components" multiline rows={6} />
          {renderCharacterCount('keyComponents')}

          <Field.Text name="technicalAdvantages" label="Technical Advantages" multiline rows={6} />
          {renderCharacterCount('technicalAdvantages')}

          <Field.Text
            name="priorDisclosureHistory"
            label="Prior Disclosure History"
            multiline
            rows={6}
          />
          {renderCharacterCount('priorDisclosureHistory')}

          <Field.Text name="relatedPublications" label="Related Publications" multiline rows={6} />
          {renderCharacterCount('relatedPublications')}

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Upload Document</Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, PNG, JPEG
            </Typography>

            {currentPriorArt ? (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                  border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                }}
              >
                <Stack spacing={1}>
                  {currentPriorArt?.documents.map((doc, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      sx={{
                        p: 1,
                        borderRadius: 0.75,
                        bgcolor: 'background.paper',
                        border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                      }}
                    >
                      <Iconify
                        icon="solar:file-text-bold-duotone"
                        width={24}
                        sx={{ mr: 1, color: 'text.secondary' }}
                      />

                      <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 'medium' }}>
                        {doc.originalFileName}
                      </Typography>

                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}
                      </Typography>
                    </Stack>
                  ))}

                  {values.documents.length === 0 && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontStyle: 'italic' }}
                    >
                      No documents attached to this application.
                    </Typography>
                  )}
                </Stack>
              </Box>
            ) : (
              // UPLOAD VIEW (For New Draft)
              <Field.Upload
                name="documents"
                multiple
                maxFiles={10}
                maxSize={20 * 1024 * 1024}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                    '.docx',
                  ],
                  'image/*': ['.jpeg', '.jpg', '.png'],
                }}
              />
            )}
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <LoadingButton
        type="submit"
        variant="soft"
        color="primary"
        size="small"
        disabled={currentPriorArt && !isDirty}
        loading={isSubmitting && isDraftAction}
        // onClick={handleSaveDraft}
        onClick={() => {
          setIsDraftAction(true);
        }}
      >
        {currentPriorArt ? 'Update Details' : 'Save as Draft'}
      </LoadingButton>

      {/* Hide or change the 'Submit' button for updates 
           if your logic dictates that 'Submit' is a one-time final action 
        */}
      {!currentPriorArt && (
        <LoadingButton
          variant="soft"
          color="warning"
          size="small"
          disabled={currentPriorArt && !isDirty}
          //   loading={isSubmitting && !isDraftAction}
          onClick={confirmSubmit.onTrue}
        >
          Submit Application
        </LoadingButton>
      )}
    </Box>
  );

  const renderSubmitDialog = () => (
    <ConfirmDialog
      open={confirmSubmit.value}
      onClose={confirmSubmit.onFalse}
      title="Submit Application"
      content={
        <>
          Are you sure you want to submit this application?
          <br />
          <strong>Once submitted, you will no longer be able to edit or delete this record.</strong>
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

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderLoadingOverlay()}
        {RenderRequiredDocumnets()}
        {renderDetails()}
        {renderProperties()}
        {renderActions()}

        {renderSubmitDialog()}
      </Stack>
    </Form>
  );
}
