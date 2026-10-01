import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

export function DomesticDetailsInfo({ content, sx, ...other }) {
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

      <Markdown children={content} />
    </Card>
  );

  return (
    <Grid container spacing={3} sx={sx} {...other}>
      <Grid size={{ xs: 12, md: 12 }}>{renderContent()}</Grid>
    </Grid>
  );
}
