import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';

import { Chart, useChart } from 'src/components/chart';
import { ChartLegends } from 'src/components/chart/components/custom-chart-legends';

// ----------------------------------------------------------------------

export function PatentSubDomainsChart({
  title,
  subheader,
  chart,
  subDomains,
  domain,
  sx,
  ...other
}) {
  // console.log(chart?.series);
  const theme = useTheme();
  const navigate = useNavigate();

  const chartColors = chart.colors ?? [
    theme.palette.secondary.dark,
    theme.palette.error.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.dark,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.dark,
  ];

  const chartSeries = chart.series.map((item) => item.value);

  const chartOptions = useChart({
    chart: { offsetY: 12 },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 1, colors: [theme.palette.background.paper] },
    fill: { opacity: 0.88 },
    tooltip: { y: { formatter: (value) => value } },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart.options,
  });

  const labelToSlugMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(subDomains).map(([slug, label]) => [label.toLowerCase(), slug])
      ),
    [subDomains]
  );

  const isAllTechnologies = domain === 'all-technologies';

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          pt: 4,
          pb: 3,
          rowGap: 3,
          columnGap: 5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Chart
          type="polarArea"
          series={chartSeries}
          options={chartOptions}
          slotProps={{ loading: { p: 3 } }}
          sx={{ width: { xs: 240, md: 380 }, height: { xs: 240, md: 380 } }}
        />

        <ChartLegends
          colors={chartOptions?.colors}
          labels={chartOptions?.labels}
          icons={chart.icons}
          sublabels={chart.series.map((item) => item.value)}
          onItemClick={
            !isAllTechnologies
              ? (label) => {
                  const slug = labelToSlugMap[label.toLowerCase()];

                  if (slug) {
                    navigate(paths.innovationApplication.category(domain, slug));
                  }
                }
              : undefined
          }
          sx={{
            gap: 2.5,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        />
      </Box>

      {/* <Divider sx={{ borderStyle: 'dashed' }} />
      <Box
        sx={{
          display: 'grid',
          typography: 'h4',
          textAlign: 'center',
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Box sx={{ py: 2, borderRight: `dashed 1px ${theme.vars.palette.divider}` }}>
          <Box sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Categories</Box>9
        </Box>

        <Box sx={{ py: 2 }}>
          <Box sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Categories</Box>
          $18,765
        </Box>
      </Box> */}
    </Card>
  );
}
