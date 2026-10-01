import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

export function TrademarkDetailsCard({ application }) {
    if (!application) return null;

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Trademark Details
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={3}>
                <InfoBlock
                    title="Trademark Name"
                    value={application.problemStatement}
                />

                <InfoBlock
                    label="Description"
                    value={application.description}
                />
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 3 }}>
                Organizations
            </Typography>

            <Stack spacing={3}>
                {application.organizations?.map((org, index) => (
                    <InfoBlock
                        kay={index}
                        title={`Organization ${index + 1}`}
                        value={org.organizationName}
                    />
                ))}
            </Stack>

             <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 3 }}>
                Inventors
            </Typography>

            <Stack spacing={3}>
                {application.inventors?.map((inv, index) => (
                    <InfoBlock
                        kay={index}
                        title={`Inventor  ${index + 1}`}
                        value={`${inv.firstName} ${inv.lastName}`}
                    />
                ))}
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