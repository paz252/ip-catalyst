import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _orders } from 'src/_mock/_order';
import { CONFIG } from 'src/global-config';
import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { reviewIpHosting, useGetActivity } from 'src/admin/actions/ip-hosting';

import { Image } from 'src/components/image';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Lightbox, useLightbox } from 'src/components/lightbox';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PatentDetailsNewTabView from '../custom-tab-panel';
import ActivityDetailsHistory from '../activity-details-history';
import ApplicationDetailsSkeleton from '../application-details-skeletone';

// import { QueryForm } from '../query-form';
// import { WorkflowCard } from '../workflow-card';
// import { DocumentsCard } from '../documents-card';
// import { ServiceDetailsCard } from '../serviceDetailsCards/index';
// import { WorkflowDetailsHistory } from '../workflow-details-history';
// import { OrderDetailsToolbar } from '../serviceDetailsCards/order-details-toolbar';
// import { OrderDetailsCustomer } from '../serviceDetailsCards/order-details-customer';

export const APPLICATION_STATUS_OPTIONS = [
  { value: 'submitted', label: 'Pending' },
  { value: 'approved', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'answered', label: 'Answered' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const activities = [
  {
    patentTitle: 'Record Created',
    activityType: 'Creation',
    createdAt: '2026-07-02T12:39:51.16672Z',
  },
  {
    patentTitle: 'Record Created',
    activityType: 'Creation',
    createdAt: '2026-07-02T12:39:51.16672Z',
  },
  {
    patentTitle: 'Record Created',
    activityType: 'Creation',
    createdAt: '2026-07-02T12:39:51.16672Z',
  },
  {
    patentTitle: 'Record Created',
    activityType: 'Creation',
    createdAt: '2026-07-02T12:39:51.16672Z',
  },
];

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
                spacing={2}
                alignItems="center"
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
export function IpHostingDetailsView({ hostingData, loading, error, ipHostingId }) {
  const [currentTab, setCurrentTab] = useState('application');
  const [openForm, setOpenForm] = useState(false);
  const [queryReplyText, setQueryReplyText] = useState('');

  const { activity, activityLoading, activityError } = useGetActivity(ipHostingId);

  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const router = useRouter();

  const theme = useTheme();

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

  ///localhost:5125/api/pool/patent-hosting/activity-log

  // if (loading) return <>Loading...</>;
  if (loading) {
    return (
      <DashboardContent maxWidth="xl">
        <ApplicationDetailsSkeleton />
      </DashboardContent>
    );
  }

  if (error) return <>Failed to load application.</>;

  const isFinalStatus = hostingData.status === 2 || hostingData.status === 3;

  const handlePublish = async () => {
    try {
      const reviewResponse = await reviewIpHosting(ipHostingId, {
        status: 2,
        reason: 'Ip Hosting Request Published',
      });

      if (reviewResponse.success) {
        toast.success('Application approved');
      } else {
        toast.error(reviewResponse.message);
      }
      router.push(paths.admin.ipHosting.list);
    } catch (er) {
      toast.error(er.message);
    }
  };

  const handleReject = async (reason) => {
    try {
      await reviewIpHosting(ipHostingId, {
        status: 3,
        reason: reason,
      });

      toast.success('Application rejected');
      router.push(paths.admin.ipHosting.list);
    } catch (er) {
      toast.error(er.message);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      return;
    }

    try {
      await handleReject(rejectReason); // Pass the reason to your API

      setOpenRejectDialog(false);
      setRejectReason('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setRejectReason('');
  };

  const renderSubmitDialog = () => (
    <ConfirmDialog
      open={openRejectDialog}
      onClose={handleCloseRejectDialog}
      title="Reject Request"
      content={
        <TextField
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label="Rejection Reason"
          placeholder="Enter rejection reason..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirmReject}
          disabled={!rejectReason.trim()}
        >
          Reject
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Application Details"
          links={[
            { name: 'Dashboard', href: paths.admin.dashboard },
            { name: 'IP-Hosting', href: paths.admin.ipHosting.list },
            { name: 'Details' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="solar:check-circle-bold" />}
                  onClick={handlePublish}
                  disabled={isFinalStatus}
                >
                  Approve
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Iconify icon="solar:close-circle-bold" />}
                  // onClick={handleReject}
                  onClick={() => setOpenRejectDialog(true)}
                  disabled={isFinalStatus}
                >
                  Reject
                </Button>
              </>
            </Stack>
          }
          sx={{ mb: 3 }}
        />

        {/* <Card sx={{ p: 3 }}>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
              fontSize: 14,
            }}
          >
            {JSON.stringify(hostingData, null, 2)}
          </pre>
        </Card> */}

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

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            mb: 4,
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 400px', // Left content | Right history
            },
            alignItems: 'start',
          }}
        >
          {/* Left Column */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {documents?.length > 0 && <DocumentSectionCard documents={documents} />}

            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: hasMedia && hasPatentInformation ? '1fr 2fr' : '1fr',
                },
              }}
            >
              {hasMedia && <MediaSectionCard media={media} />}
              {hasPatentInformation && (
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Patent Information
                  </Typography>

                  <PatentDetailsNewTabView patent={patentInformation} activity={activity} />
                </Card>
              )}
            </Box>
          </Box>

          {/* Right Column */}
          <ActivityDetailsHistory activities={activity.activities || []} />
        </Box>

        {/* Document Section*/}

        {/* {documents?.length > 0 && <DocumentSectionCard documents={documents} />}

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
        > */}

        {/* Left Side */}

        {/* {hasMedia && <MediaSectionCard media={media} />}
          {hasPatentInformation && (
            <Card sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Patent Information
              </Typography>
              <PatentDetailsNewTabView patent={patentInformation} activity={activity} />
            </Card>
          )}
        </Box> */}
      </DashboardContent>

      {renderSubmitDialog()}
    </>
  );
}
