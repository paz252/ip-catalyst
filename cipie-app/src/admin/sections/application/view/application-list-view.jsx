import { sumBy } from 'es-toolkit';
import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';
import { useGetDashboardSummary } from 'src/admin/actions/dashboard';
import { useGetSubmittedApplications } from 'src/admin/actions/application';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ApplicationSummary } from '../application-summary';
import { ApplicationTableRow } from '../application-table-row';
import { ApplicationTableToolbar } from '../application-table-toolbar';
import { ApplicationTableFiltersResult } from '../application-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'applicant', label: 'Applicant' },
  { id: 'serviceCode', label: 'Service' },
  { id: 'status', label: 'Status' },
  // { id: 'organization', label: 'Organization' },
  // { id: 'domain', label: 'Domain' },
  { id: 'createdAt', label: 'Submitted On' },
  { id: 'action', label: 'Action' },
];

const APPLICATION_SERVICE_OPTIONS = [
  'PRIOR_ART',
  'TRADEMARK',
  'COPYRIGHT',
  'INDIAN_PATENT_FILING',
  'INTERNATIONAL_PATENT_FILING',
  'USER_QUERY',
];

const APPLICATION_STATUS_OPTIONS = ['Submitted', 'Approved', 'Answered', 'Rejected', 'Completed'];

// ----------------------------------------------------------------------

export function ApplicationListView() {
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirmDialog = useBoolean();

  // const [tableData, setTableData] = useState(_invoices);

  const { summary } = useGetDashboardSummary();

  const { applications = [] } = useGetSubmittedApplications();

  const tableData = applications.map((app) => ({
    id: app.applicationId,
    applicant: app.fullName,
    email: app.email,
    serviceCode: app.serviceCode,
    status: app.status,
    organization: app.organizationName,
    domain: app.domainCode,
    createdAt: app.createdAt,
  }));

  const filters = useSetState({
    search: '',
    service: 'all',
    status: 'all',
    startDate: null,
    endDate: null,
  });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  // const canReset =
  //   !!currentFilters.name ||
  //   currentFilters.service.length > 0 ||
  //   currentFilters.status !== 'all' ||
  //   (!!currentFilters.startDate && !!currentFilters.endDate);

  const canReset =
    !!currentFilters.search ||
    currentFilters.service !== 'all' ||
    currentFilters.status !== 'all' ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (invoice) => invoice.totalAmount
    );

  const getPercentByStatus = (status) => (getInvoiceLength(status) / tableData.length) * 100;

  // const TABS = [
  //   {
  //     value: 'all',
  //     label: 'All',
  //     color: 'default',
  //     count: tableData.length,
  //   },
  //   {
  //     value: 'Submitted',
  //     label: 'Submitted',
  //     color: 'warning',
  //     count: tableData.filter(x => x.status === 'Submitted').length,
  //   },
  //   {
  //     value: 'Approved',
  //     label: 'Approved',
  //     color: 'success',
  //     count: tableData.filter(x => x.status === 'Approved').length,
  //   },
  //   {
  //     value: 'Answered',
  //     label: 'Answered',
  //     color: 'info',
  //     count: tableData.filter(x => x.status === 'Answered').length,
  //   },
  //   {
  //     value: 'Rejected',
  //     label: 'Rejected',
  //     color: 'error',
  //     count: tableData.filter(x => x.status === 'Rejected').length,
  //   },
  //   {
  //     value: 'Completed',
  //     label: 'Completed',
  //     color: 'success',
  //     count: tableData.filter(x => x.status === 'Completed').length,
  //   },
  // ];

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: tableData.length,
    },
    ...APPLICATION_SERVICE_OPTIONS.map((service) => ({
      value: service,
      label: service
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      color: 'primary',
      count: tableData.filter((item) => item.serviceCode === service).length,
    })),
  ];

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      // setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    // setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  // const handleFilterService = useCallback(
  //   (event, newValue) => {
  //     table.onResetPage();

  //     updateFilters({
  //       service: newValue === 'all' ? [] : [newValue],
  //     });
  //   },
  //   [table, updateFilters]
  // );

  const handleFilterService = useCallback(
    (event, newValue) => {
      table.onResetPage();

      updateFilters({
        service: newValue,
      });
    },
    [table, updateFilters]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {table.selected.length} </strong> items?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent forceFullWidth>
        <CustomBreadcrumbs
          heading="Application List"
          links={[
            { name: 'Dashboard', href: paths.admin.dashboard },
            { name: 'applications', href: paths.admin.list },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2, flexDirection: 'row' }}
            >
              <ApplicationSummary
                title="Total"
                total={tableData.length}
                percent={100}
                // price={sumBy(tableData, (invoice) => invoice.totalAmount)}
                count={summary?.totalApplications ?? 0}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />

              <ApplicationSummary
                title="Submitted"
                total={getInvoiceLength('paid')}
                percent={getPercentByStatus('paid')}
                // price={getTotalAmount('paid')}
                count={summary?.submitted ?? 0}
                icon="solar:file-check-bold-duotone"
                color={theme.vars.palette.success.main}
              />

              <ApplicationSummary
                title="Approved"
                total={getInvoiceLength('pending')}
                percent={getPercentByStatus('pending')}
                // price={getTotalAmount('pending')}
                count={summary?.approved ?? 0}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.vars.palette.warning.main}
              />

              <ApplicationSummary
                title="Answered"
                total={getInvoiceLength('overdue')}
                percent={getPercentByStatus('overdue')}
                // price={getTotalAmount('overdue')}
                count={summary?.answered ?? 0}
                icon="solar:bell-bing-bold-duotone"
                color={theme.vars.palette.error.main}
              />

              <ApplicationSummary
                title="Rejected"
                total={getInvoiceLength('draft')}
                percent={getPercentByStatus('draft')}
                // price={getTotalAmount('draft')}
                count={summary?.rejected ?? 0}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.vars.palette.text.secondary}
              />

              <ApplicationSummary
                title="Completed"
                total={getInvoiceLength('draft')}
                percent={getPercentByStatus('draft')}
                // price={getTotalAmount('draft')}
                count={summary?.completed ?? 0}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.vars.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          {/* <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={{
              px: { md: 2.5 },
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <Tabs
            // value={currentFilters.service.length ? currentFilters.service[0] : 'all'}
            value={currentFilters.service}
            onChange={handleFilterService}
            sx={{
              px: { md: 2.5 },
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(
                theme.vars.palette.grey['500Channel'],
                0.08
              )}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    // variant={
                    //   (
                    //     ab.value === 'all' && currentFilters.service.length === 0) ||
                    //     currentFilters.service.includes(tab.value)
                    //     ? 'filled'
                    //     : 'soft'
                    // }
                    variant={tab.value === currentFilters.service ? 'filled' : 'soft'}
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <ApplicationTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ statuses: APPLICATION_STATUS_OPTIONS }}
            // options={{ services: APPLICATION_SERVICE_OPTIONS.map((option) => option.name) }}
          />

          {canReset && (
            <ApplicationTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                );
              }}
              action={
                <Box sx={{ display: 'flex' }}>
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="custom:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="solar:download-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirmDialog.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     dataFiltered.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <ApplicationTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        // editHref={paths.dashboard.invoice.edit(row.id)}
                        detailsHref={`/dashboard/admin/applications/${row.id}`}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { search, service, status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData.filter(({ invoiceNumber, invoiceTo }) =>
  //     [invoiceNumber, invoiceTo.name, invoiceTo.company, invoiceTo.phoneNumber].some((field) =>
  //       field?.toLowerCase().includes(name.toLowerCase())
  //     )
  //   );
  // }

  if (filters.search) {
    inputData = inputData.filter(
      (item) =>
        item.applicant?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.organization?.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  if (filters.status !== 'all') {
    inputData = inputData.filter((item) => item.status === filters.status);
  }

  if (filters.service !== 'all') {
    inputData = inputData.filter((item) => item.serviceCode === filters.service);
  }

  // if (service.length) {
  //   inputData = inputData.filter((invoice) =>
  //     invoice.items.some((filterItem) => service.includes(filterItem.service))
  //   );
  // }

  // if (service.length) {
  //   inputData = inputData.filter((item) =>
  //     service.includes(item.serviceCode)
  //   );
  // }

  if (!dateError) {
    // if (startDate && endDate) {
    //   inputData = inputData.filter((invoice) => fIsBetween(invoice.createDate, startDate, endDate));
    // }

    if (startDate) {
      inputData = inputData.filter((item) => new Date(item.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      inputData = inputData.filter((item) => new Date(item.createdAt) <= end);
    }
  }

  return inputData;
}
