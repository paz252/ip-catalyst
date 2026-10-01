import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Button,
  Dialog,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
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
  const [showUpload, setShowUpload] = useState(false);
  const [removeBannerImage, setRemoveBannerImage] = useState(false);

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

  const { watch, setValue, resetField, clearErrors } = methods;

  const bannerImage = watch('bannerImage');

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

    setShowUpload(false);
    setRemoveBannerImage(false);

    setDiscardOpen(false);

    onClose();
  };

  const handleCancelDiscard = () => {
    setDiscardOpen(false);
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    const payload = getDirtyValues(dirtyFields, data);

    // Upload / Replace banner
    if (data.bannerImage instanceof File) {
      payload.bannerImage = data.bannerImage;

      // Existing banner is being replaced
      if (defaultValues?.bannerImage) {
        payload.removeBannerImage = true;
      }
    }

    // Remove banner only
    if (removeBannerImage && !(data.bannerImage instanceof File) && defaultValues?.bannerImage) {
      payload.removeBannerImage = true;
    }

    // console.log(payload);

    await onSubmit?.(payload);

    reset(methods.getValues());

    setShowUpload(false);
    setRemoveBannerImage(false);

    onClose();
  });

  useEffect(() => {
    if (!open) return;

    reset({
      bannerImage: null,
      legalStatusCurrent: defaultValues?.legalStatusCurrent || '',
    });

    setShowUpload(false);
    setRemoveBannerImage(false);
  }, [open, defaultValues, reset]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>Update Patent Header</DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {defaultValues?.bannerImage && !showUpload ? (
                <Box sx={{ position: 'relative' }}>
                  <IconButton
                    onClick={() => {
                      setShowUpload(true);
                      setRemoveBannerImage(true);

                      resetField('bannerImage');
                      clearErrors('bannerImage');
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      zIndex: 2,
                    }}
                  >
                    <Iconify icon="solar:close-circle-bold" />
                  </IconButton>

                  <Box
                    component="img"
                    src={`${CONFIG.poolHosting}${defaultValues.bannerImage}`}
                    alt="Current Banner"
                    sx={{
                      width: 1,
                      height: 220,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              ) : (
                <Field.Upload
                  key={showUpload ? 'upload-open' : 'upload-closed'}
                  name="bannerImage"
                  label="Banner Image"
                  accept={{
                    'image/*': [],
                  }}
                  maxSize={5 * 1024 * 1024}
                  helperText="Upload banner image (Maximum 5 MB)"
                  onDelete={() => setValue('bannerImage', null)}
                />
              )}

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
