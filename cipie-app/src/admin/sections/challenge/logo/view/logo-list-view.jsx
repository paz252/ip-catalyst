import { sumBy } from 'es-toolkit';
import { useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Alert,
  Tab,
  Tabs,
  Card,
  Table,
  TableCell,
  TableRow,
  TableBody,
  Stack,
  Button,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fIsAfter } from 'src/utils/format-time';

import { useGetLogoList } from 'src/actions/challenge';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { LogoChallengeTableRow } from '../logo-table-row';
import { ApplicationSummary } from '../application-summary';
import { LogoChallengeTableSkeleton } from '../logo-table-skeleton';
import { ApplicationTableToolbar } from '../application-table-toolbar';
import { LogoChallengeTableFiltersResult } from '../logo-table-filters-result';

// ----------------------------------------------------------------------

const APPLICATION_SERVICE_OPTIONS = [
  'PRIOR_ART',
  'TRADEMARK',
  'COPYRIGHT',
  'INDIAN_PATENT_FILING',
  'INTERNATIONAL_PATENT_FILING',
  'USER_QUERY',
];

const TABLE_HEAD = [
  { id: 'logo', label: 'Logo' },
  { id: 'applicant', label: 'Applicant' },
  { id: 'userType', label: 'User Type' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Submitted On' },
  { id: 'action', label: 'Action' },
];

// ----------------------------------------------------------------------

export default function LogoChallengeListPage() {
  const theme = useTheme();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirmDialog = useBoolean();
  // return;

  const { logoList, logoListLoading, logoListError } = useGetLogoList(true);

  const tableData = (logoList || []).map((logo) => ({
    id: logo.id,
    title: logo.title,
    applicant: logo.firstName,
    email: logo.email,
    imagePath: logo.imagePath,
    status: logo.statusName || 'Unknown',
    createdAt: logo.createdAt,
    userType: logo.userType,
  }));
  // const totalRecords = tableData.length;

  const filters = useSetState({
    search: '',
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

  const dataInPage = dataFiltered;

  const canReset =
    !!currentFilters.search ||
    currentFilters.status !== 'all' ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = !logoListLoading && ((!dataFiltered.length && canReset) || !dataFiltered.length);

  const getStatusCount = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalAmount = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      (invoice) => invoice.totalAmount
    );

  const getPercentByStatus = (status) =>
    tableData.length ? (getStatusCount(status) / tableData.length) * 100 : 0;

  const TABS = [
    {
      value: 'all',
      label: 'All',
      color: 'default',
      count: tableData.length,
    },
    {
      value: 'Submitted',
      label: 'Submitted',
      color: 'info',
      count: tableData.filter((x) => x.status === 'Submitted').length,
    },
    {
      value: 'InReview',
      label: 'In Review',
      color: 'warning',
      count: tableData.filter((x) => x.status === 'InReview').length,
    },
    {
      value: 'Shortlisted',
      label: 'Shortlisted',
      color: 'success',
      count: tableData.filter((x) => x.status === 'Shortlisted').length,
    },
    {
      value: 'Winner',
      label: 'Winner',
      color: 'primary',
      count: tableData.filter((x) => x.status === 'Winner').length,
    },
    {
      value: 'Rejected',
      label: 'Rejected',
      color: 'error',
      count: tableData.filter((x) => x.status === 'Rejected').length,
    },
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

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure you want to delete <strong> {table.selected.length} </strong> items?
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
          heading="Logo Challenge List"
          links={[
            { name: 'Dashboard', href: paths.admin.dashboard },
            {
              name: 'Logo Challenge',
              href: paths.admin.challenge.logo.root,
            },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{
                py: 2,
                flexDirection: 'row',
                overflowX: 'auto',
              }}
            >
              <ApplicationSummary
                title="Total"
                total={tableData.length}
                percent={100}
                count={tableData.length}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />

              <ApplicationSummary
                title="Submitted"
                total={getStatusCount('Submitted')}
                percent={getPercentByStatus('Submitted')}
                count={getStatusCount('Submitted')}
                icon="solar:document-add-bold-duotone"
                color={theme.vars.palette.info.main}
              />

              <ApplicationSummary
                title="In Review"
                total={getStatusCount('InReview')}
                percent={getPercentByStatus('InReview')}
                count={getStatusCount('InReview')}
                icon="solar:file-check-bold-duotone"
                color={theme.vars.palette.warning.main}
              />

              <ApplicationSummary
                title="Shortlisted"
                total={getStatusCount('Shortlisted')}
                percent={getPercentByStatus('Shortlisted')}
                count={getStatusCount('Shortlisted')}
                icon="solar:star-bold-duotone"
                color={theme.vars.palette.success.main}
              />

              <ApplicationSummary
                title="Winner"
                total={getStatusCount('Winner')}
                percent={getPercentByStatus('Winner')}
                count={getStatusCount('Winner')}
                icon="solar:cup-star-bold-duotone"
                color={theme.vars.palette.primary.main}
              />

              <ApplicationSummary
                title="Rejected"
                total={getStatusCount('Rejected')}
                percent={getPercentByStatus('Rejected')}
                count={getStatusCount('Rejected')}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.vars.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
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
          </Tabs>

          <ApplicationTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
            options={{ services: APPLICATION_SERVICE_OPTIONS }}
          />

          {canReset && (
            <LogoChallengeTableFiltersResult
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
                  checked
                  // dataFiltered.map((row) => row.id)
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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 900 }}>
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
                  {logoListLoading ? (
                    <LogoChallengeTableSkeleton rows={table.rowsPerPage} />
                  ) : logoListError ? (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length}>
                        <Alert severity="error" sx={{ m: 2 }}>
                          Failed to load logo submissions. Please try again.
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {dataFiltered
                        .slice(
                          table.page * table.rowsPerPage,
                          table.page * table.rowsPerPage + table.rowsPerPage
                        )
                        .map((row) => (
                          <LogoChallengeTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            // detailsHref={`/dashboard/admin/challenge/logo/${row.id}`}
                            detailsHref={paths.admin.challenge.logo.details(row.id)}
                          />
                        ))}

                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                        // emptyRows={0}
                      />

                      <TableNoData notFound={notFound} />
                    </>
                  )}
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
  const { search, status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Search
  if (search) {
    const searchValue = search.toLowerCase();

    inputData = inputData.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchValue) ||
        item.applicant?.toLowerCase().includes(searchValue) ||
        item.email?.toLowerCase().includes(searchValue)
    );
  }

  // Status
  if (status !== 'all') {
    inputData = inputData.filter((item) => item.status === status);
  }

  // Date
  if (!dateError) {
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
