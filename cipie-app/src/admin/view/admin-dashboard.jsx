import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';

import { useGetDashboardSummary } from 'src/admin/actions/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { ApplicationSummary } from './application-summary';

const serviceLabels = {
  COPYRIGHT: 'Copyright',
  INDIAN_PATENT_FILING: 'Indian Patent Filing',
  INTERNATIONAL_PATENT_FILING: 'International Patent Filing',
  PRIOR_ART: 'Prior Art Search',
  TRADEMARK: 'Trademark',
  USER_QUERY: 'User Query',
};

function SummaryCard({ title, value, color = 'primary.main' }) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          {title}
        </Typography>

        <Typography
          variant="h3"
          fontWeight={700}
          color={color}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const {
    summary,
    summaryLoading,
    summaryError,
  } = useGetDashboardSummary();

  const theme = useTheme();

  if (summaryLoading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  if (summaryError) {
    return (
      <Typography color="error">
        Failed to load dashboard
      </Typography>
    );
  }

   const getPercentByStatus = (statusCount) => (statusCount / summary?.totalApplications) * 100;

  return (
    <Box
      sx={{
        width: '100%',
        px: 3,
        py: 2,
      }}
    >
      {/* Header */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          // background:
          //   'linear-gradient(135deg, #2065D1 0%, #5E9CFF 100%)',
          // color: 'white',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Dashboard
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 1, opacity: 0.9 }}
          >
            Overview of all application activities
          </Typography>
        </CardContent>
      </Card>

      {/* Statistics */}
      {/* <Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(6, 1fr)',
    },
    gap: 3,
    width: '100%',
  }}
>
  <SummaryCard title="Total" value={summary.totalApplications} />
  <SummaryCard title="New" value={summary.submitted} />
  <SummaryCard title="Approved" value={summary.approved} />
  <SummaryCard title="Rejected" value={summary.rejected} />
  <SummaryCard title="Answered" value={summary.answered} />
  <SummaryCard title="Completed" value={summary.completed} />
</Box> */}


      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        <Scrollbar sx={{ minHeight: 108 }}>
          <Stack
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2, flexDirection: 'row' }}
          >
            <ApplicationSummary
              title="Total"
              total={summary?.totalApplications}
              percent={getPercentByStatus(summary?.totalApplications)}
              // price={sumBy(tableData, (invoice) => invoice.totalAmount)}
              count={summary?.totalApplications ?? 0}
              icon="solar:bill-list-bold-duotone"
              color={theme.vars.palette.info.main}
            />

            <ApplicationSummary
              title="Submitted"
              // total={getInvoiceLength('paid')}
              total={summary?.totalApplications}
              percent={getPercentByStatus(summary?.submitted)}
              // price={getTotalAmount('paid')}
              count={summary?.submitted ?? 0}
              icon="solar:file-check-bold-duotone"
              color={theme.vars.palette.success.main}
            />

            <ApplicationSummary
              title="Approved"
              total={summary?.totalApplications}
              percent={getPercentByStatus(summary?.approved)}
              // total={getInvoiceLength('pending')}
              // percent={getPercentByStatus('pending')}
              // price={getTotalAmount('pending')}
              count={summary?.approved ?? 0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.vars.palette.warning.main}
            />

            <ApplicationSummary
              title="Answered"
              total={summary?.totalApplications}
              percent={getPercentByStatus(summary?.answered)}
              // total={getInvoiceLength('overdue')}
              // percent={getPercentByStatus('overdue')}
              // price={getTotalAmount('overdue')}
              count={summary?.answered ?? 0}
              icon="solar:bell-bing-bold-duotone"
              color={theme.vars.palette.error.main}
            />

            <ApplicationSummary
              title="Rejected"
              total={summary?.totalApplications}
              percent={getPercentByStatus(summary?.rejected)}
              // total={getInvoiceLength('draft')}
              // percent={getPercentByStatus('draft')}
              // price={getTotalAmount('draft')}
              count={summary?.rejected ?? 0}
              icon="solar:file-corrupted-bold-duotone"
              color={theme.vars.palette.text.secondary}
            />

            <ApplicationSummary
              title="Completed"
              total={summary?.totalApplications}
              percent={getPercentByStatus(summary?.completed)}
              // total={getInvoiceLength('draft')}
              // percent={getPercentByStatus('draft')}
              // price={getTotalAmount('draft')}
              count={summary?.completed ?? 0}
              icon="solar:file-corrupted-bold-duotone"
              color={theme.vars.palette.text.secondary}
            />
          </Stack>
        </Scrollbar>
      </Card>

      {/* Service Summary */}
      <Card
        sx={{
          mt: 4,
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700}>
            Service Summary
          </Typography>

          <Divider sx={{ my: 2 }} />

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Service</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Submitted</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Approved</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Answered</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {summary.serviceSummaries.map((service) => (
                  <TableRow key={service.serviceCode} hover>
                    <TableCell>
                      <Typography fontWeight={600}>
                        {serviceLabels[service.serviceCode] ??
                          service.serviceCode}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={service.total}
                        color="primary"
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center">
                      {service.submitted}
                    </TableCell>

                    <TableCell align="center">
                      {service.approved}
                    </TableCell>

                    <TableCell align="center">
                      {service.answered}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}