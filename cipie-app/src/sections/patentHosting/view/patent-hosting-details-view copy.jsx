import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import { Box, Card, Chip, Stack, Button, Typography, Divider } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { getIPHostingDetails } from 'src/actions/patent-hosting';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Lightbox, useLightbox } from 'src/components/lightbox';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PatentDetailsNewTabView from 'src/sections/innovation-application/patent-details-new-tab-view';

// ----------------------------------------------------------------------

export function IPHostingDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [hostingData, setHostingData] = useState(null);
  const header = hostingData?.header ?? {};

  const patentInformation = hostingData?.patentInformation ?? {};

  const media = hostingData?.media ?? {
    images: [],
    videos: [],
    videoLinks: [],
  };

  const documents = hostingData?.document?.documents ?? [];

  const hasMedia =
    media?.images?.length > 0 || media?.videos?.length > 0 || media?.videoLinks?.length > 0;

  const hasPatentInformation = Object.values(patentInformation).some((value) => {
    if (value === null || value === undefined) return false;

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    return true;
  });

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        if (!id || id === 'new') return;

        const response = await getIPHostingDetails(id);

        // console.log('Hosting Details:', response);

        setHostingData(response?.data);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Failed to load details');
        navigate(paths.dashboard.patentHosting.root);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <>
      <DashboardContent maxWidth="xl">
        {/* Back button */}
        <Button
          size="small"
          color="inherit"
          onClick={() => navigate(paths.dashboard.patentHosting.root)}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          sx={{
            justifyContent: 'flex-start',
            mb: { xs: 2, md: 2 },
          }}
        >
          Back
        </Button>
        <CustomBreadcrumbs
          // heading="Host your Intellectual Property"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Intellectual Property Hosting',
              href: paths.dashboard.patentHosting.root,
            },
            ...(header?.title
              ? [
                  {
                    name: header.title,
                    href: paths.dashboard.patentHosting.root,
                  },
                ]
              : []),
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* Banner Section */}
        {header?.bannerImage && (
          <Box
            component="img"
            src={`${CONFIG.poolHosting}${header?.bannerImage}`}
            alt="Patent Banner"
            sx={{
              width: 1,
              borderRadius: 3,
              height: { xs: 220, md: 420 },
              objectFit: 'cover',
            }}
          />
        )}

        {/* Patent Header Section*/}
        {header?.title && (
          <Card
            sx={{
              p: 4,
              mb: 4,

              // overlap with banner if remove margin bottom of banner
              ...(header?.bannerImage && {
                // Overlap with banner
                mt: -6,
                mx: { md: 4 },
                position: 'relative',
                zIndex: 2,
              }),
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
            <Card sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Patent Information
              </Typography>
              <PatentDetailsNewTabView patent={patentInformation} />
            </Card>
          )}
        </Box>
      </DashboardContent>
    </>
  );
}

function DocumentSectionCard({ documents }) {
  return (
    <>
      <Card sx={{ p: 3, mb: 4, position: 'relative' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Patent Documents
        </Typography>

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
                alignItems="center"
                spacing={2}
                justifyContent={documents?.length === 1 ? 'flex-start' : 'center'}
              >
                <Iconify icon="solar:document-bold" width={40} sx={{ color: 'error.main' }} />

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

export function MediaSectionCard({ media }) {
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
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          },
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
    <Card sx={{ p: 3, position: 'relative' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Innovation Media
      </Typography>

      <Stack spacing={4}>
        {/* Gallery */}
        {media?.images?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Gallery
            </Typography>

            {renderGallery()}
          </Box>
        )}

        {/* Uploaded Video */}
        {media?.videos?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Demonstration Video
            </Typography>

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
                  height="400"
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
