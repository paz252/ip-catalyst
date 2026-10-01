import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  createIPHosting,
  updateIPHostingHeader,
  updateIPHostingPatentInformation,
  uploadPatentDocuments,
  uploadPatentMedia,
  submitPatentHostingForApproval,
  useGetPatentHostingDetails,
} from 'src/actions/patent-hosting';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PatentDetailsNewTabView from 'src/sections/innovation-application/patent-details-new-tab-view';

import { AdminRemarkPopover } from '../patent-remark-popover';
import { PatentPublishedDialog } from '../patent-published-dialog';
import { PatentHeaderUpdateDialog } from '../patent-header-update-form';
import { MediaInformationDialog } from '../patent-media-information-form';
import { SubmissionRequirementPopover } from '../patent-submission-popover';
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
  const headerUpdateDialog = useBoolean();
  const documentDialog = useBoolean();
  const mediaDialog = useBoolean();
  const patentInformationDialog = useBoolean();

  const [openPublishedDialog, setOpenPublishedDialog] = useState(false);
  const [headerLoading, setHeaderLoading] = useState(false);
  const [patentLoading, setPatentLoading] = useState(false);

  const [headerData, setHeaderData] = useState(null);
  const [documentData, setDocumentData] = useState({
    documents: [],
    removedDocumentIds: [],
  });
  const [mediaData, setMediaData] = useState({
    images: [],
    videos: [],
    videoLinks: [],
  });
  const [patentInformationData, setPatentInformationData] = useState(null);

  const [bannerSrc, setBannerSrc] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [updatedAt, setUpdatedAt] = useState('');
  const [approvalStatus, setApprovalStatus] = useState(0);
  const [approvalStatusName, setApprovalStatusName] = useState('Draft');
  const [approvalRemark, setApprovalRemark] = useState('');

  const [hasChangesSinceLastAction, setHasChangesSinceLastAction] = useState(false);

  const { data: hostingResponse, mutate } = useGetPatentHostingDetails(id);

  const hasHeaderData =
    !!headerData?.title?.trim() &&
    !!headerData?.summary?.trim() &&
    !!headerData?.legalStatusCurrent;

  const hasDocument = documentData?.documents?.length > 0;

  const hasMedia =
    mediaData?.images?.length > 0 ||
    mediaData?.videos?.length > 0 ||
    mediaData?.videoLinks?.length > 0;

  const hasPatentInformation = !!patentInformationData?.recordNumber?.trim();

  const isSubmitted = approvalStatus === 1;

  const isLocked = approvalStatus === 1 || approvalStatus === 2;

  const completedSections = [hasHeaderData, hasPatentInformation, hasDocument].filter(
    Boolean
  ).length;

  const completion = Math.round((completedSections / 3) * 100);

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

  const canSubmit = hasHeaderData && hasPatentInformation && hasDocument;

  const canEditHeader =
    approvalStatus === 0 || approvalStatus === 2 || approvalStatus === 3 || approvalStatus === 4;

  const canEditPatentInformation = approvalStatus === 0 || approvalStatus === 3;

  const canEditDocuments = approvalStatus === 0 || approvalStatus === 3;

  const canEditMedia =
    approvalStatus === 0 || approvalStatus === 2 || approvalStatus === 3 || approvalStatus === 4;

  // const canSubmitForApproval =
  //   approvalStatus === 4 ||
  //   (canSubmit &&
  //     hasChangesSinceLastAction &&
  //     (approvalStatus === 0 || approvalStatus === 2 || approvalStatus === 3));

  const canSubmitForApproval =
    approvalStatus === 4 ||
    (canSubmit && (approvalStatus === 0 || approvalStatus === 2 || approvalStatus === 3));

  const shouldUseHeaderUpdateDialog = approvalStatus === 2;

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
      setHeaderLoading(true);

      const hostingId = await getHostingId();

      const response = await updateIPHostingHeader(hostingId, data);

      setHeaderData(response?.data);

      // setHasChangesSinceLastAction(true);

      //previous state just to update the state without re-fetching the data from server
      // setHeaderData((prev) => ({
      //   ...prev,
      //   ...response?.data,
      // }));

      headerDialog.onFalse();
      headerUpdateDialog.onFalse();

      toast.success(response?.message || 'Header information saved successfully', {
        duration: 6000,
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to save header information', {
        duration: 8000,
      });
    } finally {
      setHeaderLoading(false);
    }
  };

  const handleDocumentSubmit = async ({ formData, removedDocumentIds }) => {
    try {
      const hostingId = await getHostingId();

      const response = await uploadPatentDocuments(hostingId, formData);

      setDocumentData(response.data);

      // setHasChangesSinceLastAction(true);

      toast.success(response?.message || 'Documents updated successfully', {
        duration: 6000,
      });

      documentDialog.onFalse();
    } catch (error) {
      console.error(error);

      toast.error(error?.message || 'Failed to save document information', {
        duration: 8000,
      });
    }
  };

  const handlePatentInformationSubmit = async (data) => {
    try {
      setPatentLoading(true);

      const hostingId = await getHostingId();

      const response = await updateIPHostingPatentInformation(hostingId, data);

      // console.log(`updateIPHostingPatentInformation`, response);

      // await mutate();

      setPatentInformationData(response.data);

      // setHasChangesSinceLastAction(true);

      patentInformationDialog.onFalse();

      toast.success(response?.message || 'Patent information saved successfully', {
        duration: 6000,
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to save patent information', {
        duration: 8000,
      });
    } finally {
      setPatentLoading(false);
    }
  };

  const handleMediaSubmit = async ({ formData }) => {
    try {
      const hostingId = await getHostingId();

      const response = await uploadPatentMedia(hostingId, formData);
      // console.log('Before setMediaData', response.data.media);
      setMediaData(response?.data?.media);
      // console.log('After setMediaData');

      // setHasChangesSinceLastAction(true);

      mediaDialog.onFalse();

      toast.success(response?.message || 'Media updated successfully', {
        duration: 6000,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save media', {
        duration: 8000,
      });
    }
  };

  const handleOpenHeaderDialog = () => {
    if (shouldUseHeaderUpdateDialog) {
      headerUpdateDialog.onTrue();
    } else {
      headerDialog.onTrue();
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      setSubmitLoading(true);

      const hostingId = await getHostingId();

      const response = await submitPatentHostingForApproval(hostingId);

      setApprovalStatus(response?.data?.status);

      setApprovalStatusName(response?.data?.statusName);

      setApprovalRemark(response?.data?.remark);

      setUpdatedAt(response?.data?.updatedAt);

      // setHasChangesSinceLastAction(false);

      toast.success(response?.message || 'Submitted for approval successfully', {
        duration: 6000,
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to submit for approval', {
        duration: 8000,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    // console.log('no hosting data');
    if (!hostingResponse) return;

    setHeaderData(hostingResponse?.data?.header);
    setPatentInformationData(hostingResponse?.data?.patentInformation);
    setMediaData(hostingResponse?.data?.media);
    setDocumentData(hostingResponse?.data?.document);
    setApprovalStatus(hostingResponse?.data?.status ?? 0);
    setApprovalStatusName(hostingResponse?.data?.statusName ?? 'Draft');
    setApprovalRemark(hostingResponse?.data?.remark ?? '');
    setUpdatedAt(hostingResponse?.data?.updatedAt ?? null);
  }, [hostingResponse]);

  const publishedPatent = {
    id: hostingResponse?.data?.id,
    title: hostingResponse?.data?.header?.title,
    mainTechnologyDomain: hostingResponse?.data?.patentInformation?.mainTechnologyDomain,
    techSubDomain: hostingResponse?.data?.patentInformation?.techSubDomain,
  };

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
        <Box
          sx={{
            position: 'sticky',
            top: {
              xs: 56, // Mobile
              sm: 64, // Tablet
              md: 72, // Desktop
            },
            zIndex: 1,
            // border: '1px solid green',
            bgcolor: 'background.paper',
            py: 1,
            mb: 3,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              borderRadius: 2,
            }}
          >
            {/* Desktop */}
            <Box
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  size="small"
                  color="inherit"
                  component={RouterLink}
                  href={paths.dashboard.patentHosting.root}
                  startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                  Back
                </Button>

                <Chip
                  label={`Status: ${approvalStatusName ?? 'Loading...'}`}
                  color={getStatusColor(approvalStatus)}
                  icon={<Iconify icon="solar:verified-check-bold" />}
                />

                <AdminRemarkPopover approvalRemark={approvalRemark} />

                {(approvalStatusName === 'Published' || approvalStatus === 2) && (
                  // <Button
                  //   variant="contained"
                  //   startIcon={<Iconify icon="solar:eye-bold" />}
                  //   onClick={() => setOpenPublishedDialog(true)}
                  // >
                  //   View Published Patent
                  // </Button>
                  <Button
                    variant="contained"
                    startIcon={
                      <Iconify
                        icon="solar:eye-bold"
                        sx={{
                          transition: 'transform .25s ease',
                        }}
                      />
                    }
                    onClick={() => setOpenPublishedDialog(true)}
                    sx={{
                      px: 2.5,
                      py: 1,
                      borderRadius: 1,
                      fontWeight: 700,
                      textTransform: 'none',
                      transition: 'all .3s ease',

                      // Gentle pulse while idle
                      animation: 'buttonPulse 2.8s ease-in-out infinite',

                      '@keyframes buttonPulse': {
                        '0%': {
                          boxShadow: '0 0 0 rgba(33,150,243,0)',
                        },
                        '50%': {
                          boxShadow: '0 0 14px rgba(33,150,243,.18)',
                        },
                        '100%': {
                          boxShadow: '0 0 0 rgba(33,150,243,0)',
                        },
                      },

                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: (theme) => theme.shadows[8],

                        '& .iconify': {
                          transform: 'translateX(3px)',
                        },
                      },

                      '&:active': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    View Published Patent
                  </Button>
                )}
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <SubmissionRequirementPopover />

                {/* <Button
                  variant="contained"
                  color="primary"
                  loading={submitLoading}
                  disabled={!canSubmitForApproval}
                  onClick={handleSubmitForApproval}
                  startIcon={<Iconify icon="solar:shield-check-bold" />}
                >
                  {isSubmitted ? 'Submitted' : 'Submit for Approval'}
                </Button> */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    <Iconify
                      icon="solar:shield-check-bold"
                      sx={{
                        transition: 'transform .25s ease',
                      }}
                    />
                  }
                  loading={submitLoading}
                  disabled={!canSubmitForApproval}
                  onClick={handleSubmitForApproval}
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 1,
                    fontWeight: 700,
                    textTransform: 'none',
                    transition: 'all .3s ease',

                    // Gentle pulse while idle
                    animation: 'buttonPulse 2.8s ease-in-out infinite',

                    '@keyframes buttonPulse': {
                      '0%': {
                        boxShadow: '0 0 0 rgba(33,150,243,0)',
                      },
                      '50%': {
                        boxShadow: '0 0 14px rgba(33,150,243,.18)',
                      },
                      '100%': {
                        boxShadow: '0 0 0 rgba(33,150,243,0)',
                      },
                    },

                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => theme.shadows[8],

                      '& .iconify': {
                        transform: 'translateX(3px)',
                      },
                    },

                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {isSubmitted ? 'Submitted' : 'Submit for Approval'}
                </Button>
              </Stack>
            </Box>

            {/* Mobile / Tablet */}
            <Stack
              spacing={1.5}
              sx={{
                display: {
                  xs: 'flex',
                  md: 'none',
                },
              }}
            >
              {/* Row 1 */}
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Button
                  size="small"
                  color="inherit"
                  component={RouterLink}
                  href={paths.dashboard.patentHosting.root}
                  startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                  Back
                </Button>

                <Chip
                  size="small"
                  label={`Status: ${approvalStatusName ?? 'Loading...'}`}
                  color={getStatusColor(approvalStatus)}
                  icon={<Iconify icon="solar:verified-check-bold" />}
                />
              </Stack>

              {/* Row 2 */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <AdminRemarkPopover approvalRemark={approvalRemark} />

                <SubmissionRequirementPopover />
              </Stack>

              {/* Row 3 */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                loading={submitLoading}
                disabled={!canSubmitForApproval}
                onClick={handleSubmitForApproval}
                startIcon={<Iconify icon="solar:shield-check-bold" />}
              >
                {isSubmitted ? 'Submitted' : 'Submit for Approval'}
              </Button>
            </Stack>
          </Paper>
        </Box>
        {updatedAt && (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            alignItems="center"
            sx={{ color: 'text.secondary', my: 1 }}
          >
            <Iconify icon="solar:clock-circle-bold" width={18} color="#076cd9" />

            <Typography variant="body2" color="#076cd9" fontWeight={500}>
              {approvalStatus === 2 ? 'Last updated' : 'Last saved'}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {fDateTime(updatedAt)}
            </Typography>
          </Stack>
        )}

        <Stack spacing={1} sx={{ mb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Iconify
              icon="solar:share-bold"
              width={22}
              sx={{ color: headerData?.title ? 'primary.main' : '#007bff', flexShrink: 0 }}
            />
            <Typography
              variant="h3"
              sx={{
                flex: 1,
                minWidth: 0,
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                lineHeight: 1.3,
                typography: {
                  xs: 'h4',
                  md: 'h3',
                },
              }}
            >
              {headerData?.title ? headerData.title : 'Host New Patent'}
            </Typography>
          </Stack>

          <CustomBreadcrumbs
            links={[
              { name: 'Dashboard', href: paths.dashboard.root },

              {
                name: 'Patent Hostings',
                href: paths.dashboard.patentHosting.root,
              },
              ...(patentInformationData?.recordNumber
                ? [
                    {
                      name: patentInformationData.recordNumber,
                      href: paths.dashboard.patentHosting.root,
                    },
                  ]
                : [{ name: 'New Patent Hosting', href: paths.dashboard.patentHosting.root }]),
            ]}
            sx={{ mb: { xs: 3, md: 3 } }}
          />

          {/* To notify user that these are missing field / sections */}
          <Alert
            severity="info"
            icon={<Iconify icon="tabler:bulb" />}
            variant="outlined"
            sx={{
              p: 2,
              mb: 1,
            }}
          >
            <Typography variant="body2">
              Please provide <strong>complete and accurate</strong> information in{' '}
              <strong>Header Information</strong>, <strong>Patent Information</strong>, and{' '}
              <strong>Patent Document</strong> sections.
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.75 }}>
              Once your patent hosting request is <strong>approved by the administrator</strong>,
              these sections will be <strong>permanently locked</strong> and{' '}
              <strong>cannot be modified</strong> in the future.
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.75 }}>
              After approval, only <strong>Patent Banner Image</strong>,{' '}
              <strong>Innovation Media</strong>, and <strong>Patent Status</strong> can be updated.
            </Typography>
          </Alert>

          <Card sx={{ p: 3, mb: 3, border: '1px solid rgb(228 242 255)' }}>
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
        </Stack>
        {/* Banner and Header */}
        {!hasHeaderData ? (
          <EmptyHeaderSection onEdit={handleOpenHeaderDialog} />
        ) : (
          <Card
            sx={{
              p: 3,
              // height: { xs: 220, md: 420 },
              // height: 1,
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgb(228 242 255)',
              // border: '1px solid red',
              mb: 4,
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
              <Iconify icon="solar:window-frame-bold" width={24} sx={{ color: 'primary.main' }} />

              <Typography variant="h6" fontWeight={700}>
                Header Information
              </Typography>
            </Stack>
            <IconButton
              onClick={handleOpenHeaderDialog}
              disabled={!canEditHeader}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 2,
                color: canEditHeader ? '#007bff' : 'action.disabled',
              }}
            >
              <Iconify
                icon="solar:pen-bold"
                width={22}
                // color={!canEditHeader ? '#007bff' : '#007bff'}
              />
            </IconButton>

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
                  p: 3,
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

                <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                  <Iconify
                    icon="solar:gallery-add-bold"
                    width={54}
                    sx={{ color: '#3e91eb' /* 'text.disabled'*/ }}
                  />

                  <Typography variant="h5">Banner Image</Typography>

                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Add a banner image to enhance your patent presentation (optional)
                  </Typography>
                </Stack>
              </Card>
            )}

            <Card
              sx={{
                p: { xs: 0, md: 2 },
                m: 1.5,
                mb: 3,
                border: '1px solid rgb(220 238 255)',
                // //   mt: 4,
                // bgcolor: '#f3f9ff',
                // border: '1px dashed',
                // borderColor: 'divider',
                //overlap with banner if remove margin bottom of banner
                mt: { xs: -4, md: -10 },
                mx: { md: 2.5 },
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                }}
              >
                <Chip
                  label={headerData.legalStatusCurrent}
                  icon={<Iconify icon="solar:shield-check-bold" />}
                  color="success"
                  sx={{ width: 'fit-content', mb: 2 }}
                />

                <Typography variant="h4" sx={{ mb: 1, lineHeight: 1.25 }}>
                  {headerData.title}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  {headerData.summary}
                </Typography>
              </Box>
            </Card>
            {/* </Card> */}
          </Card>
        )}
        {/* Document */}
        {hasDocument ? (
          <DocumentSectionCard
            documentData={documentData}
            isLocked={!canEditDocuments}
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
                isLocked={!canEditMedia}
                onEdit={mediaDialog.onTrue}
              />
            )}
          </Stack>

          {/* Right Side */}

          {!hasPatentInformation ? (
            <PatentInformationPlaceholderView
              onEdit={patentInformationDialog.onTrue}
              // isLocked={isLocked}
            />
          ) : (
            <Card sx={{ p: 3, mb: 4, position: 'relative', border: '1px solid rgb(228 242 255)' }}>
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
              <IconButton
                onClick={patentInformationDialog.onTrue}
                disabled={!canEditPatentInformation}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 2,
                  color: canEditHeader ? '#007bff' : 'action.disabled',
                }}
              >
                <Iconify icon="solar:pen-bold" width={22} />
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

      <PatentHeaderUpdateDialog
        open={headerUpdateDialog.value}
        onClose={headerUpdateDialog.onFalse}
        loading={headerLoading}
        defaultValues={headerData}
        onSubmit={handleHeaderSubmit}
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

      <PatentPublishedDialog
        open={openPublishedDialog}
        onClose={() => setOpenPublishedDialog(false)}
        patent={publishedPatent}
      />
    </>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 0:
      return 'warning';
    case 1:
      return 'info';
    case 2:
      return 'success';
    case 3:
      return 'error';
    case 4:
      return 'primary';
    default:
      return 'default';
  }
}
