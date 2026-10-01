import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function ApplicantInfoCard({ applicant }) {
  if (!applicant) return null;

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Applicant Information
      </Typography>

      <Stack spacing={2}>
        <InfoRow label="Name" value={applicant.fullName} />
        <InfoRow label="Email" value={applicant.email} />
        <InfoRow label="User Type" value={applicant.userTypeCode} />
        <InfoRow label="Domain" value={applicant.domainName} />
        <InfoRow label="Organization" value={applicant.organizationName} />
      </Stack>
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography>{value || '-'}</Typography>
    </Stack>
  );
}