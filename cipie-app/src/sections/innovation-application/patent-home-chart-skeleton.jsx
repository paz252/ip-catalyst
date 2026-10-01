import { Container, Skeleton, Stack, Box } from '@mui/material';

export function PatentHomeChartSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <Container maxWidth={false} sx={{ px: { md: 5 }, py: 3 }}>
        <Stack spacing={1.5}>
          <Skeleton variant="text" width={300} height={32} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </Stack>
      </Container>

      {/* Breadcrumb Skeleton */}
      <Container
        maxWidth={false}
        sx={{
          px: { md: 5 },
          py: 1,
          borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Stack direction="row" spacing={1}>
          <Skeleton width={60} />
          <Skeleton width={20} />
          <Skeleton width={120} />
        </Stack>
      </Container>

      {/* Chart + Legend Skeleton */}
      <Container maxWidth={false} sx={{ px: { md: 5 }, py: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }} // ✅ responsive
          spacing={4}
          alignItems="center"
          justifyContent="center"
        >
          {/* Circular Chart */}
          <Box>
            <Skeleton variant="circular" width={220} height={220} />
          </Box>

          {/* Legend List */}
          <Stack spacing={1.2} sx={{ width: { xs: '100%', md: 250 } }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Stack key={i} direction="row" spacing={1} alignItems="center">
                <Skeleton variant="circular" width={12} height={12} />
                <Skeleton variant="text" width="80%" />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
