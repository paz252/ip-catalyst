import {
  Box,
  Card,
  Divider,
  Button,
  Typography,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const STATUS_COLOR_MAP = {
  0: 'info', // Submitted
  1: 'success', // Shortlisted
  2: 'warning', // In Review
  3: 'primary', // Winner
  4: 'error', // Rejected
};

export function LogoDetailsView({ data, loading, error }) {
  if (loading) {
    return (
      <DashboardContent>
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

  if (error) {
    return (
      <DashboardContent>
        <Alert severity="error">Failed to load logo details. Please try again.</Alert>
      </DashboardContent>
    );
  }

  if (!data) {
    return (
      <DashboardContent>
        <EmptyContent title="Logo submission not found" />
      </DashboardContent>
    );
  }

  const logo = data;

  return (
    <DashboardContent>
      <Box sx={{ mb: 2 }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.challenge.logo.root}
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
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Logo Challenge',
            href: paths.dashboard.challenge.logo.root,
          },
          { name: 'Details' },
        ]}
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
              color={STATUS_COLOR_MAP[logo.status] || 'default'}
              icon={<Iconify icon="solar:shield-check-bold" />}
              sx={{
                width: 'fit-content',
              }}
            />
          </Box>
        </Box>
      </Card>

      {logo.status === 3 && (
        <Card
          sx={{
            mb: 3,
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.vars.palette.primary.main}`,
            background: (theme) =>
              `linear-gradient(
          135deg,
          ${theme.vars.palette.primary.lighter} 0%,
          ${theme.vars.palette.background.paper} 100%
        )`,
            boxShadow: (theme) => theme.customShadows?.z8,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                flexShrink: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <Iconify icon="solar:cup-star-bold" width={28} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                }}
              >
                🎉 Congratulations!
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Your logo has been selected as the winner of the Logo Challenge.
              </Typography>
            </Box>
          </Box>
        </Card>
      )}

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

function WinnerAnnouncement() {
  return (
    <Card
      sx={{
        mb: 3,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.vars.palette.primary.main}`,
        background: (theme) =>
          `linear-gradient(
            135deg,
            ${theme.vars.palette.primary.lighter} 0%,
            ${theme.vars.palette.background.paper} 100%
          )`,
      }}
    >
      {/* Floating sparkles */}
      <Box
        sx={{
          position: 'absolute',
          top: 15,
          left: '12%',
          animation: 'winnerFloat 2.5s ease-in-out infinite',
          '@keyframes winnerFloat': {
            '0%, 100%': {
              transform: 'translateY(0) rotate(0deg)',
              opacity: 0.5,
            },
            '50%': {
              transform: 'translateY(-8px) rotate(15deg)',
              opacity: 1,
            },
          },
        }}
      >
        <Iconify icon="solar:star-bold" width={18} color="primary.main" />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 25,
          right: '15%',
          animation: 'winnerFloat2 3s ease-in-out infinite',
          '@keyframes winnerFloat2': {
            '0%, 100%': {
              transform: 'translateY(0) scale(1)',
              opacity: 0.4,
            },
            '50%': {
              transform: 'translateY(-10px) scale(1.2)',
              opacity: 1,
            },
          },
        }}
      >
        <Iconify icon="solar:star-bold" width={14} color="primary.main" />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          right: '30%',
          animation: 'winnerFloat3 2s ease-in-out infinite',
          '@keyframes winnerFloat3': {
            '0%, 100%': {
              transform: 'translateY(0)',
              opacity: 0.3,
            },
            '50%': {
              transform: 'translateY(-7px)',
              opacity: 0.9,
            },
          },
        }}
      >
        <Iconify icon="solar:star-bold" width={11} color="primary.main" />
      </Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: { xs: 3, md: 3.5 },
          textAlign: 'center',
        }}
      >
        {/* Trophy */}
        <Box
          sx={{
            width: 64,
            height: 64,
            flexShrink: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            animation: 'trophyPulse 2s ease-in-out infinite',
            boxShadow: (theme) => `0 0 0 0 ${theme.vars.palette.primary.main}`,
            '@keyframes trophyPulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.15)',
              },
              '50%': {
                transform: 'scale(1.08)',
                boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)',
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
              },
            },
          }}
        >
          <Iconify icon="solar:cup-star-bold" width={34} />
        </Box>

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              letterSpacing: '-0.02em',
            }}
          >
            🎉 Congratulations!
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontWeight: 500,
            }}
          >
            Your logo has been selected as the winner of the Logo Challenge.
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
