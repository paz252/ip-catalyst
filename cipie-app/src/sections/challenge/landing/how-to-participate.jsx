import { Avatar, Box, Card, Container, Grid, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function HowToParticipateSection() {
  const steps2 = [
    {
      number: '01',
      icon: 'solar:user-plus-bold',
      title: 'Register',
      description: 'Create your account by selecting the Challenge Round registration option.',
      color: 'primary.main',
    },
    {
      number: '02',
      icon: 'solar:home-angle-bold',
      title: 'Access Dashboard',
      description:
        'After successful registration, you will be redirected to your dashboard home page.',
      color: 'success.main',
    },
    {
      number: '03',
      icon: 'solar:sidebar-minimalistic-bold',
      title: 'Open Logo Competition',
      description:
        'Click the Logo Competition shortcut on your dashboard or access it anytime from the left sidebar.',
      color: 'warning.main',
    },
    {
      number: '04',
      icon: 'solar:gallery-add-bold',
      title: 'Submit Your Logo',
      description:
        'Upload your logo, provide a brief description, and submit your design for review.',
      color: 'info.main',
    },
    // {
    //   number: '05',
    //   icon: 'solar:verified-check-bold',
    //   title: 'Evaluation & Winner',
    //   description:
    //     'Our review committee will evaluate all submissions and notify the selected winner via registered email.',
    //   color: 'secondary.main',
    // },
  ];

  const steps = [
    {
      number: '01',
      icon: 'solar:user-plus-bold',
      title: 'Register',
      description:
        'Visit the registration page. Select Any Natural User under the User Type dropdown while registering.',
      color: 'primary.main',
    },
    {
      number: '02',
      icon: 'solar:home-angle-bold',
      title: 'Access Dashboard',
      description: 'After successful registration, you will be redirected to your dashboard.',
      color: 'success.main',
    },
    {
      number: '03',
      icon: 'solar:sidebar-minimalistic-bold',
      title: 'Open Logo Challenge',
      description: 'Select Logo Challenge from the left sidebar to access the challenge.',
      color: 'warning.main',
    },
    {
      number: '04',
      icon: 'solar:gallery-add-bold',
      title: 'Submit Your Logo',
      description:
        'Upload your logo, provide a brief description, and submit your design for review.',
      color: 'info.main',
    },
  ];

  return (
    <Container
      sx={{
        py: { xs: 2, md: 4 },
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Typography
          variant="overline"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          HOW TO PARTICIPATE
        </Typography>

        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
          Participate in 5 Simple Steps
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{
            maxWidth: 700,
          }}
        >
          Follow these simple steps to participate in the CIPIE Logo Competition and submit your
          creative logo for evaluation.
        </Typography>
      </Stack>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {steps.map((step) => (
          <Grid key={step.number} size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                p: 3,
                height: 1,
                borderRadius: 3,
                transition: 'all .3s ease',
                border: '1px solid',
                borderColor: 'divider',

                '&:hover': {
                  transform: 'translateY(-6px)',
                  borderColor: 'error.lighter', //step.color,
                  boxShadow: (theme) => theme.customShadows.z12,
                },
              }}
            >
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'error.lighter', //`${step.color}20`,
                    color: 'error.main', //step.color,
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {step.number}
                </Avatar>

                <Box flex={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* <Iconify icon={step.icon} width={22} sx={{ color: step.color }} /> */}

                    <Typography variant="h6">{step.title}</Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      lineHeight: 1.8,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
