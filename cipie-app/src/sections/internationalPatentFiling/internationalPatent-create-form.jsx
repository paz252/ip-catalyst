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

import { FILE_CATEGORIES, validateFileUpload, checkFileContent } from 'src/utils/file-validation';

import { createAndSubmitInternationalPatent } from 'src/actions/internationalPatentFiling';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PriorArtSelector } from 'src/components/priorArtSelector';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

// ----------------------------------------------------------------------
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
const cleanTextMessage = "Invalid characters. Please use only letters, numbers, and standard punctuation characters";

export const InternationalPatentCreateSchema = z
  .object({
    priorArtApplicationId: z.string().min(1, "Prior Art selection is required"),
    organizationNoc: z.instanceof(File, { message: 'Organization NOC is required' })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "Max file size is 1MB",
      }),

    filingRoute: z.string().min(1, "Filing route is required"),
    form25: z
      .any()
      .optional()
      .refine((file) => {
        if (!file) return true;
        return file.size <= MAX_FILE_SIZE;
      }, {
        message: "Max file size is 1MB",
      }),
    justification: z.string().min(20, "Justification is required (min 20 chars)")
      .max(500, { message: 'Justification cannot exceed 500 characters' })
      .regex(cleanTextRegex, { message: cleanTextMessage }),
  })
  .superRefine((data, ctx) => {
    if (
      (data.filingRoute === "DirectForeign" ||
        data.filingRoute === "PCTWithoutIndian") &&
      !data.form25
    ) {
      ctx.addIssue({
        path: ["form25"],
        message: "Form 25 is required for selected route",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const InternationalPatentCreateSchemaNew = z.object({
  priorArtApplicationId: z
    .string()
    .min(1, "Prior Art selection is required"),

  organizationNoc: z
    .instanceof(File, { message: "Organization NOC is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 1MB",
    })
    .refine(async (file) => await checkFileContent(file), {
      message: "File contains forbidden content",
    }),

  filingRoute: z
    .string()
    .min(1, "Filing route is required"),

  form25: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    }, {
      message: "Max file size is 1MB",
    })
    .refine(async (file) => {
      if (!file) return true; // ✅ important fix
      return await checkFileContent(file);
    }, {
      message: "File contains forbidden content",
    }),

  justification: z
    .string()
    .min(20, "Justification is required (min 20 chars)")
    .regex(cleanTextRegex, { message: cleanTextMessage })
});



// ----------------------------------------------------------------------
const DOCUMENTS = [
  {
    field: "organizationNoc",
    label: "Upload No Objection Certificate (NoC) from Organization",
    category: "ORG_NOC",
  },
];

const FILING_ROUTES = [
  {
    value: "PARIS",
    label: "Paris Convention Route (with Indian Patent Filing)",
    description:
      "If you have already filed a patent application in India and are planning to file in foreign countries claiming priority from the Indian application.",
  },
  {
    value: "PCTWithIndian",
    label: "PCT Route (with Indian Patent Filing)",
    description:
      "If you have already filed a patent application in India and wish to file an international application under the PCT, followed by entry into selected countries.",
  },
  {
    value: "DirectForeign",
    label: "Direct Foreign Filing (with prior permission – Form 25)",
    description:
      "If you wish to file directly in foreign countries without using the Paris Convention or PCT route, you must obtain a Foreign Filing License (Form 25).",
  },
  {
    value: "PCTWithoutIndian",
    label: "PCT Route without Indian Filing (with Form 25)",
    description:
      "If you plan to file a PCT application directly without first filing in India, you must obtain a Foreign Filing License (Form 25).",
  },
];

// ----------------------------------------------------------------------

export function InternationalPatentCreateForm() {

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
    filingRoute: "",
    form25: null,
    justification: "",
  };

  const methods = useForm({
    resolver: zodResolver(InternationalPatentCreateSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, formState: { isSubmitting } } = methods;

  const values = watch();

  const filingRoute = watch("filingRoute");

  const showForm25 =
    filingRoute === "DirectForeign" ||
    filingRoute === "PCTWithoutIndian";

  // ----------------------------------------------------------------------

  const handleRemoveFile = useCallback(
    (fieldName) => {
      setValue(fieldName, null, { shouldValidate: true });
    },
    [setValue]
  );

  // ----------------------------------------------------------------------

  const onSubmit = handleSubmit(async (payload) => {
    {
      !payload.priorArtApplicationId && (
        toast.error(" Please select a prior art application")
      )
    }

    try {
      const formData = new FormData();

      formData.append(
        "PriorArtApplicationId",
        payload.priorArtApplicationId
      );

      formData.append("FilingRoute", payload.filingRoute);
      formData.append("Justification", payload.justification);

      if (payload.form25) {
        formData.append("Files", payload.form25);
        formData.append("DocumentCategories", "FORM_25");
      }

      DOCUMENTS.forEach((doc) => {

        const file = payload[doc.field];

        if (file) {
          formData.append("Files", file);
          formData.append("DocumentCategories", doc.category);
        }

      });

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const result = await createAndSubmitInternationalPatent(
        formData,
        isDraftAction,
        (msg) => setLoadingMsg(msg)
      );

      if (result.success) {
        toast.success(result.message || (isDraftAction ? 'Draft saved!' : 'Submitted successfully!'));
        router.push(paths.dashboard.internationalPatentFiling.root);
      } else {
        setLoadingMsg(result.message || 'An error occurred');
        toast.error(result.message || 'Action failed');
      }

    } catch (error) {

      console.error(error);
      toast.error("Failed to submit patent filing");

    }

  });

  const onError = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorKey]?.message;

    toast.error(firstErrorMessage || "Please check the required details.");
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
        // boxShadow: (theme) => theme.shadows[3],
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
                      {/* PDF format • Max size recommended 5MB */}
                      PDF format
                    </Typography>
                  </Box>

                  {/* ACTION BUTTON */}
                  <Button
                    component="label"
                    size="small"
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

                    <input
                      hidden
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        const fileUpload = e.target.files?.[0];

                        if (!fileUpload) return;

                        // 1. size check (sync)
                        if (fileUpload.size > MAX_FILE_SIZE) {
                          setFileErrors((prev) => ({
                            ...prev,
                            [doc.field]: "File must be less than 1MB",
                          }));
                          toast.error("File must be less than 1MB");
                          return;
                        }

                        // 2. clear size error
                        setFileErrors((prev) => ({ ...prev, [doc.field]: null }));

                        // 3. content check (async)
                        const isSafe = await checkFileContent(fileUpload);

                        if (!isSafe) {
                          setFileErrors((prev) => ({
                            ...prev,
                            [doc.field]: "File contains forbidden content",
                          }));
                          toast.error("File contains forbidden content");
                          return;
                        }

                        // 4. set value only if safe
                        setValue(doc.field, fileUpload, { shouldValidate: true });
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

  const RenderRequiredDocumnets = () => (
    <DownloadCard
      title="Supporting Documents"
      description="Templates & sample files for Foreign Patent filing"
      items={[
        "NOC Template", "Form-25"
      ]}
      downloadUrl="/templates/Foreign-Patent-Required-Document.zip"
      fileName="Foreign_Patent_Documents.zip"
    />
  )

  const renderFilingRoute = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardHeader title="Select Filing Route *" />

      <Stack spacing={2} sx={{ p: 2 }}>
        <Field.RadioGroup
          name="filingRoute"
          options={FILING_ROUTES}

        />
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

  const renderForm25 = () => {

    const file = values.form25;
    const isUploaded = !!file;

    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardHeader title="Upload Form 25 (Foreign Filing License)" />

        <Box sx={{ p: 2 }}>

          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "background.paper",
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
            }}
          >

            {/* TOP ROW */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Upload Form 25 <span>*</span>
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  PDF format only
                </Typography>
              </Box>

              {/* UPLOAD BUTTON */}
              <Button
                component="label"
                size="small"
                variant={isUploaded ? "soft" : "outlined"}
                color={isUploaded ? "success" : "primary"}
                startIcon={
                  <Iconify
                    icon={
                      isUploaded
                        ? "eva:checkmark-circle-2-fill"
                        : "eva:cloud-upload-fill"
                    }
                  />
                }
              >
                {isUploaded ? "Replace" : "Upload"}

                <input
                  hidden
                  type="file"
                  accept=".pdf"
                  // onChange={(e) => {
                  //   const fileUpload = e.target.files?.[0];
                  //   setValue("form25", fileUpload, {
                  //     shouldValidate: true,
                  //   });
                  // }}


                  onChange={async (e) => {
                    const fileUpload = e.target.files?.[0];
                    if (!fileUpload) return;

                    // 1. size check (sync)
                    if (fileUpload.size > MAX_FILE_SIZE) {
                      setFileErrors((prev) => ({
                        ...prev,
                        file: "File must be less than 1MB",
                      }));
                      toast.error("File must be less than 1MB");
                      return;
                    }

                    // 2. clear size error
                    setFileErrors((prev) => ({ ...prev, file: null }));

                    // 3. content check (async)
                    const isSafe = await checkFileContent(fileUpload);

                    if (!isSafe) {
                      setFileErrors((prev) => ({
                        ...prev,
                        file: "File contains forbidden content",
                      }));
                      toast.error("File contains forbidden content");
                      return;
                    }
                    setValue("form25", fileUpload, {
                      shouldValidate: true,
                    });
                  }}
                />
              </Button>

              {methods.formState.errors.form25 && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                  {methods.formState.errors.form25.message}
                </Typography>
              )}
            </Box>

            {/* FILE PREVIEW */}
            <Collapse in={isUploaded}>
              {file && (
                <Box
                  sx={{
                    mt: 2,
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
                      sx={{ color: "error.main" }}
                    />

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        maxWidth: 220,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {file.name}
                    </Typography>
                  </Box>

                  {/* REMOVE BUTTON */}
                  <IconButton
                    size="small"
                    onClick={() =>
                      setValue("form25", null, { shouldValidate: true })
                    }
                  >
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
      <CardHeader title="Foreign Filing Justification *" />

      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Include:
          <br />• Commercial potential / market relevance
          <br />• Technology Transfer opportunities
          <br />• Strategic importance
        </Typography>

        <Field.Text
          name="justification"
          multiline
          rows={4}
          placeholder="Enter detailed justification..."
        />
      </Stack>
    </Card>
  );

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

  useEffect(() => {
    if (!showForm25) {
      setValue("form25", null);
    }
  }, [showForm25, setValue]);

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
        {renderFilingRoute()}
        {showForm25 && renderForm25()}
        {renderJustification()}

        {renderActions()}
        {renderSubmitDialog()}


      </Stack>

    </Form>

  );

}