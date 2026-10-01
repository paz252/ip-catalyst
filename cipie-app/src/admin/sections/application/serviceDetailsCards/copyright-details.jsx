import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

export function CopyrightDetailsCard({ application }) {
    if (!application) return null;

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Copyright Details
            </Typography>
            <Divider sx={{ my: 3 }} />

            <Stack spacing={3}>
                <InfoBlock title="Title" value={application.title} />
                <InfoBlock title="Type Of Work" value={application.typeOfWork} />
                <InfoBlock title="Description" value={application.description} />
                <InfoBlock title="Author Names" value={application.authorNames} />
                <InfoBlock title="Organization" value={application.organization} />
                <InfoBlock title="Ownership Type" value={application.ownershipType} />
                <InfoBlock title="Publication Status" value={application.publicationStatus} />
                <InfoBlock title="Publication Date" value={application.publicationDate} />
                <InfoBlock title="Language" value={application.language} />
                <InfoBlock title="Nature Of Work" value={application.natureOfWork} />
            </Stack>
        </Card>
    );
}

function InfoRow({ title, value }) {
    return (
        <Stack direction="row" spacing={2}>
            <Typography
                variant="subtitle2"
                sx={{ minWidth: 140 }}
            >
                {title}
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