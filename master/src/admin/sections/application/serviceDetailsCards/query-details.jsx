import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

export function QueryDetailsCard({ application }) {
    if (!application) return null;

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                User Query Details
            </Typography>
            <Divider sx={{ my: 3 }} />

            <Stack spacing={3}>
                <InfoBlock
                    title="Query"
                    value={application.message}
                />

                {application.adminReply && (
                    <>
                    <InfoBlock
                    title="Reply"
                    value={application.adminReply}
                />
                <InfoBlock
                    title="Reply At"
                    value={new Date(application.repliedAt).toLocaleString()}
                />
                    </>
                )}
                
            </Stack>
        </Card>
    );
}

function InfoRow({ label, value }) {
    return (
        <Stack direction="row" spacing={2}>
            <Typography
                variant="subtitle2"
                sx={{ minWidth: 140 }}
            >
                {label}
            </Typography>

             <Label color={
              (value === 'Submitted' && 'warning') ||
              (value === 'Approved' && 'success') ||
              (value === 'Answered' && 'info') ||
              (value === 'Rejected' && 'error') ||
              'default'
            }
            variant="soft"
            >
        {value || '-'}
      </Label>
        </Stack>
    );
}

function InfoBlock({ title, value }) {
    return (
        <Stack spacing={1}>
            <Typography variant="subtitle1">
                {title}
            </Typography>

            <Typography color="text.secondary">
                {value || '-'}
            </Typography>
        </Stack>
    );
}