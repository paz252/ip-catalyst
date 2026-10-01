import * as z from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { createAndSubmitIndianPatent } from 'src/actions/indianPatentFiling';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PriorArtSelector } from 'src/components/priorArtSelector'
import { DownloadCard } from 'src/components/download-card/DownloadCard';

// ----------------------------------------------------------------------

export const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .superRefine(async(file, ctx) => {
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

export const IndianPatentCreateSchema = z.object({
  priorArtApplicationId: z.string().min(1, "Prior Art selection is required"),
  priorArtReport: fileSchema,
  organizationNoc: fileSchema,
  patentForm1: fileSchema,
  patentForm2: fileSchema,
  patentForm3: fileSchema,
}).superRefine((data, ctx) => {
  // Extract all filenames from the fields
  const filenames = [
    data.priorArtReport?.name,
    data.organizationNoc?.name,
    data.patentForm1?.name,
    data.patentForm2?.name,
    data.patentForm3?.name,
  ].filter(Boolean);

  // Check for duplicates
  const duplicates = filenames.filter((item, index) => filenames.indexOf(item) !== index);

  if (duplicates.length > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Duplicate files detected: ${duplicates[0]}. Each document must be a unique file.`,
      path: ['priorArtReport'], // Highlights the field
    });
  }
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

export function IndianIndustrialDesignCreateForm({indianPatent}) {

  const router = useRouter();

  const searchParams = useSearchParams();

  const priorArtId = searchParams.get('priorArtId');

  const openDocuments = useBoolean(true);
  const confirmSubmit = useBoolean();

  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);
  const [fileErrors, setFileErrors] = useState({});

  const defaultValues = {
    priorArtApplicationId: "",
    priorArtReport: null,
    organizationNoc: null,
    patentForm1: null,
    patentForm2: null,
    patentForm3: null,
  };

  const methods = useForm({
    resolver: zodResolver(IndianPatentCreateSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, formState: { isSubmitting } } = methods;

  const values = watch();

  // ----------------------------------------------------------------------

  const handleRemoveFile = useCallback(
    (fieldName) => {
      setValue(fieldName, null, { shouldValidate: true });
    },
    [setValue]
  );

  // ----------------------------------------------------------------------

  const onSubmit = handleSubmit(async (payload) => {
    if (!payload.priorArtApplicationId) {
      toast.error("Please select a prior art application");
      return;
    }

    try {
      const formData = new FormData();

      // REQUIRED FIELD
      formData.append(
        "PriorArtApplicationId",
        payload.priorArtApplicationId
      );

      const selectedFiles = DOCUMENTS.map(d => payload[d.field]?.name).filter(Boolean);
      const hasDuplicates = new Set(selectedFiles).size !== selectedFiles.length;

      if (hasDuplicates) {
        toast.error("Each uploaded document must have a unique filename.");
        return;
      }

      let fileIndex = 0;

      DOCUMENTS.forEach((doc) => {
        const file = payload[doc.field];

        if (file) {
          formData.append("Files", file);
          formData.append("DocumentCategories", doc.category);
          fileIndex++;
        }
      });

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const result = await createAndSubmitIndianPatent(
        formData,
        isDraftAction,
        (msg) => setLoadingMsg(msg) // Callback to update UI text
      );

      console.log('Result', result)

      if (result.success) {
        toast.success(result.message || (isDraftAction ? 'Draft saved!' : 'Submitted successfully!'));
        router.push(paths.dashboard.indianPatentFiling.root);
      } else {
        setLoadingMsg(result.message || 'An error occurred');
        toast.error(result.message?.trim() || 'Action failed');
      }

    } catch (error) {

      console.error(error);
      toast.error("Failed to submit patent filing");

    }

  });

  const onError = (errors) => {
    console.error("Validation Errors:", errors);
    // Get the first error message from the object
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorKey]?.message;

    toast.error(firstErrorMessage || "Please check the required documents.");
  };

  // ----------------------------------------------------------------------

  const handleConfirmAndRun = () => {
    confirmSubmit.onFalse();
    setIsDraftAction(false);
    methods.handleSubmit(onSubmit, onError)();
  };

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify
        icon={value
          ? "eva:arrow-ios-downward-fill"
          : "eva:arrow-ios-forward-fill"}
      />
    </IconButton>
  );

  // ----------------------------------------------------------------------

  const renderDocuments = () => (

    <Card
      sx={{
        borderRadius: 3,
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
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
            const error = methods.formState.errors[doc.field];
            const file = values[doc.field];
            const isUploaded = !!file;

            return (
              <Box
                key={doc.field}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: "background.paper",
                  // bgcolor: isUploaded ? "rgba(76, 175, 80, 0.06)" : "background.paper",

                  border: (theme) =>
                    `1px solid ${isUploaded
                      ? theme.palette.success.main
                      : theme.palette.divider
                    }`,

                  borderLeft: (theme) =>
                    `4px solid ${isUploaded
                      ? theme.palette.success.main
                      : "transparent"
                    }`,

                  transition: "all 0.2s ease",

                  "&:hover": {
                    boxShadow: (theme) => theme.shadows[3],
                    borderColor: "primary.main",
                  },
                }}
              >

                {!!error && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mb: 1, display: 'block', fontWeight: 'bold' }}
                  >
                    {error.message}
                  </Typography>
                )}

                {/* TOP ROW */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  {/* LABEL + REQUIRED */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                    >
                      {doc.label} <span>*</span>
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      PDF format • Max size recommended 1MB
                      {/* PDF format */}
                    </Typography>
                  </Box>

                  {/* ACTION BUTTON */}
                  <Button
                    component="label"
                    size="small"
                    type="button"
                    // variant={isUploaded ? "contained" : "outlined"}
                    variant={isUploaded ? "soft" : "outlined"}

                    color={isUploaded ? "success" : "primary"}
                    startIcon={
                      <Iconify
                        icon={isUploaded
                          ? "eva:checkmark-circle-2-fill"
                          : "eva:cloud-upload-fill"}
                      />
                    }
                    sx={{
                      minWidth: 110,
                      fontWeight: 500,
                    }}
                  >
                    {isUploaded ? "Uploaded" : "Upload"}

                    {/* <input
                      hidden
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const fileUpload = e.target.files?.[0];
                        if (fileUpload && fileUpload.size > MAX_FILE_SIZE) {
                          toast.error("File must be less than 5MB");
                          return;
                        }
                        setValue(doc.field, fileUpload, { shouldValidate: true });
                      }}
                    /> */}
                    <input
                      hidden
                      type="file"
                      accept=".pdf"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const fileUpload = e.target.files?.[0];

                        setFileErrors((prev) => ({ ...prev, [doc.field]: null }));

                        setValue(doc.field, fileUpload, { shouldValidate: true  });

                        methods.clearErrors(doc.field);
                      }}
                    />
                  </Button>

                </Box>

                {fileErrors[doc.field] && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {fileErrors[doc.field]}
                  </Typography>
                )}

                {/* FILE PREVIEW */}
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
                        border: (theme) =>
                          `1px dashed ${theme.palette.divider}`,
                      }}
                    >

                      {/* FILE INFO */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.2,
                          overflow: "hidden",
                        }}
                      >
                        <Iconify
                          icon="solar:file-text-bold"
                          width={20}
                          sx={{ color: "primary.main" }}
                        />

                        <Box sx={{ overflow: "hidden" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              display: "block",
                              maxWidth: 220,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            Ready to upload
                          </Typography>
                        </Box>
                      </Box>

                      {/* DELETE */}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(doc.field)}
                        sx={{
                          bgcolor: "background.paper",
                          "&:hover": {
                            bgcolor: "error.lighter",
                            color: "error.main",
                          },
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

  const renderPriorArtSelector = () => {
    if (priorArtId) return null;

    return (
      <PriorArtSelector
        value={watch("priorArtApplicationId")}
        onChange={(val) =>
          setValue("priorArtApplicationId", val, { shouldValidate: true })
        }
      />
    );
  };

  const RenderRequiredDocumnets = () => (
    <DownloadCard
      title="Supporting Documents"
      description="Templates & sample files for Indian Patent filing"
      items={[
        "NOC Template", "Form 1, 2, 3"
      ]}
      downloadUrl="/templates/Indian-Patent-Required-Document.zip"
      fileName="Indian_Patent_Documents.zip"
    />
  )

  // ----------------------------------------------------------------------
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
        Save as Draft
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

  useEffect(() => {
    if (priorArtId) {
      setValue('priorArtApplicationId', priorArtId, {
        shouldValidate: true,
      });
    }
  }, [priorArtId, setValue]);

  // ----------------------------------------------------------------------

  return (

    <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>

      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{
          mx: "auto",
          maxWidth: { xs: 920, xl: 880 }
        }}
      >
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