import { m } from 'framer-motion';

import { Avatar, Box, Button, Card, Chip, Container, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

export function EligibilitySection() {
  return (
    <Container
      sx={{
        py: { xs: 2, md: 4 },
      }}
    >
      <Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.5}>
            ELIGIBILITY
          </Typography>

          <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
            Who Can Participate?
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 2,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            Ensure your registration meets the participation requirements before submitting your
            logo design for the CIPIE Logo Competition.
          </Typography>
        </Box>
        <Card
          sx={{
            mt: 2,
            p: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'error.lighter',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z8,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 180,
              height: 180,
              borderRadius: '50%',
              bgcolor: 'error.lighter',
              opacity: 0.35,
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Avatar
              sx={{
                width: 68,
                height: 68,
                bgcolor: 'error.lighter',
                color: 'error.main',
              }}
            >
              <Iconify icon="solar:user-check-bold" width={34} />
            </Avatar>

            <Box flex={1}>
              <Typography variant="h5" fontWeight={700}>
                Registration Requirements
              </Typography>

              {/* <Typography
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  lineHeight: 1.8,
                }}
              >
                Participation in the CIPIE Logo Competition is limited to users registered under the
                <strong> Any Natural User</strong> category.
              </Typography> */}

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  lineHeight: 1.8,
                }}
              >
                Participation in the CIPIE Logo Competition is limited to users registered under the{' '}
                <strong>Any Natural User</strong> category. Please select{' '}
                <strong>Any Natural User</strong> as your User Type during registration.
              </Typography>

              <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ mt: 3 }}>
                {/* <Chip
                  color="info"
                  icon={<Iconify icon="solar:user-id-bold" />}
                  label="Any Natural User"
                /> */}

                <m.div
                  animate={{
                    scale: [1, 1.04, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ display: 'inline-flex' }}
                >
                  <Chip
                    color="primary"
                    icon={<Iconify icon="solar:user-id-bold" />}
                    label="User Type: Any Natural User"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      px: 1,
                      py: 2.5,
                      border: '1px solid #007867',
                      // color: '#0b57d0',
                    }}
                  />
                </m.div>
              </Stack>
              <Button
                component={RouterLink}
                to={paths.auth.jwt.signUp}
                // variant="outlined"
                color="black"
                endIcon={<Iconify icon="solar:arrow-right-bold" />}
                sx={{ mt: 4 }}
              >
                Register Now
              </Button>
            </Box>
          </Stack>
        </Card>
      </Box>
    </Container>
  );
}
