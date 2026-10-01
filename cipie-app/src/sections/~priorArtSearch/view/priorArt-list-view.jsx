import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useConfirmNavigate } from 'src/hooks/useConfirmNavigate';

import { fTime, fDate } from 'src/utils/format-time';

import { downloadDocument } from 'src/actions/document';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMyPriorArts, deletePriorArt, submitPriorArt } from 'src/actions/priorArt';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useGlobalLoading } from 'src/components/global-loading';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useToolbarSettings, CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { useAuthContext } from 'src/auth/hooks';
import { SERVICES, hasAccess } from 'src/auth/permissions';

import { ProductItemSkeleton } from '../product-skeleton';
import { ProductTableToolbar } from '../product-table-toolbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Draft', label: 'Draft' },
];

const HIDE_COLUMNS = { category: false };

// ----------------------------------------------------------------------

export function PriorArtListView() {
  const { user } = useAuthContext(); // get current logged-in user
  const userRole = user?.role;

  const confirmDialog = useBoolean();
  const confirmSubmit = useBoolean();
  const toolbarOptions = useToolbarSettings();
  const { myPriorArts, myPriorArtsLoading, myPriorArtsError } = useGetMyPriorArts();
  const { showLoading, hideLoading } = useGlobalLoading();

  // 1. Remove Product hooks, keep your priorArt state
  const [tableData, setTableData] = useState(myPriorArts);
  const [selectedRows, setSelectedRows] = useState({ type: 'include', ids: new Set() });
  const [selectedPatentRow, setSelectedPatentRow] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [rowToSubmit, setRowToSubmit] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const {
    confirmDialog: proceedPatentFiling,
    openConfirm,
    confirmAndNavigate,
  } = useConfirmNavigate();

  const filters = useSetState({
    status: [],
  });

  const canReset = filters.state.status.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: filters.state,
  });

  const onDownloadDocuments = async (applicationId) => {
    try {
      await downloadDocument(applicationId);
      toast.success('Documents downloaded successfully');
    } catch (error) {
      toast.error('Unable to download documents. Please try again.');
    }
  };

  const onDeleteRow = useCallback(async (id) => {
    try {
      await deletePriorArt(id); // 1. Call the .NET Backend

      // 2. Update local UI state
      setTableData((prev) => prev.filter((row) => row.applicationId !== id));

      toast.success('Application and files deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to delete application');
    }
  }, []);

  const handleFinalSubmit = async (applicationId) => {
    try {
      showLoading('Submitting application…');
      await submitPriorArt(applicationId);

      toast.success('Application submitted successfully!');

      confirmSubmit.onFalse();
    } catch (error) {
      console.error(error);
      toast.error('Submission failed.');
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    setTableData(myPriorArts);
  }, [myPriorArts]);

  useEffect(() => {
    const handleScroll = () => {
      // ✅ triggers MUI to close menu like outside click
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3. Update columns to match Prior Art fields
  const columns = useGetColumns({
    onDownloadDocuments,
    onDeleteRow: (id) => {
      setRowToDelete(id);
      confirmDialog.onTrue();
    },
    handleFinalSubmit: (id) => {
      setRowToSubmit(id);
      confirmSubmit.onTrue();
    },
    onOpenPatentDialog: (id) => {
      setSelectedPatentRow(id);
      proceedPatentFiling.onTrue();
    },
  });

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={() => {
        confirmDialog.onFalse();
        setRowToDelete(null);
      }}
      title="Delete"
      content={
        <>
          Are you sure you want to delete this draft? This will permanently remove the application
          and all uploaded documents.
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            if (rowToDelete) {
              onDeleteRow(rowToDelete);
            }
            confirmDialog.onFalse();
          }}
        >
          Delete
        </Button>
      }
    />
  );

  const renderSubmitDialog = () => (
    <ConfirmDialog
      open={confirmSubmit.value}
      onClose={() => {
        confirmSubmit.onFalse();
        setRowToSubmit(null);
      }}
      title="Submit Application"
      content={
        <>
          Are you sure you want to submit this application?
          <br />
          <strong>Once submitted, you will no longer be able to edit or delete this record.</strong>
        </>
      }
      action={
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (rowToSubmit) {
              handleFinalSubmit(rowToSubmit);
            }
            confirmSubmit.onFalse();
          }}
        >
          Confirm & Submit
        </Button>
      }
    />
  );

  const renderProceedPatentFilingDialog = () => {
    const accessIndian = hasAccess(userRole, 'S03'); // Indian Patent
    const accessInternational = hasAccess(userRole, 'S04'); // International Patent

    let contentMessage = 'Choose whether you want to file an Indian or Foreign patent request.';
    if (!accessIndian && !accessInternational) {
      contentMessage = 'You do not have permission to access any patent filing services.';
    } else if (!accessIndian && accessInternational) {
      contentMessage = 'You only have access to Foreign (International) Patent Filing.';
    } else if (accessIndian && !accessInternational) {
      contentMessage = 'You only have access to Indian Patent Filing.';
    }

    return (
      <ConfirmDialog
        open={proceedPatentFiling.value}
        onClose={() => {
          proceedPatentFiling.onFalse();
          setSelectedPatentRow(null);
        }}
        title="Select Patent Type"
        content={<>{contentMessage}</>}
        action={
          <>
            {accessIndian && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  confirmAndNavigate(
                    `${paths.dashboard.indianPatentFiling.new}?priorArtId=${selectedPatentRow}`
                  )
                }
              >
                Indian Patent
              </Button>
            )}

            {accessInternational && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  confirmAndNavigate(
                    `${paths.dashboard.internationalPatentFiling.new}?priorArtId=${selectedPatentRow}`
                  )
                }
              >
                Foreign Patent
              </Button>
            )}
          </>
        }
        slotProps={{
          actions: {
            sx: {
              justifyContent: 'center',
              gap: 1,
              px: 3,
              pb: 2,
            },
          },
        }}
      />
    );
  };

  function PriorArtSkeletonOverlay() {
    return (
      <Box sx={{ width: 1, p: 2 }}>
        <Stack spacing={1}>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductItemSkeleton key={i} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <DashboardContent maxWidth="xl">
        {/* <Box
                    sx={{
                        width: '100%',
                        // height: { xs: 250, md: 450 }, // responsive height
                        borderRadius: 2,
                        overflow: 'hidden', // prevents image spilling
                        position: 'relative',
                    }}
                >
                    <Box
                        component="img"
                        src="/assets/images/prior/priorArt-steps.png"
                        alt="Prior Art Banner"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            // objectFit: 'cover', // makes it fully cover the box without distortion
                            display: 'block',
                            borderRadius: 2
                        }}
                    />
                </Box> */}

        {/* <Box
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        lineHeight: 0, // removes inline image gap
                    }}
                >
                    <Box
                        component="img"
                        src="/assets/images/prior/prior-art-submit.png"
                        alt="Prior Art Banner"
                        sx={{
                            width: '100%',
                            display: 'block',
                            height: 'auto',
                        }}
                    />
                </Box> */}

        <CustomBreadcrumbs
          heading="Prior Art List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Prior Art Search List', href: paths.dashboard.priorArtSearch.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.priorArtSearch.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Prior Art
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            // height: { xs: 800, md: '1px' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            {...toolbarOptions.settings}
            // checkboxSelection
            autoHeight // removes fixed height
            // density="compact" // reduces row height
            disableRowSelectionOnClick
            rows={dataFiltered} // 🔹 Use our fetched data
            columns={columns}
            loading={myPriorArtsLoading} // 🔹 Use local loading state
            getRowId={(row) => row.applicationId} // 🔹 Critical: Tell DataGrid your ID field
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            onRowSelectionModelChange={(newSelection) =>
              setSelectedRows({ type: 'include', ids: new Set(newSelection) })
            }
            slots={{
              noRowsOverlay: () => <EmptyContent title="No Applications Found" />,
              loadingOverlay: PriorArtSkeletonOverlay,
              toolbar: () => (
                <ProductTableToolbar
                  filters={filters}
                  canReset={canReset}
                  filteredResults={dataFiltered.length}
                  selectedRowCount={selectedRows.ids.size}
                  onOpenConfirmDeleteRows={confirmDialog.onTrue}
                  onChangeSettings={toolbarOptions.onChangeSettings}
                  // Simplified options for Prior Art
                  options={{ statuss: STATUS_OPTIONS }}
                />
              ),
            }}
          />
        </Card>
      </DashboardContent>
      {renderConfirmDialog()}
      {renderSubmitDialog()}
      {renderProceedPatentFilingDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

const useGetColumns = ({
  onDeleteRow,
  onDownloadDocuments,
  handleFinalSubmit,
  onOpenPatentDialog,
}) => {
  const theme = useTheme();

  const columns = useMemo(
    () => [
      {
        field: 'srNo', // Field name can be anything unique
        headerName: 'Sr. No.',
        width: 80,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        disableExport: true,
        // headerAlign: 'center',
        align: 'center',
        renderCell: (params) => {
          const allRowIds = params.api.getAllRowIds();
          const index = allRowIds.indexOf(params.id);

          const page = params.api.state.pagination.paginationModel.page || 0;
          const pageSize = params.api.state.pagination.paginationModel.pageSize || 0;

          return page * pageSize + (index % pageSize) + 1;
        },
      },
      {
        field: 'title',
        headerName: 'Prior Art Title',
        flex: 1,
        minWidth: 200,
        hideable: false,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1, width: 1 }}>
            {/* We use an icon instead of a product image */}
            <Iconify
              icon="solar:file-text-bold-duotone"
              width={32}
              sx={{ color: 'primary.main' }}
            />

            <Link
              component={RouterLink}
              href={paths.dashboard.priorArtSearch.details(params.row.applicationId)}
              color="inherit"
              variant="subtitle2"
              noWrap
              sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
                textTransform: 'lowercase', // Forces the rest to be small
                '&::first-letter': {
                  textTransform: 'uppercase', // Forces only the first letter to be Capital
                },
              }}
            >
              {params.row.title}
            </Link>
          </Stack>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
          <Label
            variant="soft"
            color={
              (params.row.status === 'Submitted' && 'info') ||
              (params.row.status === 'Approved' && 'success') ||
              (params.row.status === 'Draft' && 'default') ||
              'warning'
            }
          >
            {params.row.status}
          </Label>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Created at',
        width: 140,
        renderCell: (params) => {
          const date = params.row.createdAt || params.row.CreatedAt;
          return (
            <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
              <span>{fDate(params.row.createdAt)}</span>
              <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                {fTime(params.row.createdAt)}
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'filePatent',
        headerName: 'File Patent',
        width: 120,
        align: 'center', // horizontal
        headerAlign: 'center',
        renderCell: (params) => (
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevents row focus/selection
              onOpenPatentDialog(params.row.applicationId);
            }}
            disabled={params.row.status !== 'Approved'}
          >
            File Patent
          </Button>
        ),
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => [
          <CustomGridActionsCellItem
            showInMenu
            label="View"
            icon={<Iconify icon="solar:eye-bold" />}
            href={paths.dashboard.priorArtSearch.details(params.row.applicationId)}
          />,

          <CustomGridActionsCellItem
            showInMenu
            label="Edit"
            icon={<Iconify icon="solar:pen-bold" />}
            href={paths.dashboard.priorArtSearch.edit(params.row.applicationId)}
            disabled={params.row.status !== 'Draft'}
          />,
          <CustomGridActionsCellItem
            showInMenu
            label="Submit Prior art"
            icon={<Iconify icon="formkit:submit" />}
            onClick={() => {
              handleFinalSubmit(params.row.applicationId);
            }}
            disabled={params.row.status !== 'Draft'}
          />,
          ...(params.row.documents?.length > 0
            ? [
                <CustomGridActionsCellItem
                  key="download"
                  showInMenu
                  label="Download"
                  icon={<Iconify icon="eva:cloud-download-fill" />}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDownloadDocuments(params.row.applicationId);
                  }}
                />,
              ]
            : []),

          <CustomGridActionsCellItem
            showInMenu
            label="Delete"
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => {
              onDeleteRow(params.row.applicationId);
            }}
            style={{ color: theme.vars.palette.error.main }}
            disabled={params.row.status !== 'Draft'}
          />,

          // params.row.status === 'Submitted'
          //     ? (
          //         <CustomGridActionsCellItem
          //             key="patentFiling"
          //             showInMenu
          //             label="Go to Patent Filing"
          //             icon={<Iconify icon="material-symbols:send-outline" />}
          //             href={paths.dashboard.indianPatentFiling.new + `?priorArtId=${params.row.applicationId}`}
          //         />
          //     )
          //     : null,
        ],
      },
    ],
    [onDeleteRow, onDownloadDocuments, theme.vars.palette.error.main]
  );

  return columns;
};
// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { status } = filters;

  let filteredData = [...inputData];

  if (status && status.length > 0) {
    filteredData = filteredData.filter((item) => status.includes(item.status));
  }

  return filteredData;
}
