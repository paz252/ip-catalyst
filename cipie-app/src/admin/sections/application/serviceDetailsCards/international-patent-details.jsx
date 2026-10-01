import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

export function InternationalPatentDetailsCard({ application }) {
    if (!application) return null;

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                International Patent Filing
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={3}>
                <InfoBlock
                    title="Prior Art Application"
                    value={application.priorArtApplicationId}
                />

                <InfoBlock
                    title="File Number"
                    value={application.fileNumber}
                />

                <InfoBlock
                    title="Filing Route"
                    value={application.filingRoute}
                />

                <InfoBlock
                    title="Justification"
                    value={application.justification}
                />
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