import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { downloadDocument } from 'src/actions/document';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

export function DocumentsCard({
  documents = [],
  applicationId,
}) {
  const handleDownload = async () => {
    try {
      await downloadDocument(applicationId);

      toast.success('Documents downloaded successfully');
    } catch {
      toast.error('Unable to download documents');
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h6">
          Documents
        </Typography>

        <Tooltip title="Download All">
          <IconButton
            color="primary"
            onClick={handleDownload}
          >
            <Iconify icon="eva:cloud-download-fill" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack divider={<Divider />} spacing={2}>
        {documents.map((doc) => (
          <Stack
            key={doc.documentId}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <div>
              <Typography variant="subtitle2">
                {doc.originalFileName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {doc.documentType}
              </Typography>
            </div>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {new Date(doc.uploadedAt).toLocaleString()}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}