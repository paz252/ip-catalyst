import { Box, Card, CardContent, Typography, Stack, Grid, Divider } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const OLD_DATA = [
  {
    title: 'Domestic Patents',
    description: 'Patents filed and granted within India',
    items: [
      { label: 'Filed', value: 160, icon: 'solar:document-add-bold', color: 'primary' },
      { label: 'Granted', value: 131, icon: 'solar:check-circle-bold', color: 'success' },
    ],
    footer: 'View all Domestic Patents',
    accent: 'primary',
  },
  {
    title: 'International Patents',
    description: 'Patents filed and granted globally',
    items: [
      { label: 'Filed', value: 65, icon: 'solar:global-bold', color: 'info' },
      { label: 'Granted', value: 60, icon: 'solar:verified-check-bold', color: 'success' },
    ],
    footer: 'View all International Patents',
    accent: 'info',
  },
  {
    title: 'Intellectual Property',
    description: 'Copyrights and trademarks registered',
    items: [
      { label: 'Copyright', value: 529, icon: 'solar:copyright-bold', color: 'warning' },
      { label: 'Trademark', value: 168, icon: 'solar:tag-bold', color: 'secondary' },
    ],
    footer: 'View all IP Assets',
    accent: 'warning',
  },
];

const DATA = [
  {
    title: 'Domestic Patents',
    description: 'Patents filed and granted within India',
    items: [
      { label: 'Filed', value: 160, icon: 'solar:document-add-bold', color: 'warning' },
      { label: 'Granted', value: 131, icon: 'solar:check-circle-bold', color: 'secondary' },
    ],
    footer: 'View all Domestic Patents',
    accent: 'primary',
  },
  {
    title: 'International Patents',
    description: 'Patents filed and granted globally',
    items: [
      { label: 'Filed', value: 65, icon: 'solar:global-bold', color: 'warning' },
      { label: 'Granted', value: 60, icon: 'solar:verified-check-bold', color: 'secondary' },
    ],
    footer: 'View all International Patents',
    accent: 'info',
  },
  {
    title: 'Intellectual Property',
    description: 'Copyrights and trademarks registered',
    items: [
      { label: 'Copyright', value: 529, icon: 'solar:copyright-bold', color: 'warning' },
      { label: 'Trademark', value: 168, icon: 'solar:tag-bold', color: 'secondary' },
    ],
    footer: 'View all IP Assets',
    accent: 'warning',
  },
  {
    title: 'Technology Transfer',
    description: 'Copyrights and trademarks registered',
    items: [
      {
        label: 'Technology Transfer',
        value: 25,
        icon: 'solar:transfer-horizontal-bold',
        color: 'warning',
      },
      {
        label: 'Available Technology',
        value: 234,
        icon: 'tabler:device-desktop-check',
        color: 'secondary',
      },
    ],
    footer: 'View all IP Assets',
    accent: 'warning',
  },
];

const Modified = [
  {
    title: 'Domestic Patents',
    items: [
      { label: 'Filed', value: 160, icon: 'solar:document-add-bold', color: 'warning' },
      { label: 'Granted', value: 131, icon: 'solar:check-circle-bold', color: 'secondary' },
    ],
  },
  {
    title: 'International Patents',
    items: [
      { label: 'Filed', value: 65, icon: 'solar:global-bold', color: 'warning' },
      { label: 'Granted', value: 60, icon: 'solar:verified-check-bold', color: 'secondary' },
    ],
  },
  {
    title: 'Intellectual Property',
    items: [
      { label: 'Copyright', value: 529, icon: 'solar:copyright-bold', color: 'warning' },
      { label: 'Trademark', value: 168, icon: 'solar:tag-bold', color: 'secondary' },
    ],
  },
  {
    title: 'Technology Transfer',
    items: [
      {
        label: 'Technology Transfer',
        value: 25,
        icon: 'solar:transfer-horizontal-bold',
        color: 'warning',
      },
      {
        label: 'Available Technology',
        value: 234,
        icon: 'solar:check-circle-bold',
        color: 'secondary',
      },
    ],
  },
];
export function IPOverviewSection() {
  return (
    <Box
      sx={{
        // py: { xs: 6, md: 10 },
        pb: { xs: 6, md: 6 },
        // background: 'linear-gradient(180deg, #FFF 50%, hsl(210, 100%, 96%) 100%);',
      }}
    >
      {/* Header */}
      <Stack spacing={1} sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700}>
          IP Landscape Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A summary of patents and intellectual property assets driving innovation and progress.
        </Typography>
      </Stack>

      {/* Cards */}
      <Grid container spacing={3} justifyContent="center">
        {DATA.map((section) => (
          <Grid item xs={12} md={4} key={section.title}>
            <Card
              sx={{
                borderRadius: 4,
                height: '100%',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                transition: 'all 0.25s ease',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-6px)',
                },
              }}
            >
              <CardContent>
                {/* Title */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* Items */}
                <Stack spacing={2}>
                  {section.items.map((item) => (
                    <Box
                      // className="hello1234"
                      key={item.label}
                      sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid var(--palette-divider);',
                        // bgcolor: theme.palette[item.color].lighter,
                        background:
                          'linear-gradient(0deg, hsla(210, 100%, 96%, 0.4), hsla(215, 15%, 97%, 0.1))',
                      })}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={(theme) => ({
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // bgcolor: theme.palette[item.color].lighter,
                            //  color: '#fff',
                            bgcolor: 'hsl(210, 100%, 96%)',
                            borderColor: 'hsl(210, 100%, 80%)',
                            boxShadow:
                              '0px 0 0 2px hsla(210, 100%, 45%, 0.1), 0px 2px 12px 0px rgba(234, 237, 241, 0.3) inset',
                          })}
                        >
                          <Iconify
                            icon={item.icon}
                            width={22}
                            sx={(theme) => ({
                              color: 'hsl(210, 100%, 45%)',
                              // color: theme.palette[item.color].main,
                            })}
                          />
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Stack>

                      <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
                    </Box>
                  ))}
                </Stack>

                {/* Footer */}
                {/* <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    {section.footer}
                    <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
                  </Typography>
                </Box> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom banner */}
      {/* <Box
        sx={{
          mt: 6,
          p: 3,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'grey.100',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          These numbers reflect our commitment to innovation, protection and global impact.
        </Typography>

        <Typography
          variant="body2"
          sx={{ fontWeight: 600, cursor: 'pointer', color: 'primary.main' }}
        >
          Explore Insights →
        </Typography>
      </Box> */}
    </Box>
  );
}
