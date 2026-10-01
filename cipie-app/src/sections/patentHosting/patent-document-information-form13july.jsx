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

  // const hasUnsavedChanges = isDirty || removedDocumentIds.length > 0;
  const newDocuments = watch('newDocuments') || [];
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

  const old_handleFormSubmit = handleSubmit(async (data) => {
    clearErrors();

    const totalDocuments = existingDocuments.length + (data.newDocuments?.length || 0);

    if (totalDocuments < 1) {
      setError('newDocuments', {
        type: 'manual',
        message: 'At least 1 document is required',
      });

      return;
    }

    if (totalDocuments > 3) {
      setError('newDocuments', {
        type: 'manual',
        message: 'Maximum 3 documents allowed',
      });

      return;
    }

    const formData = new FormData();

    removedDocumentIds.forEach((id) => {
      formData.append('RemoveDocumentIds', id);
    });

    (data.newDocuments || []).forEach((file) => {
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

  const handleFormSubmit = handleSubmit(async (data) => {
    clearErrors();

    const files = data.newDocuments || [];

    // Existing document names (excluding documents marked for deletion)
    const old_existingNames = existingDocuments
      .filter((doc) => !removedDocumentIds.includes(doc.documentId))
      .map((doc) => `${doc.fileName}.pdf`.toLowerCase().trim());

    const existingNames = existingDocuments
      .filter((doc) => !removedDocumentIds.includes(doc.documentId))
      .map((doc) => doc.fileName.toLowerCase().trim());

    // Duplicate files within uploaded files
    const duplicateNewFiles = files.filter(
      (file, index) =>
        files.findIndex((f) => f.name.toLowerCase().trim() === file.name.toLowerCase().trim()) !==
        index
    );

    // Duplicate against existing documents
    const old_duplicateExistingFiles = files.filter((file) =>
      existingNames.includes(file.name.toLowerCase().trim())
    );

    const duplicateExistingFiles = files.filter((file) => {
      const uploadedName = file.name
        .replace(/\.pdf$/i, '')
        .toLowerCase()
        .trim();

      return existingNames.includes(uploadedName);
    });

    if (duplicateNewFiles.length > 0 || duplicateExistingFiles.length > 0) {
      setError('newDocuments', {
        type: 'manual',
        message: 'A document with the same name already exists.',
      });
      return;
    }

    // Total documents after add/remove
    const totalDocuments = existingDocuments.length - removedDocumentIds.length + files.length;

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

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>Patent Documents</DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Existing Documents */}

              {existingDocuments.length > 0 && (
                <Stack spacing={1}>
                  {existingDocuments.map((doc) => (
                    <Paper
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
                    </Paper>
                  ))}
                </Stack>
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
