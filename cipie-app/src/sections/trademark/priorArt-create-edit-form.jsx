import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createPriorArtSearch, initializeFullSubmission } from 'src/actions/~priorArt';
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const PriorArtCreateSchema = z.object({
  title: z.string().min(1, { message: 'Title is required!' }),

  problemStatement: z.string().min(20, {
    message: 'Problem statement must be at least 20 characters',
  }),

  solution: z.string().min(20, {
    message: 'Solution must be at least 20 characters',
  }),

  inventionDescription: z.string().min(50, {
    message: 'Invention description must be at least 50 characters',
  }),

  novelty: z.string().min(10, {
    message: 'Novelty is required!',
  }),

  apparatusDescription: z.string().optional(),

  keyComponents: z.string().optional(),

  technicalAdvantages: z.string().optional(),

  priorDisclosureHistory: z.string().optional(),

  relatedPublications: z.string().optional(),

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
          return true; // If it's already a string (URL), it's valid
        }),
      { message: 'Invalid file type. Only PDF, DOCX, and Images are allowed.' }
    ),
});

// ----------------------------------------------------------------------

export function PriorArtCreateEditForm({ currentPriorArt }) {
  const router = useRouter();
  const { user } = useAuthContext();

  // console.log(user);

  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);

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

  const methods = useForm({
    resolver: zodResolver(PriorArtCreateSchema),
    defaultValues,
    values: currentPriorArt,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentPriorArt?.documents) {
      // Map the existing documents so the UI can display their names
      const mappedDocs = currentPriorArt.documents.map((doc) => ({
        ...doc,
        name: doc.originalFileName, // 👈 This makes the name visible in the upload box
        size: doc.fileSize || 0, // 👈 Optional: shows file size if you have it
        isExisting: true, // 👈 Helper flag for our logic
      }));

      // Use 'reset' to fill the form with the application data + the visible filenames
      reset({
        ...currentPriorArt,
        documents: mappedDocs,
      });
    }
  }, [currentPriorArt, reset]);

  const onSubmit = handleSubmit(async (payload) => {
    let newApplicationId = null;

    try {
      // console.log("Starting Submission Process...", payload);

      const response = await createPriorArtSearch(payload);
      const { success, data, errors, message } = response;

      newApplicationId = data;

      // console.log('Step 1 Success. Application ID:', newApplicationId);

      // --- STEP 2: Initialize Submission (Doc Service + Workflow) ---
      const submissionData = {
        userId: user?.id,
        documents: payload.documents, // Array of File objects from your upload state
      };
      const submitResponse = await initializeFullSubmission(newApplicationId, submissionData);

      if (submitResponse.success) {
        toast.success('Draft saved successfully with documents!');
      }
      // reset();
      router.push(paths.dashboard.priorArtSearch.root);
    } catch (error) {
      console.error('Submission Error:', error);

      if (newApplicationId) {
        // SCENARIO: The record was created, but Step 2 (Files/Workflow) failed.
        // This happens during the 10060 Socket Timeout.
        toast.error(
          `Information saved as draft, but file upload/workflow failed. Please retry from the Drafts section.`,
          { duration: 8000 }
        );
      } else {
        // SCENARIO: The main database record couldn't be created.
        const errorMessage = error.response?.data?.message || 'Server connection failed.';
        toast.error(`Critical Failure: ${errorMessage}`);
      }
    }
  });

  // Add this below your onSubmit function
  const onError = (errors) => {
    console.error('Validation Errors:', errors);
    toast.error('Please check the form requirements.');
  };

  const handleRemoveFile = useCallback(
    (inputFile) => {
      // Filter the existing documents array to remove the selected file
      const filtered = values.documents && values.documents?.filter((file) => file !== inputFile);

      // Update the form state
      setValue('documents', filtered, { shouldValidate: true });
    },
    [setValue, values.documents]
  );

  const handleRemoveAllFiles = useCallback(() => {
    // Reset the documents array to empty
    setValue('documents', [], { shouldValidate: true });
  }, [setValue]);

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

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
          <Field.Text name="title" label="Title of Invention" />

          <Field.Text name="problemStatement" label="Problem Statement" multiline rows={3} />

          <Field.Text name="solution" label="Proposed Solution" multiline rows={3} />

          <Field.Text
            name="inventionDescription"
            label="Detailed Invention Description"
            multiline
            rows={4}
          />

          <Field.Text name="novelty" label="Novelty" multiline rows={2} />
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
            rows={2}
          />

          <Field.Text name="keyComponents" label="Key Components" multiline rows={2} />

          <Field.Text name="technicalAdvantages" label="Technical Advantages" multiline rows={2} />

          <Field.Text
            name="priorDisclosureHistory"
            label="Prior Disclosure History"
            multiline
            rows={2}
          />

          <Field.Text name="relatedPublications" label="Related Publications" multiline rows={2} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Supporting Documents</Typography>

            {currentPriorArt ? (
              // READ-ONLY VIEW (For Update)
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                  border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                }}
              >
                <Stack spacing={1}>
                  {values.documents.map((doc, index) => (
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
                        {doc.name}
                      </Typography>

                      {/* Optional: Show upload date from your JSON */}
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
                multiple
                name="documents"
                maxSize={10485760}
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
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {/* <FormControlLabel
                label="Publish"
                control={<Switch defaultChecked slotProps={{ input: { id: 'publish-switch' } }} />}
                sx={{ pl: 3, flexGrow: 1 }}
            /> */}

      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentPriorArt ? 'Save as draft' : 'Save changes'}
      </Button>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderProperties()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
