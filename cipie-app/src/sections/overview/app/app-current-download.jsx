
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AppCurrentDownload({ title, subheader, chart, sx, ...other }) {
  const theme = useTheme();

  // Use provided colors or default theme colors
  // const chartColors = chart?.colors ?? [
  //   theme.palette.primary.lighter,
  //   theme.palette.primary.light,
  //   theme.palette.primary.main,
  //   theme.palette.primary.dark,
  // ];

 const chartSeries = Array.isArray(chart?.series)
  ? chart.series.map((item) => item.value ?? 0)
  : [];

const chartLabels = Array.isArray(chart?.series)
  ? chart.series.map((item) => item.label ?? '')
  : [];

const chartColors = Array.isArray(chart?.colors) && chart.colors.length > 0
  ? chart.colors
  : [
      theme.palette.primary.lighter,
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.primary.dark,
    ];

const chartOptions = useChart({
  chart: { sparkline: { enabled: true } },
  colors: chartColors,
  labels: chartLabels,
  stroke: { width: 0 },
  tooltip: {
    y: {
      formatter: (value) => fNumber(value),
      title: { formatter: (seriesName) => `${seriesName}` },
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
        labels: {
          value: { formatter: (value) => fNumber(value) },
          total: {
            formatter: (w) => {
              const sum = w.globals.seriesTotals?.reduce((a, b) => a + b, 0) ?? 0;
              return fNumber(sum);
            },
          },
        },
      },
    },
  },
  ...chart?.options,
});

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="donut"
        series={chartSeries}
        options={chartOptions}
        sx={{
          my: 6,
          mx: 'auto',
          width: { xs: 240, xl: 260 },
          height: { xs: 240, xl: 260 },
        }}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: 'center' }}
      />
    </Card>
  );
}