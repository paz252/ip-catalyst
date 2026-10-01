import Skeleton from '@mui/material/Skeleton';
import { Card, Container, Divider, Stack, Box } from '@mui/material';

// ----------------------------------------------------------------------

export function PatentListSkeleton({ sx, itemCount = 16, variant = 'vertical', ...other }) {
  if (variant === 'horizontal') {
    return Array.from({ length: itemCount }, (_, index) => (
      <Box
        key={index}
        sx={[
          (theme) => ({
            display: 'flex',
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: `solid 1px ${theme.vars.palette.divider}`,
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Box
          sx={{
            p: 3,
            gap: 2,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
            <Skeleton sx={{ width: 24, height: 12 }} />
          </Box>

          <Skeleton sx={{ width: 1, height: 10 }} />
          <Skeleton sx={{ width: `calc(100% - 40px)`, height: 10 }} />
          <Skeleton sx={{ width: `calc(100% - 80px)`, height: 10 }} />
        </Box>

        <Box sx={{ p: 1, display: { xs: 'none', sm: 'block' } }}>
          <Skeleton sx={{ width: 170, height: 240, flexShrink: 0 }} />
        </Box>
      </Box>
    ));
  }

  return Array.from({ length: itemCount }, (_, index) => (
    <Box
      key={index}
      sx={[
        (theme) => ({
          display: 'flex',
          borderRadius: 2,
          flexDirection: 'column',
          bgcolor: 'background.paper',
          border: `solid 1px ${theme.vars.palette.divider}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ p: 1 }}>
        <Skeleton sx={{ pt: '100%' }} />
      </Box>

      <Box
        sx={{
          p: 3,
          pt: 2,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Skeleton variant="circular" sx={{ width: 40, height: 40, flexShrink: 0 }} />
        <Box
          sx={{
            gap: 1,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Skeleton sx={{ height: 10 }} />
          <Skeleton sx={{ width: 0.5, height: 10 }} />
        </Box>
      </Box>
    </Box>
  ));
}

// ----------------------------------------------------------------------

export function PatentDetailsSkeleton() {
  return (
    <Container
      maxWidth={false}
      sx={(theme) => ({
        maxWidth: 1,
        mt: 5,
        borderBottom: `solid 1px ${theme.vars.palette.divider}`,
      })}
    >
      {/* Breadcrumb */}
      <Skeleton
        variant="rounded"
        width={320}
        height={26}
        sx={{ mt: 3, mb: { xs: 3, md: 5 }, borderRadius: 1 }}
      />

      {/* Banner */}
      <Skeleton
        variant="rounded"
        height={420}
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      />

      {/* Header Card */}
      <Card
        sx={{
          p: 2,
          mb: 4,
          bgcolor: '#fafdff',
          border: '1px solid #e6f3ff',
        }}
      >
        <Stack spacing={2}>
          <Skeleton variant="rounded" width={120} height={34} sx={{ borderRadius: 5 }} />

          <Skeleton variant="text" width="80%" height={56} />

          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="95%" />
          <Skeleton variant="text" width="60%" />

          <Divider />

          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={220} height={34} sx={{ borderRadius: 5 }} />

            <Skeleton variant="rounded" width={180} height={34} sx={{ borderRadius: 5 }} />
          </Stack>
        </Stack>
      </Card>

      {/* Document Section */}
      <Card
        sx={{
          p: 2.5,
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="circular" width={42} height={42} />

            <Box>
              <Skeleton width={260} height={24} />
              <Skeleton width={150} height={18} />
            </Box>
          </Stack>

          <Skeleton variant="rounded" width={110} height={38} sx={{ borderRadius: 2 }} />
        </Stack>
      </Card>

      {/* Main Content */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          mb: 4,
          gridTemplateColumns: {
            xs: '1fr',
            md: '360px 1fr',
          },
        }}
      >
        {/* Left Media */}
        <Card
          sx={{
            p: 2,
          }}
        >
          <Skeleton variant="rounded" height={240} sx={{ borderRadius: 2 }} />

          <Stack direction="row" spacing={1} mt={2}>
            <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: 5 }} />
            <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: 5 }} />
            <Skeleton variant="rounded" width={80} height={26} sx={{ borderRadius: 5 }} />
          </Stack>
        </Card>

        {/* Patent Information */}
        <Card
          sx={{
            p: 3,
            bgcolor: '#fafdff',
            border: '1px solid #e6f3ff',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
            <Skeleton variant="circular" width={24} height={24} />

            <Skeleton width={180} height={28} />
          </Stack>

          {Array.from({ length: 9 }).map((_, index) => (
            <Stack
              key={index}
              direction="row"
              justifyContent="space-between"
              spacing={3}
              sx={{ mb: 2.5 }}
            >
              <Skeleton width={180} height={22} />

              <Skeleton width="55%" height={22} />
            </Stack>
          ))}
        </Card>
      </Box>
    </Container>
  );
}
