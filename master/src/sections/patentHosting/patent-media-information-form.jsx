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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Divider,
  Tabs,
  Tab,
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
  const [activeTab, setActiveTab] = useState(0);
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

  const imageCount = existingImages.length + (imageFiles.length || 0);
  const canUploadImages = imageCount < 5;
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
    // console.log('1. Submit Clicked');
    clearErrors();

    const newImageFiles = data.imageFiles || [];

    // console.log('2. Files:', newImageFiles);

    // Remaining existing media after deletion
    const remainingImages = existingImages.filter((x) => !removedMediaIds.includes(x.mediaId));

    // console.log('3. Remaining Images:', remainingImages);

    const remainingVideos = existingVideos.filter((x) => !removedMediaIds.includes(x.mediaId));

    const remainingVideoLinks = existingVideoLinks.filter(
      (x) => !removedMediaIds.includes(x.mediaId)
    );

    // ===========================
    // Image duplicate validation
    // ===========================

    const normalizeFileName = (name = '') =>
      name
        .replace(/\.[^.]+$/i, '')
        .toLowerCase()
        .trim();

    const duplicateNewImages = newImageFiles.filter(
      (file, index) =>
        newImageFiles.findIndex(
          (f) => f.name.toLowerCase().trim() === file.name.toLowerCase().trim()
        ) !== index
    );

    const duplicateExistingImages = newImageFiles.filter((file) =>
      remainingImages.some(
        (img) => normalizeFileName(img.fileName) === normalizeFileName(file.name)
      )
    );

    if (duplicateNewImages.length > 0 || duplicateExistingImages.length > 0) {
      setError('imageFiles', {
        type: 'manual',
        message: 'An image with the same name already exists.',
      });

      return;
    }

    // ===========================
    // Video duplicate validation
    // ===========================

    if (data.videoFile) {
      const existingVideoNames = remainingVideos.map((video) =>
        video.fileName.toLowerCase().trim()
      );

      const uploadedVideoName = data.videoFile.name
        .replace(/\.[^.]+$/i, '')
        .toLowerCase()
        .trim();

      if (existingVideoNames.includes(uploadedVideoName)) {
        setError('videoFile', {
          type: 'manual',
          message: 'A video with the same name already exists.',
        });

        return;
      }
    }

    // ===========================
    // YouTube duplicate validation
    // ===========================

    if (data.videoUrl?.trim()) {
      const normalizeYoutube = (url) => {
        try {
          const parsed = new URL(url);

          if (parsed.hostname.includes('youtu.be')) {
            return parsed.pathname.replace('/', '');
          }

          return parsed.searchParams.get('v');
        } catch {
          return url.trim();
        }
      };

      const newVideoId = normalizeYoutube(data.videoUrl);

      const existingVideoIds = remainingVideoLinks.map((video) => normalizeYoutube(video.url));

      if (existingVideoIds.includes(newVideoId)) {
        setError('videoUrl', {
          type: 'manual',
          message: 'This YouTube video has already been added.',
        });

        return;
      }
    }

    const totalImages = remainingImages.length + newImageFiles.length;

    // console.log('4. Total Images:', totalImages);

    const hasActiveVideo = remainingVideos.length > 0 || remainingVideoLinks.length > 0;

    const hadExistingMedia =
      existingImages.length > 0 || existingVideos.length > 0 || existingVideoLinks.length > 0;

    const userModifiedMedia =
      removedMediaIds.length > 0 ||
      newImageFiles.length > 0 ||
      !!data.videoFile ||
      !!data.videoUrl?.trim();

    // First time upload validation
    if (!hadExistingMedia && !userModifiedMedia) {
      toast.error('Please upload at least one image or one demonstration video.', {
        duration: 8000,
      });
      return;
    }

    // Image size validation
    const oversizedImage = newImageFiles.find((file) => file.size > IMAGE_MAX_SIZE);

    if (oversizedImage) {
      setError('imageFiles', {
        type: 'manual',
        message: `${oversizedImage.name} exceeds 2 MB limit`,
      });

      return;
    }

    // Maximum image validation
    if (totalImages > 4) {
      // console.log('5. Too many images');
      setError('imageFiles', {
        type: 'manual',
        message: 'You can upload up to 4 images.',
      });

      toast.error('You can upload up to 4 images.', {
        duration: 8000,
      });

      return;
    }

    // Video size validation
    if (data.videoType === 'file' && data.videoFile && data.videoFile.size > VIDEO_MAX_SIZE) {
      setError('videoFile', {
        type: 'manual',
        message: `${data.videoFile.name} exceeds 20 MB limit`,
      });

      return;
    }

    const hasVideoFile = !!data.videoFile;
    const hasVideoUrl = !!data.videoUrl?.trim();

    // Only one upload method
    if (hasVideoFile && hasVideoUrl) {
      setError('videoFile', {
        type: 'manual',
        message: 'Choose either a video file or a YouTube URL.',
      });

      setError('videoUrl', {
        type: 'manual',
        message: 'Choose either a video file or a YouTube URL.',
      });

      toast.warning('Choose either a demonstration video file or a YouTube video link.', {
        duration: 6000,
      });

      return;
    }

    // ===========================
    // FormData
    // ===========================

    // console.log('6. Creating FormData');

    const formData = new FormData();

    removedMediaIds.forEach((id) => {
      formData.append('DeleteMediaIds', id);
    });

    newImageFiles.forEach((file) => {
      formData.append('ImageFiles', file);
    });

    if (!hasActiveVideo) {
      if (data.videoType === 'file' && data.videoFile) {
        formData.append('VideoFiles', data.videoFile);
      }

      if (data.videoType === 'url' && data.videoUrl?.trim()) {
        formData.append('VideoUrls', data.videoUrl.trim());
      }
    }

    // console.log('7. Calling API');

    await onSubmit?.({
      formData,
      removedMediaIds,
    });

    reset({
      imageFiles: [],
      videoType: 'file',
      videoFile: null,
      videoUrl: '',
    });

    setRemovedMediaIds([]);
    setVideoPreview(null);
    // console.log(`defaultValues`, defaultValues);
    onClose();
  });

  useEffect(() => {
    if (!open) return;

    setActiveTab(0);
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

  useEffect(() => {
    const totalImages = existingImages.length + imageFiles.length;

    if (totalImages > 4) {
      // const remainingSlots = 4 - existingImages.length;
      const remainingSlots = Math.max(0, 4 - existingImages.length);

      const message =
        remainingSlots <= 0
          ? 'You have already uploaded the maximum of 4 images.'
          : `You can upload only ${remainingSlots} more image${remainingSlots > 1 ? 's' : ''}.`;

      setError('imageFiles', {
        type: 'manual',
        message,
      });

      toast.error(message, {
        duration: 8000,
      });

      // Remove newly selected files
      const validFiles = imageFiles.slice(0, remainingSlots);

      methods.setValue('imageFiles', validFiles, {
        shouldDirty: true,
        shouldValidate: true,
      });

      return;
    }
    clearErrors('imageFiles');
  }, [imageFiles, existingImages, setError, clearErrors, methods]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>Media Information</DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              sx={{
                mb: 3,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Tab iconPosition="start" label={`Images (${imageCount})`} />

              <Tab iconPosition="start" label={`Demonstration Media (${hasVideo ? 1 : 0})`} />
            </Tabs>

            {activeTab === 0 && (
              <Stack spacing={3}>
                {/* Existing Images */}
                {existingImages.length > 0 && (
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
                        Existing Images
                      </Typography>

                      <Chip
                        label={`${existingImages.length} / 4 Uploaded`}
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
                            <TableCell width={90}>Preview</TableCell>

                            <TableCell>File Name</TableCell>

                            <TableCell width={120}>Status</TableCell>

                            <TableCell width={90} align="center">
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {existingImages.map((image) => (
                            <TableRow hover key={image.mediaId}>
                              <TableCell>
                                <Avatar
                                  variant="rounded"
                                  src={`${CONFIG.poolHosting}${image.url}`}
                                  sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 1.5,
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                  {image.fileName}
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
                                  onClick={() => handleRemoveExistingImage(image.mediaId)}
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
                )}

                {/* Image Upload */}
                {canUploadImages && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 2,
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>
                          Upload Images
                        </Typography>

                        <Chip
                          label={`${4 - existingImages.length} Slots Remaining`}
                          color="info"
                          variant="outlined"
                          size="small"
                        />
                      </Stack>

                      <Alert severity="info">
                        Upload up to 4 images.
                        <br />
                        Maximum size: 2 MB per image.
                      </Alert>

                      <Field.Upload
                        multiple
                        name="imageFiles"
                        // maxFiles={4 - existingImages.length}
                        accept={{
                          'image/*': [],
                        }}
                        maxSize={IMAGE_MAX_SIZE}
                        helperText={`You can upload up to ${4 - existingImages.length} more images.`}
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

                      {imageFiles.length > 0 && (
                        <>
                          <Divider sx={{ my: 2 }} />

                          <Typography
                            variant="subtitle2"
                            sx={{
                              mb: 1,
                              fontWeight: 600,
                            }}
                          >
                            Selected Images
                          </Typography>

                          <TableContainer
                            component={Paper}
                            variant="outlined"
                            sx={{
                              borderRadius: 2,
                            }}
                          >
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell width={90}>Preview</TableCell>

                                  <TableCell>File Name</TableCell>

                                  <TableCell width={140}>Status</TableCell>

                                  <TableCell width={90} align="center">
                                    Action
                                  </TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {imageFiles.map((file) => (
                                  <TableRow hover key={file.name}>
                                    <TableCell>
                                      <Avatar
                                        variant="rounded"
                                        src={URL.createObjectURL(file)}
                                        sx={{
                                          width: 52,
                                          height: 52,
                                          borderRadius: 1.5,
                                        }}
                                      />
                                    </TableCell>

                                    <TableCell>
                                      <Typography variant="body2" fontWeight={500}>
                                        {file.name}
                                      </Typography>

                                      <Typography variant="caption" color="text.secondary">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </Typography>
                                    </TableCell>

                                    <TableCell>
                                      <Chip
                                        label="Pending Upload"
                                        color="warning"
                                        size="small"
                                        variant="outlined"
                                      />
                                    </TableCell>

                                    <TableCell align="center">
                                      <IconButton
                                        color="error"
                                        onClick={() => {
                                          const currentFiles =
                                            methods.getValues('imageFiles') || [];

                                          methods.setValue(
                                            'imageFiles',
                                            currentFiles.filter((f) => f !== file),
                                            {
                                              shouldDirty: true,
                                              shouldValidate: true,
                                            }
                                          );
                                        }}
                                      >
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </>
                      )}
                    </Stack>
                  </Paper>
                )}
              </Stack>
            )}

            {activeTab === 1 && (
              <Stack spacing={3}>
                {' '}
                {hasVideo && (
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
                          bgcolor: 'grey.50',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          Demonstration Media
                        </Typography>

                        <Chip label="Maximum One" color="primary" size="small" variant="outlined" />
                      </Box>

                      {/* Existing Video */}
                      {existingVideos.length > 0 && (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell width={120}>Type</TableCell>

                                <TableCell>Name</TableCell>

                                <TableCell width={120}>Status</TableCell>

                                <TableCell width={80} align="center">
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {existingVideos.map((video) => (
                                <TableRow hover key={video.mediaId}>
                                  <TableCell>🎥 Video</TableCell>

                                  <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                      {video.fileName}
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
                                      onClick={() => handleRemoveExistingVideo(video.mediaId)}
                                    >
                                      <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}

                      {/* Existing Video URL */}
                      {existingVideoLinks.length > 0 && (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell width={120}>Type</TableCell>

                                <TableCell>Name</TableCell>

                                <TableCell width={120}>Status</TableCell>

                                <TableCell width={80} align="center">
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {existingVideoLinks.map((link) => (
                                <TableRow hover key={link.mediaId}>
                                  <TableCell width={120}>🔗 YouTube</TableCell>

                                  <TableCell>
                                    <Typography variant="body2" noWrap>
                                      {link.url}
                                    </Typography>
                                  </TableCell>

                                  <TableCell width={120}>
                                    <Chip
                                      label="Existing"
                                      color="success"
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>

                                  <TableCell width={80} align="center">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleRemoveExistingVideoLink(link.mediaId)}
                                    >
                                      <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Paper>

                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      A demonstration media already exists. Remove it before adding another.
                    </Alert>
                  </>
                )}
                {/* Radio Buttons */}
                {!hasVideo && (
                  <>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        borderRadius: 2,
                      }}
                    >
                      <Stack spacing={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Upload Video
                        </Typography>

                        <Alert severity="info">
                          You can choose either a demonstration video file or a YouTube video link.
                          Only one option can be saved.
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
                      </Stack>
                    </Paper>
                  </>
                )}
              </Stack>
            )}
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
