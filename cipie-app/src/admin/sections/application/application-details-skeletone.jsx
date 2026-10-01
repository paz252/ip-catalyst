import { Box, Card, Divider, Grid, Skeleton, Stack } from '@mui/material';

export default function ApplicationDetailsSkeleton() {
  return (
    <Box>
      {/* Breadcrumb + Actions */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Box>
          <Skeleton width={120} height={18} />
          <Skeleton width={220} height={36} />
        </Box>

        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={110} height={40} />
          <Skeleton variant="rounded" width={110} height={40} />
        </Stack>
      </Stack>

      {/* Main Details Card */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Skeleton width="40%" height={36} sx={{ mb: 2 }} />

        <Skeleton height={24} />
        <Skeleton height={24} />
        <Skeleton width="90%" height={24} />

        <Divider sx={{ my: 2 }} />

        <Skeleton height={24} />
        <Skeleton width="75%" height={24} />
        <Skeleton width="60%" height={24} />
      </Card>

      {/* Two-column layout */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Skeleton width="35%" height={32} sx={{ mb: 2 }} />

            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={22} sx={{ mb: 1 }} />
            ))}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <Skeleton width="50%" height={32} sx={{ mb: 2 }} />

            <Skeleton height={22} />
            <Skeleton height={22} />
            <Skeleton height={22} />

            <Divider sx={{ my: 2 }} />

            <Skeleton height={22} />
            <Skeleton width="80%" height={22} />

            <Divider sx={{ my: 2 }} />

            <Skeleton height={22} />
            <Skeleton width="70%" height={22} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}