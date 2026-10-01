import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, Box, Card, Stack, Button, Typography, Divider } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { createLogoChallenge } from 'src/actions/challenge';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Field, Form } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg'];

export const LogoChallengeCreateSchema = zod.object({
  title: zod
    .string()
    .trim()
    .min(1, { message: 'Logo title is required!' })
    .max(150, { message: 'Logo title cannot exceed 150 characters' }),

  description: zod
    .string()
    .trim()
    .min(1, { message: 'Logo description is required!' })
    .max(1000, { message: 'Logo description cannot exceed 1000 characters' }),

  image: zod
    .instanceof(File, { message: 'Logo image is required!' })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only PNG and JPG images are allowed',
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: 'Logo image must be smaller than 2 MB',
    }),
});

// ----------------------------------------------------------------------

export function LogoChallengeCreateView() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const methods = useForm({
    resolver: zodResolver(LogoChallengeCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      image: null,
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const image = watch('image');
  const imageError = errors.image?.message;

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setValue('image', file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setPreview(URL.createObjectURL(file));
    setErrorMessage(null);
  };

  const handleRemoveImage = () => {
    setValue('image', null, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setPreview(null);
  };

  useEffect(() => {
    () => () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);

      const formData = new FormData();

      formData.append('title', data.title.trim());
      formData.append('description', data.description.trim());
      formData.append('image', data.image);

      const response = await createLogoChallenge(formData);

      if (response?.success) {
        toast.success('Logo submitted successfully.');
        // toast.success(response?.message || 'Logo submitted successfully.');

        navigate(paths.dashboard.challenge.logo.root, {
          replace: true,
        });
      }
    } catch (error) {
      console.error('Logo submission failed:', error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to submit your logo. Please try again.'
      );
    }
  });
  return (
    <DashboardContent>
      {/* Back */}
      <Box sx={{ mb: 2 }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.challenge.logo.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          color="inherit"
          sx={{
            px: 0,
            minWidth: 0,
            '&:hover': {
              bgcolor: 'transparent',
              color: 'primary.main',
            },
          }}
        >
          Back
        </Button>
      </Box>

      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Logo Challenge',
            href: paths.dashboard.challenge.logo.root,
          },
          { name: 'New Logo' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Header */}
      <Stack spacing={1} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h4">Submit Your Logo</Typography>

        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 650 }}>
          Bring your idea to life. Add your logo title, describe your concept, and upload your
          original design for the Logo Challenge.
        </Typography>
      </Stack>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            overflow: 'hidden',
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 0.9fr',
              },
            }}
          >
            <Box
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
              }}
            >
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6">Logo Information</Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Tell us about your logo and the idea behind your design.
                  </Typography>
                </Box>

                <Field.Text name="title" label="Logo Title" />

                <Field.Text
                  name="description"
                  label="Description"
                  // placeholder="Describe the idea, inspiration or meaning behind your logo..."
                  multiline
                  minRows={6}
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <Iconify
                    icon="solar:info-circle-bold"
                    width={20}
                    sx={{
                      mt: 0.2,
                      color: 'info.main',
                      flexShrink: 0,
                    }}
                  />

                  <Typography variant="caption" color="text.secondary">
                    Please upload your original logo design. Make sure the image is clear and
                    represents your concept accurately.
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderLeft: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack spacing={0.5} sx={{ mb: 3 }}>
                <Typography variant="h6">Your Logo</Typography>

                <Typography variant="body2" color="text.secondary">
                  Upload your design to see a preview.
                </Typography>
              </Stack>

              <Box
                sx={{
                  minHeight: { xs: 300, md: 380 },
                  border: '1px dashed',
                  borderColor: preview ? 'divider' : '#007bff',
                  borderRadius: 2.5,
                  bgcolor: preview ? 'background.paper' : '#f3f9ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#007bff',
                  },
                }}
              >
                {preview ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight: { xs: 300, md: 380 },
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      overflow: 'hidden',
                      borderRadius: 2.5,
                    }}
                  >
                    {/* Logo preview */}
                    <Box
                      component="img"
                      src={preview}
                      alt="Logo preview"
                      sx={{
                        mt: 4,
                        maxWidth: '88%',
                        maxHeight: 330,
                        objectFit: 'contain',
                      }}
                    />

                    {/* Remove button */}
                    <Button
                      size="small"
                      color="error"
                      variant="soft"
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={1.5}
                    sx={{
                      textAlign: 'center',
                      px: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // bgcolor: 'primary.lighter',
                        // color: 'primary.main',
                        color: '#91bded', //rgb(0, 123, 255)
                      }}
                    >
                      <Iconify icon="solar:gallery-add-bold" width={60} />
                    </Box>

                    <Typography variant="subtitle1">Upload your logo</Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
                      Choose an image from your device to preview your submission here.
                    </Typography>

                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<Iconify icon="material-symbols:upload-rounded" />}
                      sx={{ mt: 1 }}
                    >
                      Choose Image
                      <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                    </Button>

                    <Typography variant="caption" color="text.disabled">
                      PNG, JPG, JPEG • Max 2 MB
                    </Typography>
                  </Stack>
                )}
              </Box>
              {imageError && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display: 'block',
                    mt: 1,
                    textAlign: 'center',
                  }}
                >
                  {imageError}
                </Typography>
              )}

              {preview && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                  }}
                >
                  {' '}
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    color="inherit"
                    startIcon={<Iconify icon="solar:refresh-bold" width={18} />}
                    sx={{
                      alignSelf: 'center',
                      mt: 1.5,
                      borderColor: 'divider',
                      color: 'text.secondary',
                      px: 2,
                      borderRadius: 1.5,
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        bgcolor: 'primary.lighter',
                      },
                    }}
                  >
                    Change Image
                    <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              p: { xs: 2.5, sm: 3 },
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'background.paper',
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={isSubmitting || !image}
              // startIcon={<Iconify icon="solar:plain-3-bold" />}
            >
              Submit Logo
            </Button>
          </Box>
        </Card>
      </Form>
    </DashboardContent>
  );
}
