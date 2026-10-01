import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, Card, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { deleteLogo, useGetLogoList } from 'src/actions/challenge';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomGridActionsCellItem, useToolbarSettings } from 'src/components/custom-data-grid';

import { DeleteLogoDialog } from '../logo/logo-delete-dialog';
import { LogoTableToolbar } from '../logo/logo-table-toolbar';
import { RenderCellCreatedAt, RenderCell, RenderCellPublish } from '../logo/logo-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  {
    value: 'Submitted',
    label: 'Submitted',
    color: 'info',
  },
  {
    value: 'Shortlisted',
    label: 'Shortlisted',
    color: 'success',
  },
  {
    value: 'In Review',
    label: 'In Review',
    color: 'warning',
  },

  {
    value: 'Winner',
    label: 'Winner',
    color: 'primary',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    color: 'error',
  },
];

const HIDE_COLUMNS = { category: false };
const HIDE_COLUMNS_TOGGABLE = ['category', 'actions'];

// ----------------------------------------------------------------------
export function LogoListView() {
  const confirmDialog = useBoolean();
  const deleteDialog = useBoolean();
  const router = useRouter();

  const toolbarOptions = useToolbarSettings();
  const { logoList, logoListLoading } = useGetLogoList();

  const [tableData, setTableData] = useState(logoList);
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

  // ----------------------------------------------------------------------

  const handleDeleteLogo = useCallback(async (id, remark = '') => {
    try {
      await deleteLogo(id, remark);

      setTableData((prev) => prev.filter((row) => row.id !== id));

      toast.success('Logo deleted successfully', {
        duration: 6000,
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || 'Failed to delete logo', {
        duration: 8000,
      });
    }
  }, []);

  // ----------------------------------------------------------------------

  const handleDeleteAction = useCallback(
    (row) => {
      const requiresRemark = ['Submitted', 'Rejected'].includes(row.statusName);

      if (requiresRemark) {
        setSelectedRow(row);
        deleteDialog.onTrue();
        return;
      }

      handleDeleteLogo(row.id);
    },
    [handleDeleteLogo]
  );

  // ----------------------------------------------------------------------

  const handleDeleteWithRemark = async (remark) => {
    await handleDeleteLogo(selectedRow.id, remark);

    deleteDialog.onFalse();
    setSelectedRow(null);
  };

  // ----------------------------------------------------------------------

  useEffect(() => {
    setTableData(logoList);
  }, [logoList]);

  // ----------------------------------------------------------------------

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: filters.state,
  });

  // ----------------------------------------------------------------------

  const handleDeleteRows = useCallback(() => {
    setTableData((prev) => prev.filter((row) => !selectedRows.ids.has(row.id)));

    toast.success('Logo deleted successfully!', {
      duration: 6000,
    });
  }, [selectedRows.ids]);

  // ----------------------------------------------------------------------

  const columns = useGetColumns({
    onDeleteRow: handleDeleteAction,
  });

  // ----------------------------------------------------------------------

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete Logos"
      content={
        <>
          Are you sure you want to delete <strong>{selectedRows.ids.size}</strong> selected logo
          {selectedRows.ids.size > 1 ? 's' : ''}?
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

  // ----------------------------------------------------------------------

  return (
    <>
      <DashboardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* -------------------------------------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------------------------------------- */}

        <CustomBreadcrumbs
          heading="Logo Challenge List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Logo Challenge',
              href: paths.dashboard.challenge.logo.root,
            },
            {
              name: 'My Logos',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.challenge.logo.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{
                px: 2.5,
                borderRadius: 1.5,
              }}
            >
              Add Logo
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 4 },
          }}
        />

        {/* -------------------------------------------------------------- */}
        {/* INTRO CARD */}
        {/* -------------------------------------------------------------- */}

        <Card
          sx={{
            mb: 3,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            p: { xs: 2.5, md: 3.5 },
            border: '1px solid',
            borderColor: 'divider',
            // background: (theme) =>
            //   `linear-gradient(
            //   135deg,
            //   ${theme.vars.palette.background.paper} 0%,
            //   ${theme.vars.palette.primary.light} 500%
            // )`,
            boxShadow: (theme) => theme.customShadows?.z8,
          }}
        >
          {/* Decorative background */}
          {/* <Box
            sx={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              right: -80,
              top: -100,
              background: (theme) => theme.vars.palette.primary.main,
              opacity: 0.06,
              filter: 'blur(2px)',
            }}
          /> */}

          {/* <Box
            sx={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              right: 80,
              bottom: -80,
              background: (theme) => theme.vars.palette.secondary.main,
              opacity: 0.05,
            }}
          /> */}

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* Left content */}
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                  }}
                >
                  <Iconify icon="solar:palette-round-bold-duotone" width={25} />
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Your Logo Submissions
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Logo Challenge
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 650,
                  mt: 1.5,
                  lineHeight: 1.7,
                }}
              >
                Create, manage and track the logos you have submitted for the Logo Challenge. View
                your submissions and monitor their status from here.
              </Typography>
            </Box>

            {/* Submission count */}
            <Box
              sx={{
                minWidth: { md: 170 },
                px: 2.5,
                py: 1.5,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: (theme) => theme.customShadows?.z4,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  flexShrink: 0,
                }}
              >
                <Iconify icon="solar:documents-bold-duotone" width={22} />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Submissions
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  {tableData.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* -------------------------------------------------------------- */}
        {/* TABLE */}
        {/* -------------------------------------------------------------- */}

        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: '1px' },
            flexDirection: { md: 'column' },
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          <DataGrid
            {...toolbarOptions.settings}
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={logoListLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: 'All' }]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRows(newSelectionModel)}
            slots={{
              noRowsOverlay: () => (
                <EmptyLogoContent
                  onAddLogo={() => router.push(paths.dashboard.challenge.logo.new)}
                />
              ),

              noResultsOverlay: () => <EmptyContent title="No logos found" />,

              toolbar: () => (
                <LogoTableToolbar
                  filters={filters}
                  canReset={canReset}
                  filteredResults={dataFiltered.length}
                  selectedRowCount={selectedRows.ids.size}
                  onOpenConfirmDeleteRows={confirmDialog.onTrue}
                  options={{
                    stocks: PRODUCT_STOCK_OPTIONS,
                    publishs: PUBLISH_OPTIONS,
                  }}
                  settings={toolbarOptions.settings}
                  onChangeSettings={toolbarOptions.onChangeSettings}
                />
              ),
            }}
            slotProps={{
              columnsManagement: {
                getTogglableColumns: () =>
                  columns
                    .filter((col) => !HIDE_COLUMNS_TOGGABLE.includes(col.field))
                    .map((col) => col.field),
              },
            }}
            sx={{
              border: 0,

              [`& .${gridClasses.cell}`]: {
                display: 'flex',
                alignItems: 'center',
              },

              [`& .${gridClasses.columnHeaders}`]: {
                bgcolor: 'background.neutral',
              },

              [`& .${gridClasses.row}`]: {
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              },
            }}
          />
        </Card>
      </DashboardContent>

      {/* -------------------------------------------------------------- */}
      {/* DELETE DIALOG */}
      {/* -------------------------------------------------------------- */}

      <DeleteLogoDialog
        open={deleteDialog.value}
        onClose={() => {
          deleteDialog.onFalse();
          setSelectedRow(null);
        }}
        onSubmit={handleDeleteWithRemark}
      />

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

const useGetColumns = ({ onDeleteRow }) => {
  const theme = useTheme();

  const columns = useMemo(
    () => [
      {
        field: 'category',
        headerName: 'Category',
        filterable: false,
      },
      {
        field: 'title',
        headerName: 'Logo',
        flex: 1,
        minWidth: 220,
        hideable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1,
              minWidth: 0,
              width: '100%',
            }}
          >
            <Box
              component="img"
              src={`${CONFIG.challenge.logo}${params.row.imagePath}`}
              alt={params.row.title}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                borderRadius: 2,
                flexShrink: 0,
                // border: '1px solid',
                // borderColor: 'divider',
                // bgcolor: 'background.neutral',
                // p: 0.5,
              }}
            />
            <RenderCell
              params={params.row}
              href={paths.dashboard.challenge.logo.details(params.row.id)}
            />
            {/* <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                component={RouterLink}
                href={paths.dashboard.challenge.logo.details(params.row.id)}
              >
                {params.row.title}
              </Typography>
            </Box> */}
          </Box>
        ),
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
        width: 200,
        valueOptions: PUBLISH_OPTIONS,
        renderCell: (params) => <RenderCellPublish params={params.row} />,
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: ' ',
        width: 50,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => {
          const status = params.row.status;

          const canDelete = [0, 4].includes(status);

          return [
            <CustomGridActionsCellItem
              key="view"
              showInMenu
              label="View"
              icon={<Iconify icon="solar:eye-bold" />}
              href={paths.dashboard.challenge.logo.details(params.row.id)}
            />,

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
      },
    ],
    [onDeleteRow, theme.vars.palette.error.main]
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

function EmptyLogoContent({ onAddLogo }) {
  return (
    <Box
      sx={{
        height: '100%',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            mb: 2,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.lighter',
            color: 'primary.main',
          }}
        >
          <Iconify icon="solar:palette-round-bold-duotone" width={38} />
        </Box>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Create your first logo
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360 }}>
          You haven&apos;t submitted any logos yet. Create your first design and submit it to the
          Logo Challenge.
        </Typography>

        {/* <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={onAddLogo}
        >
          Add New Logo
        </Button> */}
        <Button
          component={RouterLink}
          href={paths.dashboard.challenge.logo.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{
            px: 2.5,
            borderRadius: 1.5,
          }}
        >
          Add Logo
        </Button>
      </Box>
    </Box>
  );
}
