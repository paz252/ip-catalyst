import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { deletePatentHosting, useGetPatentHostings } from 'src/actions/patent-hosting';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomGridActionsCellItem, useToolbarSettings } from 'src/components/custom-data-grid';

import { PatentPublishedDialog } from '../patent-published-dialog';
import { PatentHostingTableToolbar } from '../patent-hosting-table-toolbar';
import { DeletePatentHostingDialog } from '../patent-delete-hosting-dialog';
import {
  RenderCellCreatedAt,
  RenderCellPatents,
  RenderCellPublish,
} from '../patent-hosting-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  {
    value: 'draft',
    label: 'Draft',
    color: 'warning',
  },
  {
    value: 'submitted',
    label: 'Submitted',
    color: 'info',
  },
  {
    value: 'approved',
    label: 'Approved',
    color: 'success',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    color: 'error',
  },
];

const HIDE_COLUMNS = { category: false };
const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function PatentHostingListView() {
  const confirmDialog = useBoolean();
  const deleteDialog = useBoolean();
  const publishedDialog = useBoolean();

  const toolbarOptions = useToolbarSettings();
  const { patentHostings, patentHostingsLoading } = useGetPatentHostings();
  const [tableData, setTableData] = useState(patentHostings);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState({
    type: 'include',
    ids: new Set(),
  });

  const filters = useSetState({
    publish: [],
    stock: [],
  });

  const [selectedPatent, setSelectedPatent] = useState(null);
  const handleDeletePatentHosting = useCallback(async (id, remark = '') => {
    try {
      const response = await deletePatentHosting(id, remark);

      setTableData((prev) => prev.filter((row) => row.id !== id));

      toast.success('Patent hosting deleted successfully', {
        duration: 6000,
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to delete patent hosting', {
        duration: 8000,
      });
    }
  }, []);

  const handleDeleteAction = useCallback(
    (row) => {
      const requiresRemark = row.statusName === 'Published' || row.statusName === 'Rejected';

      if (requiresRemark) {
        setSelectedRow(row);
        deleteDialog.onTrue();
        return;
      }

      handleDeletePatentHosting(row.id);
    },
    [handleDeletePatentHosting]
  );

  const handleDeleteWithRemark = async (remark) => {
    await handleDeletePatentHosting(selectedRow.id, remark);

    deleteDialog.onFalse();
    setSelectedRow(null);
  };

  useEffect(() => {
    setTableData(patentHostings);
  }, [patentHostings]);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: filters.state,
  });

  const handleDeleteRows = useCallback(() => {
    setTableData((prev) => prev.filter((row) => !selectedRows.ids.has(row.id)));
    toast.success('Patent hosting deleted successfully.!', {
      duration: 6000,
    });
  }, [selectedRows.ids]);

  const handleViewPublished = (row) => {
    const patent = {
      id: row.id,
      title: row.title,
      mainTechnologyDomain: row.mainTechnologyDomain,
      techSubDomain: row.techSubDomain,
    };
    // console.log(patent);
    setSelectedPatent(patent);
    publishedDialog.onTrue();
  };

  const columns = useGetColumns({
    onDeleteRow: handleDeleteAction,
    onViewPublished: handleViewPublished,
  });

  // console.log(tableData);
  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content={
        <>
          Are you sure want to delete <strong> {selectedRows.ids.size} </strong> items?
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
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Patent Hostings List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Patent Hostings', href: paths.dashboard.patentHosting.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.patentHosting.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Patent
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: '1px' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            {...toolbarOptions.settings}
            // checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={patentHostingsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRows(newSelectionModel)}
            slots={{
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
              toolbar: () => (
                <PatentHostingTableToolbar
                  filters={filters}
                  canReset={canReset}
                  filteredResults={dataFiltered.length}
                  selectedRowCount={selectedRows.ids.size}
                  onOpenConfirmDeleteRows={confirmDialog.onTrue}
                  options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
                  settings={toolbarOptions.settings}
                  onChangeSettings={toolbarOptions.onChangeSettings}
                />
              ),
            }}
            slotProps={{
              columnsManagement: {
                getTogglableColumns: () =>
                  columns
                    .filter((col) => !HIDE_COLUMNS_TOGGLABLE.includes(col.field))
                    .map((col) => col.field),
              },
            }}
            sx={{
              [`& .${gridClasses.cell}`]: {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        </Card>
      </DashboardContent>

      <DeletePatentHostingDialog
        open={deleteDialog.value}
        onClose={() => {
          deleteDialog.onFalse();
          setSelectedRow(null);
        }}
        onSubmit={handleDeleteWithRemark}
      />
      <PatentPublishedDialog
        open={publishedDialog.value}
        onClose={() => {
          publishedDialog.onFalse();
          setSelectedPatent(null);
        }}
        patent={selectedPatent}
      />
      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

const useGetColumns = ({ onDeleteRow, onViewPublished }) => {
  const theme = useTheme();

  // console.log(paths.dashboard.patentHosting);

  const columns = useMemo(
    () => [
      {
        field: 'category',
        headerName: 'Category',
        filterable: false,
      },
      {
        field: 'title',
        headerName: 'Patent title',
        flex: 1,
        minWidth: 220,
        hideable: false,
        renderCell: (params) => {
          const isInReview = params.row.status === 1;

          return (
            <RenderCellPatents
              params={params.row}
              href={
                isInReview
                  ? paths.dashboard.patentHosting.view(params.row.id)
                  : paths.dashboard.patentHosting.edit(params.row.id)
              }
            />
          );
        },
      },
      {
        field: 'recordNumber',
        headerName: 'Patent number',
        width: 220,
        renderCell: (params) => {
          <Typography>{params.row.recordNumber}</Typography>;
        },
      },
      {
        field: 'createdAt',
        headerName: 'Created at',
        width: 160,
        renderCell: (params) => <RenderCellCreatedAt params={params.row} />,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 250,
        // type: 'singleSelect',
        // filterable: false,
        valueOptions: PUBLISH_OPTIONS,
        renderCell: (params) => (
          <RenderCellPublish params={params.row} onViewPublished={onViewPublished} />
        ),
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: ' ',
        width: 64,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => {
          const status = params.row.status;

          const canEdit = [0, 2, 3].includes(status);
          const canDelete = [0, 2, 3].includes(status);

          return [
            <CustomGridActionsCellItem
              key="view"
              showInMenu
              label="View"
              icon={<Iconify icon="solar:eye-bold" />}
              href={paths.dashboard.patentHosting.view(params.row.id)}
            />,

            ...(canEdit
              ? [
                  <CustomGridActionsCellItem
                    key="edit"
                    showInMenu
                    label="Edit"
                    icon={<Iconify icon="solar:pen-bold" />}
                    href={paths.dashboard.patentHosting.edit(params.row.id)}
                  />,
                ]
              : []),

            ...(canDelete
              ? [
                  <CustomGridActionsCellItem
                    key="delete"
                    showInMenu
                    label="Delete"
                    icon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => onDeleteRow(params.row)}
                    style={{ color: theme.vars.palette.error.main }}
                  />,
                ]
              : []),
          ];
        },
        // getActions: (params) => [
        //   <CustomGridActionsCellItem
        //     showInMenu
        //     label="View"
        //     icon={<Iconify icon="solar:eye-bold" />}
        //     href={paths.dashboard.patentHosting.view(params.row.id)}
        //   />,
        //   <CustomGridActionsCellItem
        //     showInMenu
        //     label="Edit"
        //     icon={<Iconify icon="solar:pen-bold" />}
        //     href={paths.dashboard.patentHosting.edit(params.row.id)}
        //   />,
        //   <CustomGridActionsCellItem
        //     showInMenu
        //     label="Delete"
        //     icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        //     onClick={() => onDeleteRow(params.row.id)}
        //     style={{ color: theme.vars.palette.error.main }}
        //   />,
        // ],
      },
      // {
      //   field: 'domain',
      //   headerName: 'Domain',
      //   flex: 1,
      //   minWidth: 200,
      //   hideable: true,
      //   renderCell: (params) => (
      //     <RenderCellPatents
      //       params={params.row}
      //       // href={paths.dashboard.patentHosting.edit(params.row.id)}
      //     />
      //   ),
      // },
    ],
    [onDeleteRow, onViewPublished, theme.vars.palette.error.main]
  );

  return columns;
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.publish));
  }

  return inputData;
}
