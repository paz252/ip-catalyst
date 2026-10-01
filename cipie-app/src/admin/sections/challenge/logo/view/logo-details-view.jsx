import { toast } from 'sonner';
import { useEffect, useState } from 'react';

import {
  Box,
  Card,
  Divider,
  Button,
  Typography,
  Alert,
  Chip,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { updateLogoStatus } from 'src/actions/challenge';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const STATUS_OPTIONS = [
  {
    value: 1,
    label: 'Shortlisted',
    color: 'success',
  },
  {
    value: 2,
    label: 'InReview',
    color: 'warning',
  },

  {
    value: 3,
    label: 'Winner',
    color: 'primary',
  },
  {
    value: 4,
    label: 'Rejected',
    color: 'error',
  },
];

export function LogoDetailsView({ logoDetails, logoDetailsLoading, logoDetailsError }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const selectedOption = STATUS_OPTIONS.find((option) => option.value === selectedStatus);

  useEffect(() => {
    if (logoDetails) {
      setCurrentStatus(logoDetails.status);
      setSelectedStatus(logoDetails.status);
    }
  }, [logoDetails]);

  if (logoDetailsLoading) {
    return (
      <DashboardContent forceFullWidth>
        <Box
          sx={{
            minHeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (logoDetailsError) {
    return (
      <DashboardContent forceFullWidth>
        <Alert severity="error">Failed to load logo details. Please try again.</Alert>
      </DashboardContent>
    );
  }

  if (!logoDetails) {
    return (
      <DashboardContent forceFullWidth>
        <EmptyContent title="Logo submission not found" />
      </DashboardContent>
    );
  }

  const logo = logoDetails;

  const handleUpdateStatus = async () => {
    if (!selectedOption) return;

    try {
      const response = await updateLogoStatus({
        id: logo.id,
        status: selectedOption.value,
        statusName: selectedOption.label,
      });

      if (response.success) {
        setCurrentStatus(selectedStatus);
        toast.success('Logo status updated successfully');
        router.push(paths.admin.challenge.logo.list);
      } else {
        toast.error(response.message || 'Failed to update logo status');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update logo status');
    }
  };

  return (
    <DashboardContent forceFullWidth>
      <Box sx={{ mb: 2 }}>
        <Button
          component={RouterLink}
          href={paths.admin.challenge.logo.root}
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
        // heading="Logo Details"
        links={[
          { name: 'Dashboard', href: paths.admin.dashboard },
          {
            name: 'Logo Challenge',
            href: paths.admin.challenge.logo.root,
          },
          { name: 'Details' },
        ]}
        action={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="logo-status-label">Status</InputLabel>

              <Select
                labelId="logo-status-label"
                value={selectedStatus ?? ''}
                label="Status"
                onChange={(event) => setSelectedStatus(Number(event.target.value))}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return 'Select status';
                  }

                  return STATUS_OPTIONS.find((option) => option.value === selected)?.label || '';
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="solar:check-circle-bold" />}
              onClick={handleUpdateStatus}
              disabled={selectedStatus === null || selectedStatus === currentStatus}
            >
              Update Status
            </Button>
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      {/* Hero */}
      <Card
        sx={{
          mb: 3,
          overflow: 'hidden',
          position: 'relative',
          borderRadius: 3,
          background: (theme) =>
            `linear-gradient(
              135deg,
              ${theme.vars.palette.background.paper} 0%,
              ${theme.vars.palette.primary.light} 550%
            )`,
          boxShadow: (theme) => theme.customShadows?.z8,
        }}
      >
        {/* Decorative glow */}
        {/* <Box
          sx={{
            position: 'absolute',
            width: 280,
            height: 280,
            borderRadius: '50%',
            right: -100,
            top: -140,
            bgcolor: 'primary.main',
            opacity: 0.06,
          }}
        /> */}

        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  letterSpacing: 1.2,
                }}
              >
                Logo Challenge
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                {logo.title || 'Untitled Logo'}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Submitted on {fDateTime(logo.createdAt)}
              </Typography>
            </Box>

            <Chip
              variant="soft"
              label={logo.statusName}
              color={STATUS_OPTIONS.find((option) => option.value === logo.status)?.color || 'info'}
              icon={<Iconify icon="solar:shield-check-bold" />}
              sx={{
                width: 'fit-content',
              }}
            />
          </Box>
        </Box>
      </Card>

      {/* Main content */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1.2fr 0.8fr',
          },
          gap: 3,
        }}
      >
        {/* Logo preview */}
        <Card
          sx={{
            overflow: 'hidden',
            minHeight: { xs: 320, md: 520 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.02), transparent 65%)',
            }}
          />

          <Box
            component="img"
            src={`${CONFIG.challenge.logo}${logo.imagePath}`}
            alt={logo.title || 'Submitted logo'}
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              maxHeight: 520,
              objectFit: 'contain',
              p: { xs: 3, md: 5 },
            }}
          />
        </Card>

        {/* Details */}
        <Card
          sx={{
            p: { xs: 2.5, md: 3 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" sx={{ mb: 3 }}>
            Submission Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DetailItem
              icon="solar:pen-new-square-bold-duotone"
              label="Logo title"
              value={logo.title || 'Untitled Logo'}
            />

            <DetailItem
              icon="solar:document-text-bold-duotone"
              label="Description"
              value={logo.description || 'No description provided'}
            />

            <Divider />

            <DetailItem
              icon="solar:calendar-date-bold-duotone"
              label="Submitted on"
              value={fDateTime(logo.createdAt)}
            />

            <DetailItem
              icon="solar:check-circle-bold-duotone"
              label="Status"
              value={logo.statusName}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />
        </Card>
      </Box>
    </DashboardContent>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.lighter',
          color: 'primary.main',
        }}
      >
        <Iconify icon={icon} width={21} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
          {label}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            wordBreak: 'break-word',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
