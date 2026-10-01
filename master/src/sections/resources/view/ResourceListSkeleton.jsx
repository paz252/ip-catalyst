import { Box, Card, Skeleton } from '@mui/material';

export default function ResourceListSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Image placeholder (MATCH CardMedia height) */}
          <Skeleton
            variant="rectangular"
            height={180}
            sx={{ width: '100%' }}
          />

          {/* Content */}
          <Box sx={{ p: 2 }}>
            <Skeleton width="80%" height={28} sx={{ mb: 1 }} />
            <Skeleton width="100%" />
            <Skeleton width="95%" />
            <Skeleton width="85%" />
            <Skeleton width="60%" />
          </Box>
        </Card>
      ))}
    </>
  );
}