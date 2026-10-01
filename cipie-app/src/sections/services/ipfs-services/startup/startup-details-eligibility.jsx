import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

export function StartupDetailsEligibility({ content, sx, ...other }) {
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

      {/* <Stack spacing={2}>
        <Typography variant="h6">Skills</Typography>
        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
          {job?.skills.map((skill) => (
            <Chip key={skill} label={skill} variant="soft" />
          ))}
        </Box>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Benefits</Typography>
        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
          {job?.benefits.map((benefit) => (
            <Chip key={benefit} label={benefit} variant="soft" />
          ))}
        </Box>
      </Stack> */}
    </Card>
  );

  return (
    <Grid container spacing={3} sx={sx} {...other}>
      <Grid size={{ xs: 12, md: 12 }}>{renderContent()}</Grid>
    </Grid>
  );
}
