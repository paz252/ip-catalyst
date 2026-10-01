import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time'; // Assuming you have a time formatter

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PriorArtItem({ application, detailsHref }) {
    const {
        applicationId,
        title,
        status,
        serviceCode,
        createdAt,
        createdByUserId
    } = application;

    // Helper to determine label color based on status
    const getStatusColor = (currentStatus) => { // ✅ Unique parameter name
        if (currentStatus === 'Submitted') return 'info';
        if (currentStatus === 'Draft') return 'default';
        if (currentStatus === 'Approved') return 'success';
        if (currentStatus === 'Rejected') return 'error';
        return 'warning';
    };

    const renderLabels = () => (
        <Box
            sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                position: 'absolute',
            }}
        >
            <Label variant="filled" color={getStatusColor(status)}>
                {status}
            </Label>
        </Box>
    );

    const renderContent = () => (
        <Stack spacing={2} sx={{ p: 3 }}>
            {/* Service Code & ID */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    {serviceCode}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    ID: {applicationId.slice(0, 8)}...
                </Typography>
            </Stack>

            {/* Application Title */}
            <Link
                component={RouterLink}
                href={detailsHref}
                color="inherit"
                variant="subtitle1"
                noWrap
                sx={{ fontWeight: 'bold' }}
            >
                {title}
            </Link>

            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ typography: 'body2', color: 'text.secondary' }}>
                <Iconify icon="solar:calendar-date-bold" width={18} />
                {fDateTime(createdAt)}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ typography: 'body2', color: 'text.secondary' }}>
                <Iconify icon="solar:user-bold" width={18} />
                User: {createdByUserId.slice(0, 4)}...
            </Stack>
        </Stack>
    );

    return (
        <Card sx={{ position: 'relative' }}>
            {renderLabels()}
            {/* We removed renderImage since Prior Art is usually text-heavy */}
            <Box sx={{ pt: 2 }} />
            {renderContent()}
        </Card>
    );
}