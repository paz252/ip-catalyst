import { Button, Card, Grid } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

export function DomesticDetailsApplication({ content, sx, ...other }) {
  const renderContent = () => (
    <Card
      sx={{
        p: 3,
        gap: 3,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {/* <Typography variant="h4">{job?.title}</Typography> */}

      {/* <Markdown children={content} /> */}
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
    </Card>
  );

  return (
    <Grid container spacing={3} sx={sx} {...other}>
      <Grid size={{ xs: 12, md: 12 }}>{renderContent()}</Grid>
    </Grid>
  );
}
