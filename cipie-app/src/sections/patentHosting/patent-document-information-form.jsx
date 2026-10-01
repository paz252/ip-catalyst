import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  IconButton,
  Box,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { DiscardChangesDialog } from './patent-hosting-discard-changes-dialog';

export function DocumentInformationDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
  defaultValues,
}) {
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [removedDocumentIds, setRemovedDocumentIds] = useState([]);
  const [discardOpen, setDiscardOpen] = useState(false);

  const methods = useForm({
    defaultValues: {
      newDocuments: [],
    },
  });

  const {
    watch,
    reset,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isDirty },
  } = methods;

  const normalizeFileName = (name = '') =>
    name
      .replace(/\.pdf$/i, '')
      .toLowerCase()
      .trim();

  const newDocuments = watch('newDocuments') || [];

  // const documentCount = existingDocuments.length + newDocuments.length;
  // const canUploadDocuments = documentCount < 3;

  // const DOCUMENT_MAX_SIZE = 2 * 1024 * 1024;

  const hasUnsavedChanges = newDocuments.length > 0 || removedDocumentIds.length > 0 || isDirty;

  const handleRemoveExistingDocument = (documentId) => {
    setRemovedDocumentIds((prev) => [...prev, documentId]);

    setExistingDocuments((prev) => prev.filter((doc) => doc.documentId !== documentId));
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setDiscardOpen(true);
      return;
    }

    onClose();
  };

  const handleDiscard = () => {
    reset({
      newDocuments: [],
    });

    setRemovedDocumentIds([]);

    setExistingDocuments(defaultValues?.documents || []);

    setDiscardOpen(false);

    onClose();
  };

  const handleCancelDiscard = () => {
    setDiscardOpen(false);
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    clearErrors();

    const files = data.newDocuments || [];

    // Existing document names (excluding documents marked for deletion)

    const existingNames = existingDocuments.map((doc) => normalizeFileName(doc.fileName));

    // Duplicate within newly selected files
    const duplicateNewFiles = files.filter(
      (file, index) =>
        files.findIndex((f) => normalizeFileName(f.name) === normalizeFileName(file.name)) !== index
    );

    // Duplicate with existing documents
    const duplicateExistingFiles = files.filter((file) =>
      existingNames.includes(normalizeFileName(file.name))
    );

    if (duplicateNewFiles.length || duplicateExistingFiles.length) {
      setError('newDocuments', {
        type: 'manual',
        message: 'A document with the same name already exists.',
      });

      return;
    }

    // Total documents after add/remove
    // const totalDocuments = existingDocuments.length - removedDocumentIds.length + files.length;
    const totalDocuments = existingDocuments.length + files.length;
    if (totalDocuments < 1) {
      setError('newDocuments', {
        type: 'manual',
        message: 'At least one document is required.',
      });
      return;
    }

    if (totalDocuments > 3) {
      setError('newDocuments', {
        type: 'manual',
        message: 'You can upload a maximum of 3 documents.',
      });
      return;
    }

    // Empty files
    const emptyFiles = files.filter((file) => file.size === 0);

    if (emptyFiles.length > 0) {
      setError('newDocuments', {
        type: 'manual',
        message: 'One or more uploaded documents are empty.',
      });
      return;
    }

    // Validate PDF extension
    const invalidFiles = files.filter((file) => !file.name.toLowerCase().endsWith('.pdf'));

    if (invalidFiles.length > 0) {
      setError('newDocuments', {
        type: 'manual',
        message: 'Only PDF documents (.pdf) are allowed.',
      });
      return;
    }

    const formData = new FormData();

    removedDocumentIds.forEach((id) => {
      formData.append('RemoveDocumentIds', id);
    });

    files.forEach((file) => {
      formData.append('NewDocuments', file);
    });

    await onSubmit?.({
      formData,
      removedDocumentIds,
    });

    reset(methods.getValues());

    setRemovedDocumentIds([]);

    onClose();
  });

  useEffect(() => {
    if (!open) return;

    setExistingDocuments(defaultValues?.documents || []);
    setRemovedDocumentIds([]);

    reset({
      newDocuments: [],
    });
  }, [open, defaultValues, reset]);

  useEffect(() => {
    if (!newDocuments.length) {
      clearErrors('newDocuments');
      return;
    }

    // Maximum documents validation
    const totalDocuments = existingDocuments.length + newDocuments.length;

    if (totalDocuments > 3) {
      const remainingSlots = 3 - existingDocuments.length;

      const message =
        remainingSlots <= 0
          ? 'You have already uploaded the maximum of 3 documents.'
          : `You can upload only ${remainingSlots} more document${remainingSlots > 1 ? 's' : ''}.`;

      setError('newDocuments', {
        type: 'manual',
        message,
      });

      toast.error(message);

      methods.setValue('newDocuments', [], {
        shouldDirty: true,
        shouldValidate: true,
      });

      return;
    }

    // Duplicate inside uploaded files
    const duplicateNewFiles = newDocuments.filter(
      (file, index) =>
        newDocuments.findIndex(
          (f) => f.name.toLowerCase().trim() === file.name.toLowerCase().trim()
        ) !== index
    );

    if (duplicateNewFiles.length > 0) {
      setError('newDocuments', {
        type: 'manual',
        message: 'Duplicate documents are not allowed.',
      });

      toast.error('Duplicate documents are not allowed.');

      methods.setValue('newDocuments', [], {
        shouldDirty: true,
        shouldValidate: true,
      });

      return;
    }

    // Duplicate with existing documents
    const existingNames = existingDocuments.map((doc) => normalizeFileName(doc.fileName));

    const duplicateExisting = newDocuments.find((file) =>
      existingNames.includes(normalizeFileName(file.name))
    );

    if (duplicateExisting) {
      setError('newDocuments', {
        type: 'manual',
        message: `${duplicateExisting.name} already exists.`,
      });

      toast.error(`${duplicateExisting.name} already exists.`);

      methods.setValue('newDocuments', [], {
        shouldDirty: true,
        shouldValidate: true,
      });

      return;
    }

    clearErrors('newDocuments');
  }, [newDocuments, existingDocuments, methods, setError, clearErrors]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>Patent Documents</DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Existing Documents */}

              {existingDocuments.length > 0 && (
                <>
                  <Paper
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        px: 2.5,
                        py: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: 'grey.50',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        Existing Documents
                      </Typography>

                      <Chip
                        label={`${existingDocuments.length} / 3 Uploaded`}
                        color="primary"
                        variant="soft"
                        size="small"
                      />
                    </Box>

                    <Divider />

                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>File Name</TableCell>

                            <TableCell width={120}>Status</TableCell>

                            <TableCell width={90} align="center">
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {existingDocuments.map((doc) => (
                            <TableRow hover key={doc.documentId}>
                              <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                  {doc.fileName}
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Chip
                                  label="Existing"
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>

                              <TableCell align="center">
                                <IconButton
                                  color="error"
                                  onClick={() => handleRemoveExistingDocument(doc.documentId)}
                                >
                                  <Iconify icon="solar:trash-bin-trash-bold" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                  {/* <Paper
                        key={doc.documentId}
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">{doc.fileName}</Typography>

                        <IconButton
                          color="error"
                          onClick={() => handleRemoveExistingDocument(doc.documentId)}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Paper> */}
                </>
              )}

              {/* New Documents */}

              <Field.Upload
                multiple
                name="newDocuments"
                maxSize={2 * 1024 * 1024}
                accept={{
                  'application/pdf': ['.pdf'],
                }}
                helperText="Upload up to 3 PDF files. Maximum size 2 MB each."
                onRemove={(fileToRemove) => {
                  const currentFiles = methods.getValues('newDocuments') || [];

                  const updatedFiles = currentFiles.filter(
                    (file) => !(file.name === fileToRemove.name && file.size === fileToRemove.size)
                  );

                  methods.setValue('newDocuments', updatedFiles, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save Documents
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>

      <DiscardChangesDialog
        open={discardOpen}
        onCancel={handleCancelDiscard}
        onDiscard={handleDiscard}
      />
    </>
  );
}
