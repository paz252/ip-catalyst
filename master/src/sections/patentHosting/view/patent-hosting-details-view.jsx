import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import { Box, Card, Chip, Stack, Button, Typography, Divider } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetPatentHostingDetails } from 'src/actions/patent-hosting';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Lightbox, useLightbox } from 'src/components/lightbox';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PatentDetailsNewTabView from 'src/sections/innovation-application/patent-details-new-tab-view';

import { IPHostingDetailsSkeleton } from '../skeleton/patent-hosting-details-skeleton';

// ----------------------------------------------------------------------

export function IPHostingDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostingData, setHostingData] = useState(null);
  const header = hostingData?.header ?? {};

  const { data, error, isLoading, mutate } = useGetPatentHostingDetails(id);
  const patentInformation = hostingData?.patentInformation ?? {};
  // console.log(patentInformation);

  const media = hostingData?.media ?? {
    images: [],
    videos: [],
    videoLinks: [],
  };

  const documents = hostingData?.document?.documents ?? [];

  const hasMedia =
    media?.images?.length > 0 || media?.videos?.length > 0 || media?.videoLinks?.length > 0;

  const hasPatentInformation = Object.values(patentInformation).every((value) => {
    if (value === null || value === undefined) return false;

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    return true;
  });

  useEffect(() => {
    if (!data) return;

    setHostingData(data.data);
  }, [data]);

  useEffect(() => {
    if (!error) return;

    console.error(error);

    toast.error(error?.response?.data?.message || 'Failed to load details');

    navigate(paths.dashboard.patentHosting.root);
  }, [error, navigate]);

  if (isLoading) {
    return (
      <DashboardContent forceFullWidth>
        <Button
          size="small"
          color="inherit"
          onClick={() => navigate(paths.dashboard.patentHosting.root)}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          sx={{
            justifyContent: 'flex-start',
            mb: 2,
          }}
        >
          Back to list
        </Button>

        <IPHostingDetailsSkeleton />
      </DashboardContent>
    );
  }
  return (
    <>
      <DashboardContent forceFullWidth>
        {/* <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Iconify icon="solar:share-bold" width={22} sx={{ color: 'primary.main' }} />
          <Typography variant="h3">{header?.title ? header.title : ''}</Typography>
        </Stack> */}

        <CustomBreadcrumbs
          // heading="Host your Intellectual Property"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Patent Hostings',
              href: paths.dashboard.patentHosting.root,
            },
            ...(patentInformation?.recordNumber
              ? [
                  {
                    name: patentInformation.recordNumber,
                    href: paths.dashboard.patentHosting.root,
                  },
                ]
              : [{ name: 'New Patent Hosting', href: paths.dashboard.patentHosting.root }]),
          ]}
          sx={{ mb: { xs: 2, md: 4 } }}
        />

        {/* <Divider sx={{ mb: 5 }} /> */}

        {/* Banner Section */}
        {header?.bannerImage && (
          // <Box
          //   component="img"
          //   src={`${CONFIG.poolHosting}${header?.bannerImage}`}
          //   alt="Patent Banner"
          //   sx={{
          //     width: 1,
          //     borderRadius: 3,
          //     height: { xs: 220, md: 420 },
          //     objectFit: 'cover',
          //     border: '1px solid #d3eaff',
          //   }}
          // />
          <ImageLightbox
            src={`${CONFIG.poolHosting}${header?.bannerImage}`}
            alt="Patent Banner"
            sx={{
              width: 1,
              height: { xs: 220, md: 420 },
              objectFit: 'cover',
              borderRadius: 3,
              border: '1px solid #d3eaff',
            }}
          />
        )}

        {/* Patent Header Section*/}
        {header?.title && (
          // <Card
          //   sx={{
          //     p: { xs: 2, md: 2 },
          //     m: 1.5,
          //     mb: 4,
          //     backgroundColor: '#fafdff',
          //     border: '1px solid #e6f3ff',
          //     // overlap with banner if remove margin bottom of banner
          //     ...(header?.bannerImage && {
          //       // Overlap with banner
          //       mt: -4,
          //       mx: { md: 4 },
          //       position: 'relative',
          //       zIndex: 2,
          //     }),
          //   }}
          // >
          <Card
            sx={{
              p: { xs: 2, md: 2 },
              mb: 4,
              backgroundColor: '#fafdff',
              border: '1px solid #e6f3ff',

              ...(header?.bannerImage
                ? {
                    m: 1.5,
                    // Overlap with banner
                    mt: -4,
                    mx: { md: 4 },
                    position: 'relative',
                    zIndex: 2,
                  }
                : {}),
            }}
          >
            <Stack spacing={2}>
              <Chip
                label={header?.legalStatusCurrent}
                color="success"
                icon={<Iconify icon="solar:shield-check-bold" />}
                sx={{ width: 'fit-content' }}
              />

              <Typography variant="h3" sx={{ lineHeight: 1.25 }}>
                {header?.title}
              </Typography>

              <Typography color="text.secondary">{header.summary}</Typography>
            </Stack>
          </Card>
        )}

        {/* Document Section*/}
        {documents?.length > 0 && <DocumentSectionCard documents={documents} />}

        {/* Main Section */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            mb: 4,
            gridTemplateColumns: {
              xs: '1fr',
              md: hasMedia ? '360px 1fr' : '1fr',
            },
          }}
        >
          {/* Left Side */}
          {hasMedia && <MediaSectionCard media={media} />}

          {/* Right Side */}
          {hasPatentInformation && (
            <Card
              // className="PatentInformationCard"
              sx={{
                p: 3,
                position: 'relative',
                backgroundColor: '#fafdff',
                border: '1px solid #e6f3ff',
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
                <Iconify
                  icon="solar:document-text-bold"
                  width={24}
                  sx={{ color: 'primary.main' }}
                />

                <Typography variant="h6" fontWeight={700}>
                  Patent Information
                </Typography>
              </Stack>
              <PatentDetailsNewTabView patent={patentInformation} />
            </Card>
          )}
        </Box>
      </DashboardContent>
    </>
  );
}

function ImageLightbox({ src, alt, sx }) {
  const slides = src ? [{ src }] : [];

  const { open, selected, onOpen, onClose } = useLightbox(slides);

  if (!src) return null;

  return (
    <>
      <Box
        component="img"
        src={src}
        alt={alt}
        onClick={() => onOpen(slides[0].src)}
        sx={{
          cursor: 'pointer',
          transition: (theme) => theme.transitions.create(['transform', 'opacity']),
          '&:hover': {
            opacity: 0.92,
            transform: 'scale(1.01)',
          },
          ...sx,
        }}
      />
      <Lightbox index={selected} slides={slides} open={open} close={onClose} />
    </>
  );
}

function DocumentSectionCard({ documents }) {
  return (
    <>
      <Card
        sx={{
          p: 3,
          mb: 4,
          position: 'relative',
          backgroundColor: '#fafdff',
          border: '1px solid #e6f3ff',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
          <Iconify icon="solar:documents-bold" width={24} sx={{ color: 'primary.main' }} />

          <Typography variant="h6" fontWeight={700}>
            Patent Documents145
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          {documents.map((doc) => (
            <Box
              key={doc.documentId}
              onClick={() => window.open(`${CONFIG.poolHosting}${doc.filePath}`, '_blank')}
              sx={{
                flex: 1,
                minWidth: 0,
                cursor: 'pointer',
                p: 2,
                borderRadius: 2,
                transition: 'all .2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent={documents?.length === 1 ? 'flex-start' : 'center'}
              >
                {/* <Iconify icon="solar:document-bold" width={40} sx={{ color: 'error.main' }} /> */}
                <Box component="img" src={`${CONFIG.assetsDir}/assets/icons/files/ic-pdf.svg`} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={(theme) => ({
                      ...theme.mixins.maxLine({ line: 2 }),
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    })}
                  >
                    {doc.fileName}
                  </Typography>

                  {/* <Typography variant="caption" color="text.secondary">
                    PDF Document
                  </Typography> */}
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>
    </>
  );
}

const getYoutubeEmbedUrl = (url) => {
  try {
    // live url
    const liveMatch = url.match(/youtube\.com\/live\/([^?&]+)/);

    if (liveMatch?.[1]) {
      return `https://www.youtube.com/embed/${liveMatch[1]}`;
    }

    // watch?v=
    const watchMatch = url.match(/[?&]v=([^&]+)/);

    if (watchMatch?.[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // youtu.be
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);

    if (shortMatch?.[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    return null;
  } catch {
    return null;
  }
};

function MediaSectionCard({ media }) {
  const slides =
    media?.images?.map((image) => ({
      src: `${CONFIG.poolHosting}${image.url}`,
    })) || [];

  const {
    open: openLightbox,
    selected: selectedImage,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightbox(slides);

  const renderGallery = () => (
    <>
      <Box
        sx={{
          gap: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {slides.map((slide) => (
          <Image
            key={slide.src}
            alt="Patent Media"
            src={slide.src}
            ratio="1/1"
            onClick={() => handleOpenLightbox(slide.src)}
            sx={(theme) => ({
              borderRadius: 2,
              cursor: 'pointer',
              transition: theme.transitions.create('opacity'),
              '&:hover': {
                opacity: 0.8,
              },
            })}
          />
        ))}
      </Box>

      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );

  return (
    <Card
      sx={{
        p: 3,
        position: 'relative',
        backgroundColor: '#fafdff',
        border: '1px solid #e6f3ff',
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
        <Iconify icon="solar:gallery-bold" width={24} sx={{ color: 'primary.main' }} />

        <Typography variant="h6" fontWeight={700}>
          Innovation Media
        </Typography>
      </Stack>
      <Stack spacing={4}>
        {/* Gallery */}
        {media?.images?.length > 0 && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 18,
                  borderRadius: 99,
                  bgcolor: 'primary.main',
                  mr: 1.25,
                }}
              />

              <Typography variant="subtitle2" fontWeight={700}>
                Gallery
              </Typography>
            </Box>

            {renderGallery()}
          </Box>
        )}

        {/* Uploaded Video */}
        {media?.videos?.length > 0 && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 18,
                  borderRadius: 99,
                  bgcolor: 'primary.main',
                  mr: 1.25,
                }}
              />

              <Typography variant="subtitle2" fontWeight={700}>
                Demonstration Video
              </Typography>
            </Box>

            <video
              controls
              width="100%"
              src={`${CONFIG.poolHosting}${media.videos[0].url}`}
              style={{
                borderRadius: '12px',
              }}
            />
          </Box>
        )}

        {/* Video URL */}
        {media?.videoLinks?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Video Demonstration
            </Typography>

            <Stack spacing={2}>
              {media.videoLinks.map((video) => (
                // <Box key={video.mediaId}>{renderVideoLink(video.url)}</Box>
                <iframe
                  width="100%"
                  height="350"
                  src={getYoutubeEmbedUrl(video.url)}
                  title="Video"
                  allowFullScreen
                  style={{
                    border: 0,
                    borderRadius: 12,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
