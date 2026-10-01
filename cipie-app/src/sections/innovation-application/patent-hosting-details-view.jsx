import { Box, Card, Chip, Stack, Typography, Divider, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { DOMAIN_ICONS } from 'src/config/patent-domain';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { Lightbox, useLightbox } from 'src/components/lightbox';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PatentDetailsNewTabView from 'src/sections/innovation-application/patent-details-new-tab-view';
// ----------------------------------------------------------------------

export function PatentHostingDetailsView({ domain, category, patent }) {
  const { header, patentInformation, media, document } = patent;

  const { documents = [] } = document ?? {};

  const hasMedia =
    media?.images?.length > 0 || media?.videos?.length > 0 || media?.videoLinks?.length > 0;

  const hasPatentInformation = Object.values(patentInformation).every((value) => {
    if (value === null || value === undefined) return false;

    if (typeof value === 'string') {
      return value.trim() !== '';
    }

    return true;
  });

  const { title, summary, legalStatusCurrent, bannerImage } = header ?? {};

  const { mainTechnologyDomain, techSubDomain, recordNumber } = patentInformation ?? {};

  return (
    <>
      <Container
        // disableGutters
        maxWidth="xl"
        sx={[
          (theme) => ({
            maxWidth: 1,
            // px: { xs: 2, md: 8 },
            py: 4,
            borderBottom: `solid 1px ${theme.vars.palette.divider}`,
          }),
        ]}
      >
        {/* <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Iconify icon="solar:share-bold" width={22} sx={{ color: 'primary.main' }} />
          <Typography variant="h3">{title}</Typography>
        </Stack> */}

        <CustomBreadcrumbs
          links={[
            {
              name: 'Home',
              href: '/',
            },
            {
              name: 'Innovation',
              href: paths.innovationApplication.category('all', 'patents'),
            },
            {
              name: mainTechnologyDomain,
              href: paths.innovationApplication.domain(domain),
            },
            {
              name: techSubDomain,
              href: paths.innovationApplication.category(domain, category),
            },
            {
              name: recordNumber,
            },
          ]}
          sx={{ maxWidth: 1, mt: 3, mb: { xs: 3, md: 5 } }}
        />
        {/* Banner Section */}
        {bannerImage && (
          <ImageLightbox
            src={`${CONFIG.poolHosting}${bannerImage}`}
            alt="Patent Banner"
            sx={{
              width: 1,
              height: { xs: 220, md: 420 },
              // objectFit: 'contain',
              objectFit: 'contain',
              objectPosition: 'top',
              backgroundColor: '#f5f9fc',
              borderRadius: 3,
              border: '1px solid #d3eaff',
            }}
          />
        )}

        {/* Patent Header Section*/}
        {title && (
          <Card
            sx={{
              p: { xs: 2, md: 2 },
              mb: 4,
              backgroundColor: '#fafdff',
              border: '1px solid #e6f3ff',
              position: 'relative',
              overflow: 'hidden',
              //  background: 'linear-gradient(135deg,#ffffff 0%,#f8fbff 100%)',
              // '&::before': {
              //   content: '""',
              //   position: 'absolute',
              //   left: 0,
              //   top: 0,
              //   bottom: 0,
              //   width: 6,
              //   borderRadius: '6px 0 0 6px',
              //   background: 'linear-gradient(180deg,#3B82F6,#06B6D4)',
              // },

              ...(bannerImage
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
              <Box
                sx={{
                  position: 'absolute',
                  top: 15,
                  right: 15,
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  bgcolor: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: (theme) => theme.shadows[4],

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  zIndex: 2,

                  animation: 'glow 3s ease-in-out infinite',

                  '@keyframes glow': {
                    '0%': {
                      boxShadow: '0 0 0 rgba(59,130,246,0)',
                    },
                    '50%': {
                      boxShadow: '0 0 20px rgba(59,130,246,.35)',
                    },
                    '100%': {
                      boxShadow: '0 0 0 rgba(59,130,246,0)',
                    },
                  },
                }}
              >
                <Iconify
                  className="hero-tech-icon"
                  icon={DOMAIN_ICONS[mainTechnologyDomain] ?? 'solar:lightbulb-bold'}
                  width={30}
                  sx={{
                    color: 'primary.main',

                    animation: 'technologyFloat 5s ease-in-out infinite',

                    '@keyframes technologyFloat': {
                      '0%': {
                        transform: 'translateY(0px) rotate(0deg)',
                      },
                      '25%': {
                        transform: 'translateY(-4px) rotate(4deg)',
                      },
                      '50%': {
                        transform: 'translateY(0px) rotate(0deg)',
                      },
                      '75%': {
                        transform: 'translateY(-4px) rotate(-4deg)',
                      },
                      '100%': {
                        transform: 'translateY(0px) rotate(0deg)',
                      },
                    },
                  }}
                />
              </Box>
              <Chip
                variant="soft"
                label={legalStatusCurrent}
                color="success"
                icon={<Iconify icon="solar:shield-check-bold" />}
                sx={{ width: 'fit-content', fontWeight: 700, px: 1, height: 34 }}
              />

              <Typography
                variant="h3"
                fontWeight={800}
                letterSpacing={-0.5}
                sx={{
                  lineHeight: 1.25,
                  transition: 'color .25s',

                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {title}
              </Typography>

              <Typography color="text.secondary">{summary}</Typography>
            </Stack>
            <Divider sx={{ my: 2, opacity: 0.7 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label={mainTechnologyDomain}
                color="info"
                icon={<Iconify width={20} icon="solar:layers-bold" />}
                sx={{ width: 'fit-content', fontWeight: 700, px: 1 }}
              />
              <Chip
                label={techSubDomain}
                color="info"
                width={20}
                icon={<Iconify width={15} icon="solar:folder-bold" />}
                sx={{ width: 'fit-content', fontWeight: 700, px: 1 }}
              />
              {/* <Chip size="small" label={`TRL ${trl}`} /> */}
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
              md: hasMedia && hasPatentInformation ? '360px 1fr' : '1fr',
            },
            // alignItems: 'start',
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
      </Container>
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
            Patent Documents
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          {documents.map((doc) => {
            const documentUrl = `${CONFIG.poolHosting}${doc.filePath}`;

            const viewerUrl = `/document-viewer?url=${encodeURIComponent(documentUrl)}`;

            return (
              <Box
                key={doc.documentId}
                onClick={() => window.open(viewerUrl, '_blank', 'noopener,noreferrer')}
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
                  <Box
                    component="img"
                    src={`${CONFIG.assetsDir}/assets/icons/files/ic-pdf.svg`}
                    alt="PDF"
                    sx={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                    }}
                  />

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
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>

        {/* <Stack
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

                  <Typography variant="caption" color="text.secondary">
                    PDF Document
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack> */}
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
