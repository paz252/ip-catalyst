import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fTime, fDate } from 'src/utils/format-time';

import { downloadDocument } from 'src/actions/document';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetMyQueries, submitQuery } from 'src/actions/userQueries';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useToolbarSettings, CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { ProductItemSkeleton } from '../product-skeleton';
import { ProductTableToolbar } from '../product-table-toolbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
    { value: 'Submitted', label: 'Submitted' },
    { value: 'Draft', label: 'Draft' },
];

// ----------------------------------------------------------------------

export function QueryListView() {
    const confirmDialog = useBoolean();
    const confirmSubmit = useBoolean();
    const toolbarOptions = useToolbarSettings();
    const { queries, queriesLoading, queriesError, refetchQueries } = useGetMyQueries();

    const [tableData, setTableData] = useState(queries);
    const [searchText, setSearchText] = useState('');
    const [selectedRows, setSelectedRows] = useState({ type: 'include', ids: new Set() });
    const [rowToDelete, setRowToDelete] = useState(null);
    const [rowToSubmit, setRowToSubmit] = useState(null);

    const filters = useSetState({
        status: [],
    });

    const canReset = filters.state.status.length > 0;

    const dataFiltered = applyFilter({
        inputData: tableData,
        filters: filters.state,
        // quickFilterValue: searchText,
    });


    const onDownloadDocuments = async (applicationId) => {
        try {
            console.log("On Downoload documnet", applicationId)
            await downloadDocument(applicationId)
            toast.success('Download started successfully');
        } catch (error) {
            toast.error('Failed to download Trademark documents');
        }
    }

    const onDeleteRow = useCallback(async (id) => {
        try {
            // await deleteTrademark(id); // 1. Call the .NET Backend

            // 2. Update local UI state
            // setTableData((prev) => prev.filter((row) => row.applicationId !== id));

            toast.success('Application and files deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to delete application');
        }
    }, []);

    const handleFinalSubmit = async (applicationId) => {
        try {
            // 1. Call your 'Submit' endpoint (the one that sets status to 'Submitted')
            // Usually, this is a separate endpoint or an update call with status change.
            await submitQuery(applicationId);

            toast.success('Application submitted successfully!');

            const freshData = await refetchQueries();
            setTableData(freshData);
            confirmSubmit.onFalse();
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit application');
        }
    };

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
        }
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
                    Are you sure you want to delete this draft? This will permanently remove the application and all uploaded documents.
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
                <Button variant="contained" color="primary"
                    onClick={() => {
                        if (rowToSubmit) {
                            handleFinalSubmit(rowToSubmit);
                        }
                        confirmSubmit.onFalse();
                    }}>
                    Confirm & Submit
                </Button>
            }
        />
    );

    useEffect(() => {
        setTableData(queries);
    }, [queries]);

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

    return (
        <>
            <DashboardContent maxWidth="xl">
                <CustomBreadcrumbs
                    heading="Query List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Query', href: paths.dashboard.userQuery.root },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.userQuery.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            Add Query
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                {queriesLoading && <ProductItemSkeleton />}

                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                    <DataGrid
                        {...toolbarOptions.settings}
                        // checkboxSelection
                        autoHeight
                        disableRowSelectionOnClick
                        rows={dataFiltered}
                        columns={columns}
                        loading={queriesLoading}
                        getRowId={(row) => row.applicationId}
                        pageSizeOptions={[10, 25, 50]}
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                        onRowSelectionModelChange={(newSelection) => setSelectedRows({ type: 'include', ids: new Set(newSelection) })}
                        slots={{
                            noRowsOverlay: () => <EmptyContent title="No Applications Found" />,
                            toolbar: () => (
                                <ProductTableToolbar
                                    filters={filters}
                                    canReset={canReset}
                                    filteredResults={dataFiltered.length}
                                    selectedRowCount={selectedRows.ids.size}
                                    onOpenConfirmDeleteRows={confirmDialog.onTrue}
                                    onChangeSettings={toolbarOptions.onChangeSettings}
                                    // Simplified options for Trademark
                                    options={{ statuss: STATUS_OPTIONS }}
                                />
                            ),
                        }}
                    />
                </Card>
            </DashboardContent>
            {renderConfirmDialog()}
            {renderSubmitDialog()}
        </>
    );
}

// ----------------------------------------------------------------------

const useGetColumns = ({ onDeleteRow, onDownloadDocuments, handleFinalSubmit }) => {
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

                    return page * pageSize + index % pageSize + 1;
                },
            },
            {
                field: 'message',
                headerName: 'Query',
                flex: 1,
                minWidth: 300,
                hideable: false,
                renderCell: (params) => (
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1, width: 1 }}>
                        <Iconify icon="solar:file-text-bold-duotone" width={32} sx={{ color: 'primary.main' }} />
                        <Link
                            component={RouterLink}
                            href={paths.dashboard.userQuery.details(params.row.applicationId)}
                            color="inherit"
                            variant="subtitle2"
                            noWrap
                            sx={{
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' },
                                textTransform: 'lowercase',
                                '&::first-letter': {
                                    textTransform: 'uppercase',
                                },
                            }}

                        >
                            {params.row.message}
                        </Link>
                    </Stack>
                ),
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 140,
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
                width: 160,
                renderCell: (params) => {
                    const date = params.row.createdAt || params.row.CreatedAt;
                    return (
                        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
                            <span> <span> {fDate(params.row.createdAt)} {fTime(params.row.createdAt)}</span></span>
                        </Box>
                    );
                },
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
                        href={paths.dashboard.userQuery.details(params.row.applicationId)}
                    />,
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
        filteredData = filteredData.filter((item) =>
            status.includes(item.status)
        );
    }

    return filteredData;
}
