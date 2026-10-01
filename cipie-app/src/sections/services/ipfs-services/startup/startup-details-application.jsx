import { Button, Box, Card, Grid, Stack, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function StartupDetailsApplicationOld({ content, sx, ...other }) {
  const renderContent = () => (
    <Card
      sx={{
        p: 3,
        gap: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* <Typography variant="h4">{job?.title}</Typography> */}

      <Stack spacing={3}>
        {[
          { title: 'Registration', desc: ['Visit the CIPIE Portal', 'Complete user registration'] },
          {
            title: 'Scheme Selection',
            desc: ['Select International Patent Filing Support (IPFS)'],
          },
          {
            title: 'Document Submission',
            desc: [
              'Submit required supporting documents',
              'Upload Invention Disclosure Form (IDF)',
            ],
          },
          {
            title: 'Initial Review & Patentability Search',
            desc: [
              'CIPIE patent engineer reviews alignment with Electronics & ICT',
              'Patentability search conducted for novelty and inventiveness',
            ],
          },
          {
            title: 'Expert Committee Meeting',
            desc: [
              'Applications presented before the Expert Committee',
              'Applicants may be invited for presentation, if required',
              'Committee recommends applications and identifies internal/empanelled attorney',
              'Minutes of Meeting (MoM) are recorded',
            ],
          },
          {
            title: 'Approval Notification',
            desc: ['Approval letter issued to the applicant'],
          },
          {
            title: 'Patent Filing',
            desc: [
              'Application forwarded to the recommended attorney',
              'Filing executed through CIPIE',
            ],
          },
          {
            title: 'Financial Processing',
            desc: [
              'Attorney raises invoice to C-DAC / CIPIE',
              'Payment released by C-DAC Finance based on Expert Committee MoM',
              'Amount debited under IPFS budget head',
            ],
          },
        ].map((step, index) => (
          <Stack direction="row" spacing={2} key={index} alignItems="baseline">
            <Box
              sx={{
                minWidth: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              {index + 1}
            </Box>

            <Box>
              <Typography fontWeight={600}>{step.title}</Typography>

              {Array.isArray(step.desc) ? (
                <ul>
                  {step.desc.map((item, idx) => (
                    <li key={idx}>
                      {' '}
                      <Typography variant="body2" color="text.secondary">
                        - {item}{' '}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                step.desc
              )}
            </Box>
          </Stack>
        ))}
        <Button
          component={RouterLink}
          to="/auth/jwt/sign-in?returnTo=%2Fdashboard"
          variant="contained"
          size="medium"
          sx={{
            width: 'fit-content',
            // mt: { xs: 2, md: 2 },
            borderRadius: '10px',
            bgcolor: '#0d6efd',
            '&:hover': { bgcolor: '#0d5efd' },
            px: 2,
          }}
        >
          Apply Under Startup Program
        </Button>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3} sx={sx} {...other}>
      <Grid size={{ xs: 12, md: 12 }}>{renderContent()}</Grid>
    </Grid>
  );
}

export function StartupDetailsApplication({ content, sx, ...other }) {
  const renderContent = () => (
    <Card
      sx={{
        p: 3,
        gap: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* <Typography variant="h4">{job?.title}</Typography> */}

      <Stack spacing={3}>      
        <Button
          component={RouterLink}
          to="/auth/jwt/sign-in?returnTo=%2Fdashboard"
          variant="contained"
          size="medium"
          sx={{
            width: 'fit-content',
            // mt: { xs: 2, md: 2 },
            borderRadius: '10px',
            bgcolor: '#0d6efd',
            '&:hover': { bgcolor: '#0d5efd' },
            px: 2,
          }}
        >
          Apply
        </Button>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3} sx={sx} {...other}>
      <Grid size={{ xs: 12, md: 12 }}>{renderContent()}</Grid>
    </Grid>
  );
}
