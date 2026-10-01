import { Typography, Box, Card, Grid } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

export function StartupDetailsTermsCondition({ content, options, sx, ...other }) {
  // console.log(options);
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

      <Markdown children={content} />

      {/* <Box
        sx={{
          mt: '-30px',
          // rowGap: 2,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
        }}
      >
        {options.map((option) => (
          <Box
            key={option.label}
            sx={{
              display: 'flex',
              gap: 0.5,
              alignItems: { xs: 'center', md: 'baseline' },
              ml: 2,
            }}
          >
            <Iconify
              icon="eva:checkmark-circle-2-outline"
              sx={{
                color: 'primary.main',
              }}
            />
            <Typography> {option.label}</Typography>
          </Box>
        ))}
      </Box> */}
    </Card>
  );

  return (
    <Grid container spacing={3} sx={sx} {...other}>
      <Grid size={{ xs: 12, md: 12 }}>{renderContent()}</Grid>
    </Grid>
  );
}
