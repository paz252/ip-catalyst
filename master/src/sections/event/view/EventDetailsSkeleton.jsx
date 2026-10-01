import { Container, Box, Skeleton, Grid, Card } from '@mui/material';

export default function EventDetailsSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      
      {/* Banner Skeleton */}
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mb: 4 }} />

      {/* About */}
      <Skeleton width="30%" height={40} sx={{ mb: 2 }} />
      <Skeleton width="100%" height={20} />
      <Skeleton width="100%" height={20} />
      <Skeleton width="80%" height={20} sx={{ mb: 3 }} />

      <Skeleton variant="rectangular" width={120} height={40} sx={{ mb: 5 }} />

      {/* Agenda Table */}
      <Skeleton width="20%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 5 }} />

      {/* Speakers */}
      <Skeleton width="25%" height={40} sx={{ mb: 3 }} />

      {[1, 2].map((item) => (
        <Card key={item} sx={{ display: 'flex', mb: 4, p: 2 }}>
          <Skeleton variant="rectangular" width={150} height={150} sx={{ borderRadius: 2 }} />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Skeleton width="40%" height={30} />
            <Skeleton width="60%" height={20} />
            <Skeleton width="100%" height={20} />
            <Skeleton width="90%" height={20} />
          </Box>
        </Card>
      ))}

      {/* Venue */}
      <Skeleton width="25%" height={40} sx={{ mt: 5, mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Skeleton width="80%" height={20} />
          <Skeleton width="60%" height={20} />
          <Skeleton width="70%" height={20} />
        </Grid>
        <Grid item xs={12} md={7}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>

      {/* Gallery */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {[1, 2, 3, 4].map((g) => (
          <Grid item xs={6} sm={4} md={3} key={g}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}