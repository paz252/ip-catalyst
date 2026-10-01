
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AppAreaInstalled({ title, subheader, chart, sx, ...other }) {
  const theme = useTheme();

  // ✅ FIX: set default to first series instead of hardcoded '2023'
  const [selectedSeries, setSelectedSeries] = useState(
    chart.series?.[0]?.name || ''
  );

  // Fallback chart colors
  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  // ApexChart options
  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: { y: { formatter: (value) => fNumber(value) } },
    plotOptions: { bar: { columnWidth: '40%' } },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);

  // Get currently selected series
  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  return (
    <Card sx={sx} {...other}>
      {/* Header with dropdown */}
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      {/* Legends */}
      <ChartLegends
        colors={chartOptions?.colors}
        labels={chart.categories}
        values={
          currentSeries?.data
            ? currentSeries.data.map((val) => fShortenNumber(val))
            : []
        }
        sx={{ px: 3, gap: 3 }}
      />

      {/* Chart */}
      <Chart
        key={selectedSeries}
        type="bar"
        series={
          currentSeries
            ? [{ name: currentSeries.name, data: currentSeries.data }]
            : []
        }
        options={chartOptions}
        slotProps={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 320,
        }}
      />
    </Card>
  );
}