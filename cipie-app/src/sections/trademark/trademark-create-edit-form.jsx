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
import { useRouter } from 'src/routes/hooks';

import { createAndSubmitTrademark } from 'src/actions/trademark';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DownloadCard } from 'src/components/download-card/DownloadCard';

import { useAuthContext } from 'src/auth/hooks';


// -------------------------------------------------------------
// Maximum file size in bytes
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
const cleanTextMessage = "Invalid characters. Please use only letters, numbers.";

const validateCleanText = (val) => {
    if (!val) return true; // ✅ skip empty → let required handle it
    return cleanTextRegex.test(val);
};

export const TrademarkCreateSchema = z.object({

    trademarkName: z.string()
        .min(1, 'Trademark name is required!')
        .max(100, 'Trademark name cannot exceed 100 characters')
        .refine(validateCleanText, { message: cleanTextMessage }),

    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description cannot exceed 500 characters')
        .refine(validateCleanText, { message: cleanTextMessage }),

    organizations: z.array(
        z.object({
            name: z.string()
                .min(1, 'Organization name is required')
                .max(100, 'Organization name cannot exceed 100 characters')
                .refine(validateCleanText, { message: cleanTextMessage }),

            address: z.string()
                .max(100, 'Address cannot exceed 100 characters')
                .optional()
                .refine(validateCleanText, { message: cleanTextMessage }),
        })
    ).min(1, 'At least one organization is required'),

    inventors: z.array(
        z.object({
            fullName: z.string()
                .min(1, 'Inventor name is required')
                .max(100, 'Full name cannot exceed 100 characters')
                .refine(validateCleanText, { message: cleanTextMessage }),

            email: z.string()
                .min(1, 'Email is required')
                .email('Invalid email format')
            // .or(z.literal('')), // ✅ allow empty without triggering email error
        })
    ).min(1, 'At least one inventor is required'),

    documents: z.array(z.union([z.string(), z.instanceof(File)]))
        .optional()
        .default([])
        .refine(
            (files) =>
                files.every((file) =>
                    file instanceof File ? file.size <= MAX_FILE_SIZE : true
                ),
            { message: 'File size must not exceed 1 MB.' }
        ),
});

// -------------------------------------------------------------

export function TrademarkCreateEditForm({ currentTrademark }) {

    const router = useRouter();
    const { user } = useAuthContext();

    const openDetails = useBoolean(true);
    const openParticipants = useBoolean(true);
    const openDocuments = useBoolean(true);
    const confirmSubmit = useBoolean();

    const [loadingMsg, setLoadingMsg] = useState('');
    const [isDraftAction, setIsDraftAction] = useState(false);

    const defaultValues = {
        trademarkName: '',
        description: '',
        organizations: [{ name: '', address: '' }],
        inventors: [{ fullName: '', email: '' }],
        documents: [],
    };

    const methods = useForm({
        resolver: zodResolver(TrademarkCreateSchema),
        defaultValues,
        values: currentTrademark,
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

    useEffect(() => {
        if (currentTrademark?.documents) {

            const mappedDocs = currentTrademark.documents.map((doc) => ({
                ...doc,
                name: doc.originalFileName,
                isExisting: true,
            }));

            reset({
                ...currentTrademark,
                documents: mappedDocs,
            });
        }
    }, [currentTrademark, reset]);

    // -------------------------------------------------------------

    const onSubmit = handleSubmit(async (payload) => {

        try {

            const result = await createAndSubmitTrademark(
                payload,
                isDraftAction,
                (msg) => setLoadingMsg(msg) // Callback to update UI text
            );

            if (result.success) {
                toast.success(result.message || (isDraftAction ? 'Draft saved!' : 'Submitted successfully!'));
                router.push(paths.dashboard.trademark.root);
            } else {
                setLoadingMsg(result.message || 'An error occurred');
                toast.error(result.message || 'Request failed');
            }

            router.push(paths.dashboard.trademark.root);

        } catch (error) {

            const errorMessage =
                error.response?.data?.message || 'Server connection failed.';

            toast.error(`Critical Failure: ${errorMessage}`);
        }
    });

    const onError = (errors) => {
        const firstErrorKey = Object.keys(errors)[0];
        const firstErrorMessage = errors[firstErrorKey]?.message;

        toast.error(firstErrorMessage || "Please check the required details.");
    };

    // -------------------------------------------------------------

    const handleRemoveFile = useCallback(
        (inputFile) => {

            const filtered =
                values.documents?.filter((file) => file !== inputFile);

            setValue('documents', filtered, { shouldValidate: true });

        },
        [setValue, values.documents]
    );

    const handleRemoveAllFiles = useCallback(() => {
        setValue('documents', [], { shouldValidate: true });
    }, [setValue]);

    const handleConfirmAndRun = () => {
        confirmSubmit.onFalse();
        setIsDraftAction(false);
        methods.handleSubmit(onSubmit, onError)();
    };

    // -------------------------------------------------------------

    const renderCollapseButton = (value, onToggle) => (
        <IconButton onClick={onToggle}>
            <Iconify icon={value
                ? 'eva:arrow-ios-downward-fill'
                : 'eva:arrow-ios-forward-fill'} />
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
            items={[
                "NOC Template", "Sample Application"
            ]}
            downloadUrl="/templates/Trademark-Required-Document.zip"
            fileName="Trademark_Documents.zip"
        />
    )

    // -------------------------------------------------------------

    const renderDetails = () => (
        <Card>

            <CardHeader
                title="Trademark Details"
                subheader="Basic trademark information"
                action={renderCollapseButton(
                    openDetails.value,
                    openDetails.onToggle
                )}
            />

            <Collapse in={openDetails.value}>
                <Divider />

                <Stack spacing={3} sx={{ p: 3 }}>

                    <Field.Text
                        name="trademarkName"
                        label="Trademark Name"
                        required
                    />

                    <Field.Text
                        name="description"
                        label="Description"
                        multiline
                        rows={3}
                        required
                    />

                </Stack>

            </Collapse>

        </Card>
    );

    // -------------------------------------------------------------

    const {
        fields: orgFields,
        append: addOrg,
        remove: removeOrg,
    } = useFieldArray({
        control,
        name: "organizations",
    });

    const {
        fields: inventorFields,
        append: addInventor,
        remove: removeInventor,
    } = useFieldArray({
        control,
        name: "inventors",
    });

    const renderParticipants = () => (
        <Card>
            <CardHeader
                title="Applicants / Organizations"
                subheader="People or organizations involved"
                action={renderCollapseButton(
                    openParticipants.value,
                    openParticipants.onToggle
                )}
            />

            <Collapse in={openParticipants.value}>
                <Divider />

                <Stack spacing={3} sx={{ p: 3 }}>

                    {/* ORGANIZATIONS */}
                    {/* <Typography variant="subtitle2">Organizations</Typography> */}
                    <Stack direction="row" justifyContent="space-between">

                        <Typography variant="subtitle2">
                            Organizations
                        </Typography>

                    </Stack>

                    {orgFields.map((item, index) => (
                        <Stack key={item.id} direction="row" spacing={2}>

                            <Field.Text
                                name={`organizations.${index}.name`}
                                label="Organization Name"
                                required
                            />

                            <Field.Text
                                name={`organizations.${index}.address`}
                                label="Address"
                            />

                            <IconButton color="error" onClick={() => removeOrg(index)}>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>

                        </Stack>
                    ))}

                    <Button
                        size="small"
                        color="primary"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={() => addOrg({ name: "", address: "" })}
                        sx={{ flexShrink: 0 }}
                    >
                        Add Organization
                    </Button>


                    <Divider sx={{ my: 2 }} />


                    {/* INVENTORS */}
                    <Typography variant="subtitle2">Inventors</Typography>

                    {inventorFields.map((item, index) => (
                        <Stack key={item.id} direction="row" spacing={2}>

                            <Field.Text
                                name={`inventors.${index}.fullName`}
                                label="Full Name"
                                required
                            />

                            <Field.Text
                                name={`inventors.${index}.email`}
                                label="Email"
                                required
                            />

                            <IconButton color="error" onClick={() => removeInventor(index)}>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>

                        </Stack>
                    ))}


                    <Button
                        size="small"
                        color="primary"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={() => addInventor({ name: "", email: "" })}
                        sx={{ flexShrink: 0 }}
                    >
                        Add Inventor
                    </Button>

                </Stack>
            </Collapse>
        </Card>
    );

    // -------------------------------------------------------------

    const renderDocuments = () => (
        <Card>

            <CardHeader
                title="Upload Image/Logo"
                subheader="Upload image files only (JPG, JPEG, PNG)."
                action={renderCollapseButton(
                    openDocuments.value,
                    openDocuments.onToggle
                )}
            />

            <Collapse in={openDocuments.value}>
                <Divider />

                <Stack spacing={3} sx={{ p: 3 }}>

                    <Field.Upload
                        multiple
                        name="documents"
                        maxSize={10485760}
                        onRemove={handleRemoveFile}
                        onRemoveAll={handleRemoveAllFiles}
                    />

                </Stack>

            </Collapse>

        </Card>
    );

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
                {currentTrademark ? 'Save Changes' : 'Save as Draft'}
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

    return (

        <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>

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