import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

export function IndianPatentDetailsCard({ application }) {
  if (!application) return null;

  console.log(application)

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Indian Patent Filing
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {/* <InfoRow label="Title" value={application.title} /> */}
            <InfoRow label="Service" value={application.serviceCode} />
            <InfoRow label="Status" value={application.status} />
            <InfoRow label="Created On" value={new Date(application.createdAt).toLocaleString()} />
          </Stack>
        </Grid>
      </Grid>

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