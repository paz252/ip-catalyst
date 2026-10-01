import { Box, Card, Stack, Skeleton, Container } from '@mui/material';

export function IPHostingDetailsSkeleton() {
  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* Back Button */}
        {/* <Skeleton variant="text" width={120} height={32} /> */}

        {/* Breadcrumb */}
        <Skeleton variant="text" width={320} height={28} />

        {/* Banner */}
        <Skeleton variant="rounded" height={420} sx={{ borderRadius: 3 }} />

        {/* Header Card */}
        <Card
          sx={{
            p: 4,
            mt: -6,
            mx: { md: 4 },
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Stack spacing={2}>
            <Skeleton variant="rounded" width={120} height={32} sx={{ borderRadius: 10 }} />

            <Skeleton variant="text" width="80%" height={48} />

            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="70%" />
          </Stack>
        </Card>

        {/* Documents */}
        <Card sx={{ p: 3 }}>
          <Skeleton variant="text" width={180} height={32} />

          <Stack spacing={2} sx={{ mt: 2 }}>
            {[1, 2].map((item) => (
              <Skeleton key={item} variant="rounded" height={56} />
            ))}
          </Stack>
        </Card>

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
          {/* Media */}
          <Card sx={{ p: 3 }}>
            <Skeleton variant="text" width={120} height={32} />

            <Stack spacing={2} sx={{ mt: 2 }}>
              <Skeleton variant="rounded" height={180} />
              <Skeleton variant="rounded" height={180} />
            </Stack>
          </Card>

          {/* Patent Information */}
          <Card sx={{ p: 3 }}>
            <Skeleton variant="text" width={220} height={32} />

            <Stack spacing={2} sx={{ mt: 3 }}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Skeleton key={item} variant="rounded" height={28} />
              ))}
            </Stack>
          </Card>
        </Box>
      </Stack>
    </Container>
  );
}
