import { Grid, Typography, Card, CardContent, Container, Box } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const cards = [
  {
    icon: 'solar:medal-star-bold',
    title: '₹15,000 Prize',
    desc: 'Win exciting cash prize.',
  },
  {
    icon: 'solar:star-bold',
    title: 'Recognition',
    desc: 'Winning logo may become the official CIPIE identity.',
  },
  {
    icon: 'solar:gallery-bold',
    title: 'Show Creativity',
    desc: 'Present your original design to experts.',
  },
  {
    icon: 'solar:verified-check-bold',
    title: 'Simple Submission',
    desc: 'Upload, describe and submit in minutes.',
  },
];
const cards2 = [
  {
    icon: 'solar:medal-star-bold',
    title: '₹15,000 Prize',
    desc: 'The selected winner will be awarded the competition prize.',
    color: 'warning.main',
  },
  {
    icon: 'solar:gallery-bold',
    title: 'Official CIPIE Logo',
    desc: 'Your design may be adopted as the official logo of CIPIE.',
    color: 'primary.main',
  },
  {
    icon: 'solar:copyright-bold',
    title: 'Trademark Registration',
    desc: 'The winning logo may be considered for official trademark registration by CIPIE.',
    color: 'success.main',
  },
  {
    icon: 'solar:letter-bold',
    title: 'Official Recognition',
    desc: 'The winner will be notified through their registered email address.',
    color: 'info.main',
  },
];

export function WhyParticipateSection() {
  return (
    <Container
      sx={{
        py: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>
          WHY PARTICIPATE
        </Typography>

        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
          More Than a Competition
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 2,
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          Showcase your creativity, gain recognition, and compete for exciting rewards while
          contributing to the visual identity of CIPIE.
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards2.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
            <Card
              sx={{
                height: 1,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all .35s ease',

                '&:hover': {
                  transform: 'translateY(-10px)',
                  borderColor: 'error.lighter',
                  boxShadow: (theme) => theme.customShadows.error,
                },
              }}
            >
              <CardContent>
                <Iconify
                  icon={item.icon}
                  width={48}
                  sx={{
                    color: 'error.main',
                    mb: 2,
                  }}
                />

                <Typography variant="h6">{item.title}</Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
