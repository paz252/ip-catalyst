import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  createIPHosting,
  updateIPHostingHeader,
  getIPHostingDetails,
  updateIPHostingPatentInformation,
  uploadPatentDocuments,
  uploadPatentMedia,
  submitPatentHostingForApproval,
} from 'src/actions/patent-hosting';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PatentDetailsNewTabView from 'src/sections/innovation-application/patent-details-new-tab-view';

import { MediaInformationDialog } from '../patent-media-information-form';
import { HeaderInformationDialog } from '../patent-header-information-form';
import { PatentInformationDialog } from '../patent-information-details-form';
import { DocumentInformationDialog } from '../patent-document-information-form';
import {
  DocumentSectionCard,
  EmptyDocumentSectionCard,
  EmptyHeaderSection,
  EmptyMediaSectionCardNew,
  MediaSectionCard,
  PatentInformationPlaceholderView,
} from '../patent-hosting-wrappers';

export function IPHostingDetailsEmptyView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const headerDialog = useBoolean();
  const documentDialog = useBoolean();
  const mediaDialog = useBoolean();
  const patentInformationDialog = useBoolean();

  const [loading, setLoading] = useState(false);
  const [headerLoading, setHeaderLoading] = useState(false);
  const [patentLoading, setPatentLoading] = useState(false);

  const [headerData, setHeaderData] = useState(null);
  const [documentData, setDocumentData] = useState({
    documents: [],
    removedDocumentIds: [],
  });
  const [mediaData, setMediaData] = useState({
    images: [],
    video: null,
  });
  const [patentInformationData, setPatentInformationData] = useState(null);

  const [bannerSrc, setBannerSrc] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [approvalStatus, setApprovalStatus] = useState(0);

  // const hasHeaderData = Boolean(headerData?.title);

  const hasHeaderData =
    !!headerData?.title?.trim() &&
    !!headerData?.summary?.trim() &&
    !!headerData?.legalStatusCurrent;

  const hasDocument = documentData?.documents?.length > 0;

  const hasMedia =
    mediaData?.images?.length > 0 ||
    mediaData?.video?.length > 0 ||
    mediaData?.videoLinks?.length > 0;

  const hasPatentInformation = !!patentInformationData?.recordNumber?.trim();

  const isSubmitted = approvalStatus === 1;
  const isApproved = approvalStatus === 2;
  const isRejected = approvalStatus === 3;

  const isLocked = approvalStatus === 1 || approvalStatus === 2;

  const completedSections = [hasHeaderData, hasPatentInformation, hasDocument].filter(
    Boolean
  ).length;

  const completion = Math.round((completedSections / 3) * 100);

  const canSubmit = hasHeaderData && hasPatentInformation && hasDocument;

  const missingItems = [];

  if (!hasHeaderData) {
    missingItems.push('Header Information');
  }

  if (!hasPatentInformation) {
    missingItems.push('Patent Information');
  }

  if (!hasDocument) {
    missingItems.push('Patent Documents');
  }

  const getHostingId = async () => {
    if (id && id !== 'new') {
      return id;
    }

    const response = await createIPHosting();

    const hostingId = response?.id;

    if (!hostingId) {
      throw new Error('Failed to create hosting record');
    }

    navigate(paths.dashboard.patentHosting.edit(hostingId), {
      replace: true,
    });

    return hostingId;
  };

  const handleHeaderSubmit = async (data) => {
    try {
      // console.log('received in handleHeaderSubmit', data);
      setHeaderLoading(true);

      const hostingId = await getHostingId();

      const response = await updateIPHostingHeader(hostingId, data);

      setHeaderData(response?.data);

      headerDialog.onFalse();

      toast.success(response?.message || 'Header information saved successfully');
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to save header information');
    }
  };

  const handleDocumentSubmit = async ({ formData, removedDocumentIds }) => {
    try {
      const hostingId = await getHostingId();

      const response = await uploadPatentDocuments(hostingId, formData);

      setDocumentData(response.data);

      toast.success(response?.message || 'Documents updated successfully');

      documentDialog.onFalse();
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to save document information');
    }
  };

  const handlePatentInformationSubmit = async (data) => {
    try {
      setPatentLoading(true);

      const hostingId = await getHostingId();

      const response = await updateIPHostingPatentInformation(hostingId, data);

      // console.log(`updateIPHostingPatentInformation`, response);

      setPatentInformationData(response.data);

      patentInformationDialog.onFalse();

      toast.success(response?.message || 'Patent information saved successfully');
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to save patent information');
    } finally {
      setPatentLoading(false);
    }
  };

  const handleMediaSubmit = async ({ formData }) => {
    try {
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      const hostingId = await getHostingId();

      const response = await uploadPatentMedia(hostingId, formData);

      setMediaData(response?.data?.media);

      mediaDialog.onFalse();

      toast.success(response?.message || 'Media updated successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save media');
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      setSubmitLoading(true);

      const hostingId = await getHostingId();

      const response = await submitPatentHostingForApproval(hostingId);

      setApprovalStatus(response?.data?.status);

      // const isSubmitted = approvalStatus === 1;

      toast.success(response?.message || 'Submitted for approval successfully');

      // await loadDetails();
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to submit for approval');
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (!id || id === 'new') return;

        const response = await getIPHostingDetails(id);

        // console.log('Hosting Details:', response);

        setHeaderData(response?.data?.header);
        setPatentInformationData(response?.data?.patentInformation);
        setMediaData(response?.data?.media);
        setDocumentData(response?.data?.document);
        // console.log(`mediaData`, mediaData);
        setApprovalStatus(response?.data?.status ?? 0);
      } catch (error) {
        console.error(error);

        toast.error('Failed to load hosting details');
      }
    };

    loadDetails();
  }, [id]);

  useEffect(() => {
    let objectUrl;

    if (!headerData?.bannerImage) {
      setBannerSrc(null);
    } else if (headerData.bannerImage instanceof File) {
      objectUrl = URL.createObjectURL(headerData.bannerImage);

      setBannerSrc(objectUrl);
    } else {
      setBannerSrc(headerData.bannerImage);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [headerData?.bannerImage]);

  return (
    <>
      <DashboardContent>
        <Stack spacing={1} sx={{ mb: 1 }}>
          <Button
            size="small"
            color="inherit"
            onClick={() => navigate(paths.dashboard.patentHosting.root)}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ justifyContent: 'flex-start', mb: { xs: 3, md: 3 } }}
          >
            Back to list
          </Button>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
            <Iconify icon="solar:share-bold" width={22} sx={{ color: 'primary.main' }} />

            <Typography variant="h4">Host New Patent</Typography>
          </Stack>

          <CustomBreadcrumbs
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },

              {
                name: 'Intellectual Property Hosting',
                href: paths.dashboard.patentHosting.root,
              },
              ...(headerData?.title
                ? [
                    {
                      name: headerData.title,
                      href: paths.dashboard.patentHosting.root,
                    },
                  ]
                : []),
            ]}
            sx={{ mb: { xs: 3, md: 3 } }}
          />

          {/* To notify user that these are missing field / sections */}

          <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
            Patent hosting requires Header Information, Patent Information, and at least one Patent
            Document before submission. Once submitted, editing will be disabled until review.
          </Alert>

          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">Patent Hosting Progress</Typography>

                  <Typography variant="body2" color="text.secondary">
                    Complete all required sections before submission
                  </Typography>
                </Box>

                <Typography variant="h4" color="primary.main">
                  {completion}%
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={completion}
                sx={{
                  height: 10,
                  borderRadius: 999,
                }}
              />
            </Stack>
          </Card>
          {/* 
          {missingItems.length > 0 && (
            <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
              Complete the following before submitting it for approval:{' '}
              <strong>{missingItems.join(', ')}</strong>
            </Alert>
          )} */}

          {/* <Alert severity="info" variant="outlined">
            <Stack spacing={1}>
              <Typography variant="subtitle2">Submission Requirements</Typography>

              <Typography color={hasHeaderData ? 'success.main' : 'error.main'}>
                {hasHeaderData ? '✓' : '✗'} Header Information
              </Typography>

              <Typography color={hasPatentInformation ? 'success.main' : 'error.main'}>
                {hasPatentInformation ? '✓' : '✗'} Patent Information
              </Typography>

              <Typography color={hasDocument ? 'success.main' : 'error.main'}>
                {hasDocument ? '✓' : '✗'} Patent Documents
              </Typography>
            </Stack>
          </Alert>

          <LinearProgress variant="determinate" value={completion} /> */}
        </Stack>

        <Stack alignItems="center" sx={{ mt: 5, alignItems: 'flex-end', mb: 2 }}>
          <LoadingButton
            size="large"
            variant="contained"
            color="primary"
            loading={submitLoading}
            disabled={!canSubmit || approvalStatus !== 0}
            onClick={handleSubmitForApproval}
            startIcon={<Iconify icon="solar:shield-check-bold" />}
          >
            {isSubmitted ? 'Submitted' : 'Submit for Approval'}
          </LoadingButton>
        </Stack>

        {/* Banner and Header */}
        {!hasHeaderData ? (
          <EmptyHeaderSection onEdit={headerDialog.onTrue} />
        ) : (
          <Card sx={{ p: 3, mb: 4, position: 'relative' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Header
            </Typography>
            <IconButton
              onClick={headerDialog.onTrue}
              disabled={isLocked}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 2,
              }}
            >
              <Iconify icon="solar:pen-bold" width={22} color="#007bff" />
            </IconButton>

            {/* <Card
              sx={{
                overflow: 'hidden',
                borderRadius: 3,
                mb: 4,
                border: '1px solid red',
              }}
            > */}
            {/* {bannerSrc && (
                <Box
                  component="img"
                  src={`${CONFIG.poolHosting}${bannerSrc}`}
                  alt="Banner"
                  sx={{
                    width: 1,
                    height: { xs: 220, md: 420 },
                    objectFit: 'cover',
                  }}
                />
              )} */}

            {bannerSrc ? (
              <Box
                component="img"
                src={`${CONFIG.poolHosting}${bannerSrc}`}
                alt="Banner"
                sx={{
                  width: 1,
                  borderRadius: 3,
                  height: { xs: 220, md: 420 },
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Card
                sx={{
                  height: { xs: 220, md: 420 },
                  overflow: 'hidden',
                  position: 'relative',
                  //   bgcolor: 'background.neutral',
                  bgcolor: '#f3f9ff',
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                {/* <IconButton
                  onClick={headerDialog.onTrue}
                  sx={{
                    top: 16,
                    right: 16,
                    position: 'absolute',
                    zIndex: 2,
                  }}
                >
                  <Iconify icon="solar:pen-bold" width={22} color="#007bff" />
                </IconButton> */}

                <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                  <Iconify
                    icon="solar:gallery-add-bold"
                    width={54}
                    sx={{ color: '#3e91eb' /* 'text.disabled'*/ }}
                  />

                  <Typography variant="h5">Banner Image</Typography>

                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Add a banner image to enhance your patent presentation (optional)
                  </Typography>
                </Stack>
              </Card>
            )}

            <Card
              sx={{
                p: 3,
                mb: 3,
                // //   mt: 4,
                // bgcolor: '#f3f9ff',
                // border: '1px dashed',
                // borderColor: 'divider',
                //overlap with banner if remove margin bottom of banner
                mt: -6,
                mx: { md: 4 },
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Stack spacing={2}>
                <Chip
                  label={headerData.legalStatusCurrent}
                  icon={<Iconify icon="solar:shield-check-bold" />}
                  color="success"
                  sx={{ width: 'fit-content' }}
                />

                <Typography variant="h3" sx={{ lineHeight: 1.25 }}>
                  {headerData.title}
                </Typography>

                <Typography color="text.secondary">{headerData.summary}</Typography>
              </Stack>
            </Card>
            {/* </Card> */}
          </Card>
        )}

        {/* Document */}
        {hasDocument ? (
          <DocumentSectionCard
            documentData={documentData}
            isLocked={isLocked}
            onEdit={documentDialog.onTrue}
          />
        ) : (
          <EmptyDocumentSectionCard onEdit={documentDialog.onTrue} />
        )}

        {/* Main Section */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              md: '360px 1fr',
            },
          }}
        >
          {/* Left Side */}
          <Stack spacing={3}>
            {!hasMedia ? (
              // <EmptyMediaSectionCard onEdit={mediaDialog.onTrue} />
              <EmptyMediaSectionCardNew onEdit={mediaDialog.onTrue} />
            ) : (
              <MediaSectionCard
                mediaData={mediaData}
                isLocked={isLocked}
                onEdit={mediaDialog.onTrue}
              />
            )}
          </Stack>

          {/* Right Side */}

          {!hasPatentInformation ? (
            <PatentInformationPlaceholderView
              onEdit={patentInformationDialog.onTrue}
              isLocked={isLocked}
            />
          ) : (
            <Card sx={{ p: 3, mb: 4, position: 'relative' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Patent Information
              </Typography>
              <IconButton
                onClick={patentInformationDialog.onTrue}
                disabled={isLocked}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 2,
                }}
              >
                <Iconify icon="solar:pen-bold" width={22} color="#007bff" />
              </IconButton>

              <PatentDetailsNewTabView patent={patentInformationData} />
            </Card>
          )}
        </Box>
      </DashboardContent>

      <HeaderInformationDialog
        open={headerDialog.value}
        onClose={headerDialog.onFalse}
        onSubmit={handleHeaderSubmit}
        defaultValues={headerData}
      />

      <DocumentInformationDialog
        open={documentDialog.value}
        onClose={documentDialog.onFalse}
        onSubmit={handleDocumentSubmit}
        defaultValues={documentData}
      />

      <MediaInformationDialog
        open={mediaDialog.value}
        onClose={mediaDialog.onFalse}
        onSubmit={handleMediaSubmit}
        defaultValues={mediaData}
      />

      <PatentInformationDialog
        open={patentInformationDialog.value}
        onClose={patentInformationDialog.onFalse}
        onSubmit={handlePatentInformationSubmit}
        defaultValues={patentInformationData}
        loading={patentLoading}
      />
    </>
  );
}
