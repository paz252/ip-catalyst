import { Button, Box, Card, Grid, Stack, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export function MeityDetailsApplication({ content, sx, ...other }) {
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
        {/* {[
          { title: 'Registration', desc: 'Register on the CIPIE Portal' },
          {
            title: 'Document Submission',
            desc: ['Submit supporting documents and Invention Disclosure Form'],
          },
          {
            title: 'Initial Review & Patentability Search',
            desc: ['Technical and patentability evaluation by CIPIE'],
          },
          {
            title: 'Expert Committee Recommendation',
            desc: ['Evaluation by Expert Committee Recommendation'],
          },
          {
            title: 'Patent Filing',
            desc: [
              'Application forwarded to the recommended attorney.',
              'Filing executed through CIPIE',
            ],
          },
          {
            title: 'Financial Disbursement',
            desc: ['C-DAC Finance verifies bills and releases funds accordingly'],
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
              <Typography variant="body2" component="div" color="text.secondary">
                {Array.isArray(step.desc) ? (
                  <ul>
                    {step.desc.map((item, idx) => (
                      <li key={idx}>- {item}</li>
                    ))}
                  </ul>
                ) : (
                  step.desc
                )}
              </Typography>
            </Box>
          </Stack>
        ))} */}
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
