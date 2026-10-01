import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Stack,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  Alert,
} from '@mui/material';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { Field, Form } from 'src/components/hook-form';

import { DiscardChangesDialog } from './patent-hosting-discard-changes-dialog';

const MediaInformationSchema = z.object({
  imageFiles: z.any(),
  videoType: z.string(),
  videoFile: z.any().nullable(),
  // videoUrl: z.string(),
  videoUrl: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => {
        if (!value) return true;

        const youtubeRegex =
          /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/live\/|youtu\.be\/)[A-Za-z0-9_-]{6,}$/i;

        return youtubeRegex.test(value.trim());
      },
      {
        message: 'Please enter a valid YouTube URL.',
      }
    ),
});

export function MediaInformationDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
  defaultValues,
}) {
  const [removedMediaIds, setRemovedMediaIds] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [existingVideoLinks, setExistingVideoLinks] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [discardOpen, setDiscardOpen] = useState(false);

  const methods = useForm({
    resolver: zodResolver(MediaInformationSchema),
    defaultValues: {
      imageFiles: defaultValues?.images || [],
      videoType: 'file', // file | url
      videoFile: null,
      videoUrl: '',
    },
  });

  const {
    watch,
    reset,
    clearErrors,
    setError,
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const IMAGE_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
  const VIDEO_MAX_SIZE = 20 * 1024 * 1024; // 20 MB

  const imageFiles = watch('imageFiles') || [];
  const videoFile = watch('videoFile');
  const videoType = watch('videoType');
  // console.log('imageFiles', watch('imageFiles'));
  // console.log('videoFile', watch('videoFile'));
  const imageCount = existingImages.length + (imageFiles.length || 0);
  const canUploadImages = imageCount < 4;
  const hasExistingVideo = existingVideos.length > 0;
  const hasExistingVideoLink = existingVideoLinks.length > 0;
  const hasVideo = hasExistingVideo || hasExistingVideoLink;
  const hasPendingImages = (watch('imageFiles')?.length || 0) > 0;
  const hasPendingVideo = !!watch('videoFile');
  const hasPendingVideoUrl = !!watch('videoUrl')?.trim();
  const hasUnsavedChanges =
    removedMediaIds.length > 0 ||
    hasPendingImages ||
    hasPendingVideo ||
    hasPendingVideoUrl ||
    isDirty;

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setDiscardOpen(true);
      return;
    }

    onClose();
  };

  const handleDiscard = () => {
    reset({
      imageFiles: [],
      videoType: 'file',
      videoFile: null,
      videoUrl: '',
    });

    setExistingImages(defaultValues?.images || []);
    setExistingVideos(defaultValues?.videos || []);
    setExistingVideoLinks(defaultValues?.videoLinks || []);
    setVideoPreview(null);

    setRemovedMediaIds([]);
    setDiscardOpen(false);

    setDiscardOpen(false);
    onClose();
  };

  const handleCancelDiscard = () => {
    setDiscardOpen(false);
  };

  const handleRemoveExistingImage = (mediaId) => {
    setRemovedMediaIds((prev) => [...prev, mediaId]);

    setExistingImages((prev) => prev.filter((item) => item.mediaId !== mediaId));
  };

  const handleRemoveExistingVideoLink = (mediaId) => {
    setRemovedMediaIds((prev) => [...prev, mediaId]);

    setExistingVideoLinks((prev) => prev.filter((x) => x.mediaId !== mediaId));
  };

  const handleRemoveExistingVideo = (mediaId) => {
    setRemovedMediaIds((prev) => [...prev, mediaId]);

    setExistingVideos((prev) => prev.filter((item) => item.mediaId !== mediaId));
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    clearErrors();

    // Remaining existing media after deletion
    const remainingImages = existingImages.filter((x) => !removedMediaIds.includes(x.mediaId));
    const remainingVideos = existingVideos.filter((x) => !removedMediaIds.includes(x.mediaId));
    const remainingVideoLinks = existingVideoLinks.filter(
      (x) => !removedMediaIds.includes(x.mediaId)
    );

    const totalImages = remainingImages.length + (data.imageFiles?.length || 0);

    const hasActiveVideo = remainingVideos.length > 0 || remainingVideoLinks.length > 0;

    const hadExistingMedia =
      existingImages.length > 0 || existingVideos.length > 0 || existingVideoLinks.length > 0;

    const userModifiedMedia =
      removedMediaIds.length > 0 ||
      (data.imageFiles?.length || 0) > 0 ||
      !!data.videoFile ||
      !!data.videoUrl?.trim();

    const hasNewMedia =
      (data.imageFiles?.length || 0) > 0 || !!data.videoFile || !!data.videoUrl?.trim();

    // for first time upload
    if (!hadExistingMedia && !userModifiedMedia) {
      toast.error('Please upload at least one image or one demonstration video.');

      return;
    }

    // if image is larger than limit
    const oversizedImage = (data.imageFiles || []).find((file) => file.size > IMAGE_MAX_SIZE);

    if (oversizedImage) {
      setError('imageFiles', {
        type: 'manual',
        message: `${oversizedImage.name} exceeds 2 MB limit`,
      });

      return;
    }

    // allowing maximum 4 images
    if (totalImages > 4) {
      setError('imageFiles', {
        type: 'manual',
        message: 'Maximum 4 images allowed',
      });

      return;
    }

    // validating video size
    if (data.videoType === 'file' && data.videoFile && data.videoFile.size > VIDEO_MAX_SIZE) {
      setError('videoFile', {
        type: 'manual',
        message: `${data.videoFile.name} exceeds 20 MB limit`,
      });

      return;
    }

    const hasVideoFile = !!data.videoFile;
    const hasVideoUrl = !!data.videoUrl?.trim();

    if (hasVideoFile && hasVideoUrl) {
      setError('videoFile', {
        type: 'manual',
        message: 'Choose either a video file or a YouTube URL.',
      });

      setError('videoUrl', {
        type: 'manual',
        message: 'Choose either a video file or a YouTube URL.',
      });

      toast.warning(
        'Choose either a demonstration video file or a YouTube video link. Remove one before saving.'
      );

      return;
    }

    // forming a formdata
    const formData = new FormData();

    // deleted media
    removedMediaIds.forEach((id) => {
      formData.append('DeleteMediaIds', id);
    });

    // New images
    (data.imageFiles || []).forEach((file) => {
      formData.append('ImageFiles', file);
    });

    // Only one active video is allowed
    if (!hasActiveVideo) {
      if (data.videoType === 'file' && data.videoFile) {
        formData.append('VideoFiles', data.videoFile);
      }

      if (data.videoType === 'url' && data.videoUrl?.trim()) {
        formData.append('VideoUrls', data.videoUrl.trim());
      }
    }

    await onSubmit?.({
      formData,
      removedMediaIds,
    });

    // for discard
    reset({
      imageFiles: [],
      videoType: 'file',
      videoFile: null,
      videoUrl: '',
    });

    setRemovedMediaIds([]);
    setVideoPreview(null);

    onClose();
  });

  useEffect(() => {
    if (!open) return;

    setExistingImages(defaultValues?.images || []);
    setExistingVideos(defaultValues?.videos || []);
    setExistingVideoLinks(defaultValues?.videoLinks || []);

    setRemovedMediaIds([]);

    reset({
      imageFiles: [],
      videoFile: null,
      videoUrl: '',
      videoType: 'file',
    });

    // console.log('reset running');
  }, [open, defaultValues, reset]);

  // useEffect(() => {
  //   if (!videoFile) {
  //     setVideoPreview(null);
  //     return;
  //   }

  //   const url = URL.createObjectURL(videoFile);

  //   setVideoPreview(url);

  //   return () => URL.revokeObjectURL(url);
  // }, [videoFile]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPreview(null);

      return () => {};
    }

    const url = URL.createObjectURL(videoFile);

    setVideoPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>Media Information</DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <>
                  <Typography variant="subtitle2">Existing Images</Typography>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {existingImages.map((image) => (
                      <Card
                        key={image.mediaId}
                        sx={{
                          width: 140,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={`${CONFIG.poolHosting}${image.url}`}
                          sx={{
                            width: 1,
                            height: 120,
                            objectFit: 'cover',
                          }}
                        />

                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            bgcolor: 'background.paper',
                          }}
                          onClick={() => handleRemoveExistingImage(image.mediaId)}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Card>
                    ))}
                  </Stack>
                </>
              )}

              {/* Image Upload */}
              {canUploadImages && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Upload Images
                  </Typography>

                  <Field.Upload
                    multiple
                    name="imageFiles"
                    accept={{
                      'image/*': [],
                    }}
                    maxSize={IMAGE_MAX_SIZE}
                    helperText={`Maximum 4 images. (${imageCount}/4 used)`}
                    onRemove={(fileToRemove) => {
                      const currentFiles = methods.getValues('imageFiles') || [];

                      methods.setValue(
                        'imageFiles',
                        currentFiles.filter((f) => f !== fileToRemove),
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        }
                      );
                    }}
                  />
                </>
              )}

              {!canUploadImages && <Alert severity="info">Maximum 4 images uploaded.</Alert>}

              {hasVideo && (
                <Alert severity="info">
                  Only one video is allowed. Remove the existing video to upload another.
                </Alert>
              )}

              {/* Radio Buttons */}
              {!hasVideo && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Upload Video
                  </Typography>

                  <Alert severity="info">
                    You can choose either a demonstration video file or a YouTube video link. Only
                    one option can be saved.
                  </Alert>

                  <Field.RadioGroup
                    row
                    name="videoType"
                    // label="Choose one option"
                    options={[
                      {
                        label: 'Upload Video',
                        value: 'file',
                      },
                      {
                        label: 'Video URL',
                        value: 'url',
                      },
                    ]}
                  />

                  {/* Video Upload */}
                  {videoType === 'file' && (
                    <>
                      {!videoFile ? (
                        <Field.Upload
                          name="videoFile"
                          accept={{
                            'video/*': [],
                          }}
                          maxSize={VIDEO_MAX_SIZE}
                        />
                      ) : (
                        <Card variant="outlined" sx={{ p: 2 }}>
                          <Stack spacing={2}>
                            <video controls width="100%" src={videoPreview} />

                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography variant="body2">{videoFile.name}</Typography>

                              <Button
                                color="error"
                                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                onClick={() =>
                                  methods.setValue('videoFile', null, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  })
                                }
                              >
                                Remove
                              </Button>
                            </Stack>
                          </Stack>
                        </Card>
                      )}
                    </>
                  )}
                  {/* Video Url */}
                  {videoType === 'url' && (
                    <Stack spacing={2}>
                      <Field.Text
                        name="videoUrl"
                        label="Video URL"
                        placeholder="https://youtube.com/watch?v=..."
                      />

                      {watch('videoUrl') && (
                        <Button
                          color="error"
                          variant="outlined"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          onClick={() =>
                            methods.setValue('videoUrl', '', {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        >
                          Clear Video Link
                        </Button>
                      )}
                    </Stack>
                  )}
                </>
              )}

              {/* Existing Video */}
              {existingVideos.length > 0 && (
                <>
                  <Typography variant="subtitle2">Existing Video</Typography>

                  {existingVideos.map((video) => (
                    <Card key={video.mediaId} sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <video controls width="100%" src={`${CONFIG.poolHosting}${video.url}`} />

                        <Button
                          color="error"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          onClick={() => handleRemoveExistingVideo(video.mediaId)}
                        >
                          Remove Video
                        </Button>
                      </Stack>
                    </Card>
                  ))}
                </>
              )}

              {/* Existing Video URL */}
              {existingVideoLinks.length > 0 && (
                <>
                  <Typography variant="subtitle2">Existing Video Links</Typography>

                  {existingVideoLinks.map((link) => (
                    <Card key={link.mediaId} sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{link.url}</Typography>

                        <IconButton
                          color="error"
                          onClick={() => handleRemoveExistingVideoLink(link.mediaId)}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Stack>
                    </Card>
                  ))}
                </>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save Media
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
