import { m } from 'framer-motion';
import { useNavigate } from 'react-router';

import { Box, Grid, Stack, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { MotionViewport, varFade } from 'src/components/animate';

// import { useAuthContext } from 'src/auth/hooks';

export function HeroSection() {
  // const { authenticated } = useAuthContext();
  const navigate = useNavigate();

  // console.log(authenticated);

  const handleNavigate = () => {
    // navigate(`${paths.dashboard.challenge.logo.root}?challenge=logo`);
    navigate(paths.dashboard.challenge.logo.root);
  };
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 2, md: 4 },
      }}
    >
      <Grid container spacing={6} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <m.div variants={varFade('inUp', { distance: 24 })}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 700 }}>
              CIPIE Logo Competition
            </Typography>
          </m.div>

          <m.div variants={varFade('inUp', { distance: 24 })}>
            <Typography
              variant="h2"
              sx={{
                mt: 1,
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              Design the Future of
              <Box component="span" sx={{ color: 'primary.main' }}>
                {' '}
                CIPIE
              </Box>
            </Typography>
          </m.div>

          <Typography
            sx={{
              mt: 3,
              color: 'text.secondary',
              maxWidth: 520,
            }}
          >
            Showcase your creativity and stand a chance to win
            <Typography component="span" color="warning.main" fontWeight={700}>
              {' '}
              ₹15,000 Cash Prize
            </Typography>
            . Submit your original logo and become part of the CIPIE identity.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
            <Button
              component={RouterLink}
              size="large"
              variant="contained"
              startIcon={<Iconify icon="solar:medal-star-bold" />}
              onClick={handleNavigate}
            >
              Participate Now
            </Button>

            <Button
              size="large"
              variant="outlined"
              startIcon={<Iconify icon="solar:document-bold" />}
              onClick={() => {
                document
                  .getElementById('terms-section')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Terms & Conditions
            </Button>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              p: 5,
              borderRadius: 4,
              bgcolor: 'background.neutral',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 250,
                height: 250,
                borderRadius: '50%',
                bgcolor: 'primary.lighter',
                filter: 'blur(80px)',
                right: -80,
                top: -80,
              }}
            />

            <Iconify
              icon="solar:cup-star-bold"
              width={180}
              sx={{
                color: 'warning.main',
                animation: 'float 4s ease-in-out infinite',

                '@keyframes float': {
                  '0%': {
                    transform: 'translateY(0px)',
                  },
                  '50%': {
                    transform: 'translateY(-15px)',
                  },
                  '100%': {
                    transform: 'translateY(0px)',
                  },
                },
              }}
            />

            <Typography variant="h3" color="warning.main" fontWeight={800}>
              ₹15,000
            </Typography>

            <Typography color="text.secondary">Winner Prize</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
