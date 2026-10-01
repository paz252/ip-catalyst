import { Box, Container, Grid, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const IMPACT_DATA = [
  { label: 'Innovations Supported', value: '500+', icon: 'solar:lightbulb-bold' },
  { label: 'Patents Filed', value: '200+', icon: 'solar:document-bold' },
  { label: 'Startups & MSMEs Empowered', value: '50+', icon: 'solar:users-group-rounded-bold' },
  { label: 'Countries Targeted', value: '25+', icon: 'solar:global-bold' },
];

export function IPCatalystImpact() {
  return (
    <Box
      sx={{
        py: 6,
        bgcolor: '#003466',
        color: 'white',
      }}
    >
      <Container>
        <Typography variant="h5" align="center" fontWeight={700} sx={{ mb: 4 }}>
          IP Catalyst Impact
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {IMPACT_DATA.map((item, index) => (
            <Grid key={index} item xs={6} md={3}>
              <Stack alignItems="center" spacing={1.5}>
                <Iconify icon={item.icon} width={40} />

                <Typography variant="h4" fontWeight={700}>
                  {item.value}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {item.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
