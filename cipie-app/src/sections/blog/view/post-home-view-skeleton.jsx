import {
  Container,
  Typography,
  Stack,
  Box,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';

export default function PostListHomeSkeleton() {
  const skeletonArray = Array.from(new Array(6)); // 6 cards

  return (
    <Container sx={{ mb: 10 }}>
      {/* Header */}
      <Skeleton variant="text" width={120} height={40} sx={{ mb: 3, mt: { xs: 1, md: 3 } }} />

      {/* Search & Sort Controls */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Skeleton variant="rounded" height={56} width="100%" />
        <Skeleton variant="rounded" height={56} width={{ xs: '100%', sm: 200 }} />
      </Stack>

      {/* Blog Grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {skeletonArray.map((_, index) => (
          <Card key={index}>
            {/* Image Skeleton */}
            <Skeleton variant="rectangular" height={180} />

            <CardContent>
              {/* Title */}
              <Skeleton variant="text" height={30} width="80%" />

              {/* Description lines */}
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="60%" />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Skeleton variant="rounded" width={250} height={40} />
      </Stack>
    </Container>
  );
}