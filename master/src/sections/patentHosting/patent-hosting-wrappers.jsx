import { useState } from 'react';

import { Box, Tabs, Tab, Card, Chip, Divider, IconButton, Stack, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { Lightbox, useLightbox } from 'src/components/lightbox';

export function EmptySectionCard({ title, description, icon, onEdit, minHeight = 260 }) {
  return (
    <Card
      sx={{ height: 1, mb: 4, bgcolor: '#f3f9ff', border: '1px dashed', borderColor: 'divider' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 3, pt: 3 }}
      >
        <Typography variant="h6">{title}</Typography>

        <IconButton onClick={onEdit}>
          <Iconify icon="solar:pen-bold" width={22} color="#007bff" />
        </IconButton>
      </Stack>

      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{
          px: 3,
          py: 6,
          minHeight,
        }}
      >
        <Iconify icon={icon} width={56} sx={{ color: '#3e91eb' }} />

        <Typography variant="subtitle1">{title}</Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 320 }}
        >
          {description}
        </Typography>
      </Stack>
    </Card>
  );
}

export function EmptyHeaderSection({ onEdit }) {
  return (
    <>
      {/* Banner */}
      <Card
        sx={{
          height: { xs: 220, md: 420 },
          overflow: 'hidden',
          position: 'relative',
          //   bgcolor: 'background.neutral',
          p: 3,
          border: '1px solid rgb(228 242 255)',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
          <Iconify icon="solar:window-frame-bold" width={24} sx={{ color: '#007bff' }} />

          <Typography variant="h6" fontWeight={700}>
            Header Information
          </Typography>
        </Stack>
        <IconButton
          onClick={onEdit}
          sx={{
            top: 16,
            right: 16,
            position: 'absolute',
            zIndex: 2,
          }}
        >
          <Iconify icon="solar:pen-bold" width={22} color="#007bff" />
        </IconButton>

        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{
            height: 1,
            borderRadius: 2,
            bgcolor: '#f3f9ff',
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Iconify
            icon="solar:gallery-add-bold"
            width={54}
            sx={{ color: '#91bded' /* 'text.disabled'*/ }}
          />

          <Typography variant="h6" color="text.secondary">
            Banner Image
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Add a banner image to enhance your patent presentation (optional)
          </Typography>
        </Stack>
      </Card>

      {/* Header Card */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          border: '1px solid rgb(220 238 255)',
          //   mt: 4,
          // bgcolor: '#f3f9ff',
          // border: '1px dashed',
          // borderColor: 'divider',
          //overlap with banner if remove margin bottom of banner
          // m: 1.5,
          mt: -9,
          mx: { md: 2.5 },
          position: 'relative',
          // zIndex: 2,
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: '#f3f9ff',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Chip
            label="Active - Granted"
            icon={<Iconify icon="solar:shield-check-bold" />}
            color="success"
            sx={{ width: 'fit-content', mb: 2 }}
          />

          <Typography variant="h5" sx={{ mb: 1, color: 'text.secondary' }}>
            Patent / Intellectual Property Title
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Summary section provides a public-facing overview of your intellectual property,
            including the title, legal status, and a concise description of the innovation.
          </Typography>
        </Box>
      </Card>
    </>
  );
}

// new
export function EmptyDocumentSectionCard({ onEdit }) {
  return (
    <>
      <Card
        sx={{
          p: 3,
          mb: 3,
          position: 'relative',
          border: '1px solid rgb(220 238 255)',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
          <Iconify icon="solar:documents-bold" width={24} sx={{ color: '#007bff' }} />

          <Typography variant="h6" fontWeight={700}>
            Patent Document
          </Typography>
        </Stack>

        <IconButton
          onClick={onEdit}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <Iconify icon="solar:pen-bold" width={22} color="#007bff" />
        </IconButton>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          sx={{
            bgcolor: '#f3f9ff',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1.5,
          }}
        >
          {['Document 1', 'Document 2', 'Document 3'].map((name) => (
            <Box
              key={name}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2,
              }}
            >
              <Stack direction="row" justifyContent="center" alignItems="flex-start" spacing={1}>
                <Iconify icon="bi:file-earmark-pdf-fill" width={62} sx={{ color: '#91bded' }} />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {name}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    PDF Document
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            mt: 3,
            py: 2,
            borderTop: (theme) => `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload patent specifications, certificates, reports or supporting documents
          </Typography>

          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:upload-bold" />}
            onClick={onEdit}
          >
            Add Documents
          </Button>
        </Stack> */}
      </Card>
    </>
    // <EmptySectionCard
    //   title="Patent Documents"
    //   icon="solar:document-bold"
    //   description="Upload patent specifications, certificates, reports, or supporting documents."
    //   onEdit={onEdit}
    // />
  );
}

// new
export function DocumentSectionCard({ documentData, isLocked, onEdit }) {
  const documents = documentData?.documents || [];

  return (
    <>
      <Card sx={{ p: 3, mb: 4, position: 'relative', border: '1px solid rgb(228 242 255)' }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
          <Iconify icon="solar:documents-bold" width={24} sx={{ color: 'primary.main' }} />

          <Typography variant="h6" fontWeight={700}>
            Patent Document
          </Typography>
        </Stack>

        <IconButton
          onClick={onEdit}
          disabled={isLocked}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: isLocked ? 'action.disabled' : '#007bff',
          }}
        >
          <Iconify icon="solar:pen-bold" width={22} />
        </IconButton>

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
                {/* <Iconify icon="solar:document-bold" width={40} sx={{ color: '#df5839' }} /> */}

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
                    {doc?.fileName}
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

export function PatentInformationPreviewCard({ data, onEdit }) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Iconify icon="solar:document-text-bold" sx={{ color: 'primary.main' }} />

          <Typography variant="h6">Patent Information</Typography>
        </Stack>

        <IconButton onClick={onEdit}>
          <Iconify icon="solar:pen-bold" />
        </IconButton>
      </Stack>

      <Stack spacing={2}>
        <Typography>
          <strong>Patent Number:</strong> {data.recordNumber}
        </Typography>

        <Typography>
          <strong>Assignee:</strong> {data.assignee}
        </Typography>

        <Typography>
          <strong>Inventors:</strong> {data.inventors}
        </Typography>

        <Typography>
          <strong>Technology Domain:</strong> {data.mainTechnologyDomain}
        </Typography>

        <Typography>
          <strong>Legal Status:</strong> {data.legalStatus}
        </Typography>
      </Stack>
    </Card>
  );
}

export function PatentInformationPlaceholderView({ onEdit, isLocked }) {
  const [tabValue, setTabValue] = useState(0);

  const TABS = [
    {
      label: 'Information',
      icon: 'solar:document-text-bold',
    },
    {
      label: 'Assignee & Inventors',
      icon: 'solar:users-group-rounded-bold',
    },
    {
      label: 'Abstract',
      icon: 'solar:notes-bold',
    },
    {
      label: 'Claims',
      icon: 'solar:clipboard-text-bold',
    },
  ];
  const renderInformation = () => (
    <Stack
      spacing={2}
      sx={{
        flex: 1,
        width: 1,
        p: 2,
        borderRadius: 2,
        bgcolor: '#f3f9ff',
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle2" fontWeight={700}>
        The following is sample data for illustration purposes:
      </Typography>
      {[
        ['solar:file-text-bold', 'Patent / Application Number', 'US20260012345A1'],
        ['solar:shield-check-bold', 'Legal Status', 'Active - Granted'],
        ['solar:calendar-bold', 'Filing Date', '10 Jun 2026'],
        ['solar:cpu-bold', 'Main Domain', 'Information & Communication Technology'],
        ['solar:widget-bold', 'Sub Domain', 'Computer Technology'],
      ].map(([icon, label, value]) => (
        <Box
          key={label}
          sx={{
            gap: 4,
            display: 'grid',
            // gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            gridTemplateColumns: '1fr',
            p: 0.5,
          }}
        >
          <Box sx={{ gap: 1.5, display: 'flex' }}>
            <Iconify icon={icon} sx={{ width: 15, color: '#91bded' }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, fontSize: '0.875rem' }}
              >
                {label}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}
              >
                {value}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Stack>
  );

  const renderAssigneeInventors = () => (
    <Stack
      spacing={2}
      sx={{
        flex: 1,
        width: 1,
        p: 2,
        borderRadius: 2,
        bgcolor: '#f3f9ff',
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle2" fontWeight={700}>
        The following is sample data for illustration purposes:
      </Typography>
      {[
        ['mdi:office-building', 'Assignee', 'ABC Technologies Pvt. Ltd.'],
        ['mdi:account-group', 'Inventors', 'Amit Kumar, Sneha Joshi'],
      ].map(([icon, label, value]) => (
        <Box
          key={label}
          sx={{
            gap: 4,
            display: 'grid',
            // gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            gridTemplateColumns: '1fr',
            p: 0.5,
          }}
        >
          <Box sx={{ gap: 1.5, display: 'flex' }}>
            <Iconify icon={icon} sx={{ width: 15, color: '#91bded' }} />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, fontSize: '0.875rem' }}
              >
                {label}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}
              >
                {value}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Stack>
  );

  const renderAbstract = () => (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: '#f3f9ff',
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        The patent abstract will appear here. It typically contains a concise summary describing the
        innovation, technical problem addressed, and key differentiating features of the
        intellectual property.
      </Typography>
    </Box>
  );

  const renderClaims = () => (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: '#f3f9ff',
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Patent claims define the scope of protection being sought. Claims entered during patent
        information setup will be displayed here.
      </Typography>
    </Box>
  );

  return (
    <Card
      sx={{
        p: 3,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgb(220 238 255)',
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
        <Iconify icon="solar:document-text-bold" width={24} sx={{ color: '#007bff' }} />

        <Typography variant="h6" fontWeight={700}>
          Patent Information
        </Typography>
      </Stack>
      <IconButton
        onClick={onEdit}
        // disabled={isLocked}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
        }}
      >
        <Iconify icon="solar:pen-bold" width={22} color="#007bff" />
      </IconButton>
      <Tabs
        value={tabValue}
        onChange={(e, value) => setTabValue(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            backgroundColor: '#007bff',
            // backgroundColor: '#df5839', // your brand color
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.label}
            label={tab.label}
            // icon={<Iconify icon={tab.icon} width={16} />}
            iconPosition="start"
            sx={{
              textTransform: 'none',
              fontSize: '0.935rem',
              fontWeight: 600,
            }}
          />
        ))}
      </Tabs>
      <Box sx={{ flex: 1, display: 'flex' }}>
        {tabValue === 0 && renderInformation()}
        {tabValue === 1 && renderAssigneeInventors()}
        {tabValue === 2 && renderAbstract()}
        {tabValue === 3 && renderClaims()}
      </Box>
    </Card>
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

export function EmptyMediaSectionCardNew({ isLocked, onEdit }) {
  const renderEmptyGallery = () => (
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
      {[1, 2, 3, 4].map((item) => (
        <Box
          key={item}
          sx={{
            aspectRatio: '1 / 1',
            borderRadius: 2,
            bgcolor: '#f3f9ff',
            border: '1px dashed',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Iconify icon="solar:gallery-wide-bold" width={40} sx={{ color: '#91bded', mb: 1 }} />

          <Typography variant="caption" color="text.secondary">
            Image {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const renderEmptyVideo = () => (
    <Box
      sx={{
        height: 260,
        borderRadius: 2,
        bgcolor: '#f3f9ff',
        border: '1px dashed',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Iconify
        icon="solar:play-circle-bold"
        width={64}
        sx={{
          color: '#91bded',
          mb: 1,
        }}
      />

      <Typography variant="subtitle2" color="text.secondary">
        Video
      </Typography>

      <Typography variant="caption" color="text.disabled">
        Upload a video or add a video URL
      </Typography>
    </Box>
  );

  return (
    <Card sx={{ p: 3, position: 'relative', border: '1px solid rgb(220 238 255)' }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
        <Iconify icon="solar:gallery-bold" width={24} sx={{ color: '#007bff' }} />

        <Typography variant="h6" fontWeight={700}>
          Innovation Media
        </Typography>
      </Stack>

      <IconButton
        onClick={onEdit}
        disabled={isLocked}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
      >
        <Iconify icon="solar:pen-bold" width={22} color="#007bff" />
      </IconButton>

      <Stack spacing={4}>
        {/* Image Gallery */}
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
                bgcolor: '#007bff',
                mr: 1.25,
              }}
            />

            <Typography variant="subtitle2" fontWeight={700}>
              Gallery
            </Typography>
          </Box>

          {renderEmptyGallery()}
        </Box>

        {/* Uploaded Video */}
        <Box>
          {' '}
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
                bgcolor: '#007bff',
                mr: 1.25,
              }}
            />

            <Typography variant="subtitle2" fontWeight={700}>
              Demonstration Video
            </Typography>
          </Box>
          {renderEmptyVideo()}
        </Box>
      </Stack>
    </Card>
  );
}

export function MediaSectionCard({ mediaData, isLocked, onEdit }) {
  // console.log('mediaData', mediaData);
  const slides =
    mediaData?.images?.map((image) => ({
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
    <Card sx={{ p: 3, position: 'relative', border: '1px solid rgb(228 242 255)' }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
        <Iconify icon="solar:gallery-bold" width={24} sx={{ color: 'primary.main' }} />

        <Typography variant="h6" fontWeight={700}>
          Innovation Media
        </Typography>
      </Stack>

      <IconButton
        onClick={onEdit}
        disabled={isLocked}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: isLocked ? 'action.disabled' : '#007bff',
        }}
      >
        <Iconify icon="solar:pen-bold" width={22} />
      </IconButton>

      <Stack spacing={4}>
        {/* Gallery */}
        {mediaData?.images?.length > 0 && (
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
        {mediaData?.videos?.length > 0 && (
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
              src={`${CONFIG.poolHosting}${mediaData.videos[0].url}`}
              style={{
                borderRadius: '12px',
              }}
            />
          </Box>
        )}

        {/* Video URL */}
        {mediaData?.videoLinks?.length > 0 && (
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

            <Stack spacing={2}>
              {mediaData.videoLinks.map((video) => (
                // <Box key={video.mediaId}>{renderVideoLink(video.url)}</Box>
                <iframe
                  key={video.mediaId}
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
        {/* {mediaData?.videoLinks?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Video Link
            </Typography>

            <Button
              component="a"
              href={mediaData.videoLinks[0].url}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<Iconify icon="solar:play-bold" />}
            >
              Watch Video
            </Button>
          </Box>
        )} */}
      </Stack>
    </Card>
  );
}
