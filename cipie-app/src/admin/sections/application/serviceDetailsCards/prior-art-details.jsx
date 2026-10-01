import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

export function PriorArtDetailsCard({ application }) {
  if (!application) return null;

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {application.title}
      </Typography>

      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <InfoRow label="Title" value={application.title} />
            <InfoRow label="Service" value={application.serviceCode} />
            <InfoRow label="Status" value={application.status} />
            <InfoRow label="Created On" value={new Date(application.createdAt).toLocaleString()} />
          </Stack>
        </Grid> */}

        {/* <Grid item xs={12} md={4}>
          <Label color="success">{application.status}</Label>
        </Grid> */}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={3}>
        <InfoBlock
          title="Problem Statement"
          value={application.problemStatement}
        />

        <InfoBlock
          title="Solution"
          value={application.solution}
        />

        <InfoBlock
          title="Invention Description"
          value={application.inventionDescription}
        />

        <InfoBlock
          title="Novelty"
          value={application.novelty}
        />

        <InfoBlock
          title="Technical Advantages"
          value={application.technicalAdvantages}
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