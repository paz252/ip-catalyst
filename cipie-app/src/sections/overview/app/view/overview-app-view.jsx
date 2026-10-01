// import { useTheme } from '@mui/material/styles';
import { Box, Grid, Button, Avatar, Card, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
// import { SeoIllustration } from 'src/assets/illustrations';
import { useDashboardCounts } from 'src/actions/statistics';
import {
  _appAuthors,
  _appRelated,
  _appFeatured,
  _appInvoices,
  _appInstalled,
  _mock,
} from 'src/_mock';

// import { svgColorClasses } from 'src/components/svg-color';
import { Iconify } from 'src/components/iconify';

import { useAuthContext, useMockedUser } from 'src/auth/hooks';

// import { AppWidget } from '../app-widget';
// import { AppWelcome } from '../app-welcome';
// import { AppFeatured } from '../app-featured';
// import { AppTopAuthors } from '../app-top-authors';
// import { AppTopRelated } from '../app-top-related';
// import { AppNewInvoices } from '../app-new-invoices';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';
// import { AppTopInstalledCountries } from '../app-top-installed-countries';

export function OverviewAppView() {
  // const { user } = useMockedUser();
  const { user } = useAuthContext();
  // console.log(user);
  // const theme = useTheme();

  const { counts, isLoading, errors } = useDashboardCounts();

  // if (isLoading) return <p>Loading dashboard stats...</p>;

  const appFeature = [
    {
      id: 1,
      title: 'IP Commercialization',
      description:
        'Commercially viable IP resources made available to startups for converting ideas into business opportunities.',
      coverUrl: _mock.image.cover(1 + 3),
    },
    {
      id: 2,
      title: 'Technology Handshake',
      description:
        'Facilitating collaboration and partnering breakthroughs on technological innovations.',
      coverUrl: _mock.image.cover(2 + 3),
    },
    {
      id: 3,
      title: 'Bouquet of Services on Offer',
      description:
        'Prior Art Searches, IPR Queries, Landscape Reports, IPR Filing Facilitation etc.',
      coverUrl: _mock.image.cover(3 + 3),
    },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {user?.role === 'ANYNATURALUSER' && (
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                // background: (theme) =>
                //   `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.primary.light} 100%)`,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.primary.main} 35%, ${theme.vars.palette.background.paper} 100%)`,
                color: 'common.white',
              }}
            >
              {/* Decorative circle */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  right: -80,
                  top: -100,
                  bgcolor: 'common.white',
                  opacity: 0.08,
                }}
              />

              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  p: { xs: 3, md: 4 },
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'rgba(255,255,255,0.16)',
                        color: 'common.white',
                      }}
                    >
                      <Iconify icon="solar:palette-2-bold" width={30} />
                    </Avatar>

                    <Box>
                      <Typography
                        variant="overline"
                        sx={{
                          opacity: 0.8,
                          fontWeight: 700,
                          letterSpacing: 1.2,
                        }}
                      >
                        CIPIE Logo Competition
                      </Typography>

                      <Typography
                        variant="h5"
                        sx={{
                          mt: 0.5,
                          fontWeight: 800,
                        }}
                      >
                        Showcase Your Creativity
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          maxWidth: 650,
                          opacity: 0.85,
                          lineHeight: 1.7,
                        }}
                      >
                        Participate in the CIPIE Logo Competition and submit your creative logo
                        design for a chance to have your work selected.
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    component={RouterLink}
                    to={paths.dashboard.challenge.logo.root}
                    variant="contained"
                    endIcon={<Iconify icon="solar:arrow-right-bold" />}
                    sx={{
                      flexShrink: 0,
                      bgcolor: 'common.white',
                      color: 'primary.main',
                      fontWeight: 700,
                      px: 2.5,
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    Participate Now
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
        )}

        {/* <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              // height: { md: 1 },
              //  border: `solid 1px ${theme.vars.palette.grey[800]}`,
            }}
          >
            <Box
              component="img"
              src="/assets/images/dashboard/dashboard.png"
              alt="Dashboard"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 320,
                // objectFit: 'contain',
              }}
            />
          </Box>
        </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
          <AppFeatured list={appFeature} />
        </Grid> */}

        {/* Patents */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Total Patents"
            // percent={3.2}
            total={counts.patents}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [10, 15, 20, 18, 25, 30, 28, 35],
            // }}
          />
        </Grid>
        {/* Copyrights */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Total Copyrights"
            // percent={1.8}
            total={counts.copyrights}
            // chart={{
            //   colors: [theme.palette.info.main],
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [50, 60, 55, 70, 65, 80, 75, 90],
            // }}
          />
        </Grid>
        {/* Trademarks */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AppWidgetSummary
            title="Total Trademarks"
            //  percent={2.4}
            total={counts.trademarks}
            // chart={{
            //   colors: [theme.palette.error.main],
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [5, 10, 8, 15, 12, 18, 20, 22],
            // }}
          />
        </Grid>
        {/* IPR Distribution */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppCurrentDownload
            title="IPR Distribution"
            subheader="By category"
            chart={{
              series: [
                { label: 'Patents', value: counts.patents },
                { label: 'Copyrights', value: counts.copyrights },
                { label: 'Trademarks', value: counts.trademarks },
              ],
            }}
          />
        </Grid>
        {/* IPR Growth */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AppAreaInstalled
            title="IPR Growth Overview"
            subheader="Total applications by type"
            chart={{
              type: 'bar',
              options: {
                chart: {
                  type: 'bar',
                  toolbar: { show: false },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '50%',
                    endingShape: 'rounded',
                  },
                },
                dataLabels: { enabled: true },
                xaxis: {
                  categories: ['Patents', 'Copyrights', 'Trademarks'],
                },
                colors: ['#1976d2', '#0288d1', '#d32f2f'],
              },
              series: [
                {
                  name: 'Applications',
                  data: [counts.patents, counts.copyrights, counts.trademarks],
                },
              ],
            }}
          />
        </Grid>
        {/* New IPR Applications */}
        {/* <Grid size={{ xs: 12, lg: 8 }}>
          <AppNewInvoices
            title="New IPR Applications"
            tableData={[
              { category: 'Patent', count: counts.patents },
              { category: 'Trademark', count: counts.copyrights },
              { category: 'Copyright', count: counts.trademarks },
            ]}
            headCells={[
              { id: 'category', label: 'Category' },
              { id: 'count', label: 'Count' },
            ]}
          />
        </Grid> */}
        {/* Related */}
        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AppTopRelated title="Related IPR Cases" list={_appRelated} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
