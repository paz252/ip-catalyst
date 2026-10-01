import { Container, Stack, Typography, Button } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function PatentHomeChartError({ onRetry }) {
  return (
    <Container maxWidth={false} sx={{ px: { md: 5 }, py: 5 }}>
      <Stack alignItems="center" spacing={2}>
        <Iconify icon="solar:danger-triangle-bold" width={48} />

        <Typography variant="h6">Something went wrong</Typography>

        <Typography variant="body2" color="text.secondary">
          Failed to load patent data. Please try again.
        </Typography>

        <Button variant="contained" onClick={onRetry}>
          Retry
        </Button>
      </Stack>
    </Container>
  );
}
