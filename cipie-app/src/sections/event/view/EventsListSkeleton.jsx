import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

export default function EventsListSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <Card key={index}>
          {/* Image */}
          <Skeleton
            variant="rectangular"
            sx={{
              width: '100%',
              height: 220,
            }}
          />

          <CardContent>
            {/* Title */}
            <Skeleton variant="text" width="85%" height={34} sx={{ mb: 1 }} />

            {/* Date */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Skeleton variant="circular" width={18} height={18} />
              <Skeleton variant="text" width="45%" />
            </Stack>

            {/* Location */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Skeleton variant="circular" width={18} height={18} />
              <Skeleton variant="text" width="60%" />
            </Stack>

            {/* Description */}
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="95%" />
            <Skeleton variant="text" width="75%" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
