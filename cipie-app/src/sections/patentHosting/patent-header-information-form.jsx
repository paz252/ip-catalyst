import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Dialog,
  Stack,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { Field, Form } from 'src/components/hook-form';

import { DiscardChangesDialog } from './patent-hosting-discard-changes-dialog';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const HeaderInformationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, 'Title must be at least 10 characters')
    .max(250, 'Title cannot exceed 250 characters'),

  legalStatusCurrent: z.string().trim().min(1, 'Status is required'),

  summary: z
    .string()
    .trim()
    .min(50, 'Short description must be at least 50 characters')
    .max(1000, 'Short description cannot exceed 1000 characters'),

  bannerImage: z
    .any()
    .nullable()
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, 'Banner image must be less than 2 MB'),

  bannerObjectFit: z.enum(['none', 'contain', 'cover']).default('none'),

  bannerObjectPosition: z.enum(['center', 'top']).default('center'),
});

export function HeaderInformationDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
  defaultValues,
}) {
  const initialValues = {
    title: '',
    summary: '',
    legalStatusCurrent: '',
    bannerImage: null,
    bannerObjectFit: 'none',
    bannerObjectPosition: 'center',
  };

  const methods = useForm({
    resolver: zodResolver(HeaderInformationSchema),
    defaultValues: initialValues,
  });

  const [discardOpen, setDiscardOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [removeBannerImage, setRemoveBannerImage] = useState(false);
  const { resetField, clearErrors, setValue } = methods;
  const { watch, reset } = methods;

  const selectedBanner = watch('bannerImage');
  const bannerObjectFit = watch('bannerObjectFit');
  const bannerObjectPosition = watch('bannerObjectPosition');

  const {
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
    reset(defaultValues);

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

    if (data.bannerObjectFit !== 'cover') {
      payload.bannerObjectPosition = 'center';
    }

    // Upload / Replace banner
    if (data.bannerImage instanceof File) {
      payload.bannerImage = data.bannerImage;

      // Existing banner is being replaced
      if (defaultValues?.bannerImage) {
        payload.removeBannerImage = true;
      }
    }

    // Remove existing banner only
    if (removeBannerImage && !(data.bannerImage instanceof File) && defaultValues?.bannerImage) {
      payload.removeBannerImage = true;
    }

    await onSubmit?.(payload);

    reset(
      {
        title: data.title,
        summary: data.summary,
        legalStatusCurrent: data.legalStatusCurrent,
        bannerImage: null,
        bannerObjectFit: data?.bannerObjectFit,
        bannerObjectPosition:
          data.bannerObjectFit === 'cover' ? data.bannerObjectPosition : 'center',
      },
      {
        keepDirty: false,
      }
    );

    setShowUpload(false);
    setRemoveBannerImage(false);

    onClose();
  });

  // useEffect(() => {
  //   if (bannerObjectFit === 'none') {
  //     setValue('bannerObjectPosition', 'center', {
  //       shouldDirty: true,
  //     });
  //   }
  // }, [bannerObjectFit, setValue]);

  useEffect(() => {
    if (selectedBanner) {
      setRemoveBannerImage(true);
      setValue('bannerObjectFit', 'none', { shouldDirty: true });
      setValue('bannerObjectPosition', 'center', { shouldDirty: true });
    }
  }, [selectedBanner, setValue]);

  useEffect(() => {
    if (!open) return;

    reset({
      title: defaultValues?.title || '',
      summary: defaultValues?.summary || '',
      legalStatusCurrent: defaultValues?.legalStatusCurrent || '',
      bannerImage: null,
      bannerObjectFit: defaultValues?.bannerObjectFit || 'none',
      bannerObjectPosition: defaultValues?.bannerObjectPosition || 'center',
    });

    setShowUpload(false);
    setRemoveBannerImage(false);
  }, [open, defaultValues, reset]);

  // console.log({
  //   showUpload,
  //   selectedBanner,
  //   defaultBanner: defaultValues?.bannerImage,
  // });
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>Header Information</DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {defaultValues?.bannerImage && !showUpload && !selectedBanner ? (
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
                      height: 200,
                      // ...(bannerObjectFit !== 'none' && {
                      //   objectFit: bannerObjectFit,
                      //   objectPosition: bannerObjectPosition,
                      // }),
                      borderRadius: 2,
                    }}
                  />
                </Box>
              ) : (
                <Field.Upload
                  key={showUpload ? 'upload-open' : 'upload-closed'}
                  name="bannerImage"
                  label="Banner Image"
                  onDelete={() => setValue('bannerImage', null)}
                  sx={{
                    '& .minimal__upload__preview__single img': {
                      // objectFit: bannerObjectFit === 'none' ? 'contain' : bannerObjectFit,
                      objectFit: bannerObjectFit,
                      objectPosition: bannerObjectPosition,
                    },
                  }}
                />
              )}
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 2, md: 4 }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
              >
                <Field.RadioGroup
                  name="bannerObjectFit"
                  label="Banner Image Display"
                  options={[
                    { label: 'Original', value: 'none' },
                    { label: 'Fit', value: 'contain' },
                    { label: 'Fill', value: 'cover' },
                  ]}
                  row
                  sx={{
                    '& .MuiFormControlLabel-root': {
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.5,
                      px: 2,
                      py: 1,
                      mr: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    },

                    '& .Mui-checked + .MuiFormControlLabel-label': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  }}
                />

                {(bannerObjectFit === 'cover' || bannerObjectFit === 'none') && (
                  <Field.RadioGroup
                    name="bannerObjectPosition"
                    label="Banner Image Position"
                    options={[
                      { label: 'Center', value: 'center' },
                      { label: 'Top', value: 'top' },
                    ]}
                    row
                    sx={{
                      '& .MuiFormControlLabel-root': {
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        px: 2,
                        py: 1,
                        mr: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'action.hover',
                        },
                      },

                      '& .Mui-checked + .MuiFormControlLabel-label': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    }}
                  />
                )}
              </Stack>

              <Field.Text name="title" label="IP Title" />

              <Field.Select name="legalStatusCurrent" label="Status">
                <MenuItem value="Active - Granted">Active - Granted</MenuItem>

                <MenuItem value="Active - Applied">Active - Applied</MenuItem>
              </Field.Select>

              <Field.Text name="summary" label="Short Description" multiline rows={4} />
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
