import { Box, Card, Container, Grid, Tab, Tabs } from '@mui/material';

import { IP_FACILITATION_TABS_DETAILS, IP_FACILITATION_TAB_CONTENT } from 'src/_mock/_services';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

export function DomesticIpFilingSupport() {
  const renderOverview = () => (
    <>
      <Box sx={{ display: 'flex', gap: 0.5, mt: 2, flexDirection: 'column' }}>
        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="h2">Patent Filing</Box>
        </Box>
        <Markdown children={IP_FACILITATION_TAB_CONTENT?.PATENT_FILING} />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, mt: 2, flexDirection: 'column' }}>
        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="h2">Copyright Filing</Box>
        </Box>
        <Markdown children={IP_FACILITATION_TAB_CONTENT.COPYRIGHT_FILING} />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, mt: 2, flexDirection: 'column' }}>
        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="h2">Trademark Filing</Box>
        </Box>
        <Markdown children={IP_FACILITATION_TAB_CONTENT.TRADEMARK_FILING} />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, mt: 2, flexDirection: 'column' }}>
        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="h2">Design Filing</Box>
        </Box>
        <Markdown children={IP_FACILITATION_TAB_CONTENT.DESIGN_FILING} />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, mt: 2, flexDirection: 'column' }}>
        <Box
          sx={{
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'body2',
          }}
        >
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="h2">Design Filing</Box>
        </Box>
        <Markdown children={IP_FACILITATION_TAB_CONTENT.SICLDR_FILING} />
      </Box>
    </>
  );

  const renderAbout = () => {
    <Box>
      <Markdown children={IP_FACILITATION_TAB_CONTENT.ABOUT_CONTENT} />
      <Box
        sx={{
          gap: 0.5,
          display: 'flex',
          alignItems: 'center',
          typography: 'body2',
        }}
      >
        <Iconify icon="eva:document-solid-fill" sx={{ color: 'error.main' }} />
        <Box component="span" sx={{ typography: 'subtitle2' }}>
          Required document
        </Box>
      </Box>
    </Box>;
  };

  return (
    <>
      <Container component="section" sx={{ pb: 2, position: 'relative', pt: { xs: 2, md: 5 } }}>
        {renderAbout()}
        {renderOverview()}
      </Container>
    </>
  );
}

function DomesticDetails({ content, sx, ...other }) {
  const renderContent = () => (
    <Card
      sx={{
        p: 3,
        gap: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Markdown children={content} />
    </Card>
  );

  return (
    <Grid container spacing={3} sx={sx} {...other}>
      <Grid size={{ xs: 12, md: 8 }}>{renderContent()}</Grid>
    </Grid>
  );
}
