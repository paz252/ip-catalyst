import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  Dialog,
  Stack,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { DiscardChangesDialog } from 'src/sections/patentHosting/patent-hosting-discard-changes-dialog';

const DeleteLogoSchema = z.object({
  remark: z
    .string()
    .trim()
    .min(10, 'Remark must be at least 10 characters.')
    .max(500, 'Remark cannot exceed 500 characters.'),
});

export function DeleteLogoDialog({ open, onClose, onSubmit, loading = false }) {
  const [discardOpen, setDiscardOpen] = useState(false);

  const methods = useForm({
    resolver: zodResolver(DeleteLogoSchema),
    defaultValues: {
      remark: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const handleClose = () => {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }

    onClose();
  };

  const handleDiscard = () => {
    reset();

    setDiscardOpen(false);

    onClose();
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data.remark);

    reset();

    onClose();
  });

  useEffect(() => {
    if (!open) return;

    reset({
      remark: '',
    });
  }, [open, reset]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>Delete Logo</DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Alert severity="warning">Please provide a reason for deleting this logo.</Alert>

              <Field.Text
                name="remark"
                label="Remark"
                multiline
                rows={4}
                helperText="This remark will be recorded for audit purposes."
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            <LoadingButton color="error" variant="contained" loading={loading} type="submit">
              Delete
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>

      <DiscardChangesDialog
        open={discardOpen}
        onCancel={() => setDiscardOpen(false)}
        onDiscard={handleDiscard}
      />
    </>
  );
}
