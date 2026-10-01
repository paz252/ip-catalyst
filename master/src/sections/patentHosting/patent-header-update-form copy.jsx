import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { DiscardChangesDialog } from './patent-hosting-discard-changes-dialog';

const HeaderUpdateSchema = z.object({
  bannerImage: z.any().nullable(),
  legalStatusCurrent: z.string().min(1, 'Legal status is required'),
});

export function PatentHeaderUpdateDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
  defaultValues,
}) {
  const [discardOpen, setDiscardOpen] = useState(false);

  const methods = useForm({
    resolver: zodResolver(HeaderUpdateSchema),
    defaultValues: {
      bannerImage: null,
      legalStatusCurrent: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = methods;

  const handleClose = () => {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }

    onClose();
  };

  const handleDiscard = () => {
    reset({
      bannerImage: null,
      legalStatusCurrent: defaultValues?.legalStatusCurrent || '',
    });

    setDiscardOpen(false);

    onClose();
  };

  const handleCancelDiscard = () => {
    setDiscardOpen(false);
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    const payload = getDirtyValues(dirtyFields, data);

    await onSubmit?.(payload);

    reset(methods.getValues());

    onClose();
  });

  useEffect(() => {
    if (!open) return;

    reset({
      bannerImage: null,
      legalStatusCurrent: defaultValues?.legalStatusCurrent || '',
    });
  }, [open, defaultValues, reset]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>Update Patent Header</DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Field.Upload
                name="bannerImage"
                accept={{
                  'image/*': [],
                }}
                maxSize={5 * 1024 * 1024}
                helperText="Upload banner image (Maximum 5 MB)"
              />

              <Field.Select name="legalStatusCurrent" label="Legal Status">
                <MenuItem value="Active - Granted">Active - Granted</MenuItem>

                <MenuItem value="Active - Applied">Active - Applied</MenuItem>
              </Field.Select>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save
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

export const getDirtyValues = (dirtyFields, values) =>
  Object.keys(dirtyFields).reduce((acc, key) => {
    acc[key] = values[key];
    return acc;
  }, {});
