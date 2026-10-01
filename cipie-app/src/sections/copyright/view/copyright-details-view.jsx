import { useTabs } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'details', label: 'Work Details' },
  { value: 'ownership', label: 'Author & Ownership' },
  { value: 'publication', label: 'Publication' },
  { value: 'documents', label: 'Documents' },
];

const DOC_LABELS = {
  WORK_COPY: 'Work Copy',
  ORG_NOC: 'Organization NOC',
  ASSIGNMENT_DEED: 'Assignment Deed',
  ADDITIONAL_DOC: 'Additional Document',
};

// ----------------------------------------------------------------------

export function CopyrightDetailsView({ copyright, loading, error }) {
  const tabs = useTabs('details');

  if (loading) return <DashboardContent>Loading...</DashboardContent>;
  if (error || !copyright) return <EmptyContent title="Application not found!" />;

  const documents = copyright.documents || [];

  return (
    <DashboardContent>

      {/* ================= HEADER ================= */}
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4">
              Copyright Application
            </Typography>

            <Label color={copyright.status === 'Draft' ? 'info' : 'success'}>
              {copyright.status}
            </Label>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Application ID: {copyright.applicationId}
          </Typography>

        </Stack>

        <Button
          component={RouterLink}
          href={paths.dashboard.copyright.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>
      </Stack>

      {/* ================= TABS ================= */}
      <Card>
        <Tabs
          value={tabs.value}
          onChange={tabs.onChange}
          sx={{ px: 2, bgcolor: 'background.neutral' }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <Divider />

        <Box sx={{ p: 3 }}>

          {/* ================= WORK DETAILS ================= */}
          {tabs.value === 'details' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InfoRow label="Title" value={copyright.title} />
                <InfoRow label="Type of Work" value={copyright.typeOfWork} />
                <InfoRow label="Description" value={copyright.description} />
                <InfoRow label="Language" value={copyright.language} />
                <InfoRow label="Nature of Work" value={copyright.natureOfWork} />
              </Grid>
            </Grid>
          )}

          {/* ================= OWNERSHIP ================= */}
          {tabs.value === 'ownership' && (
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <InfoRow label="Author Name(s)" value={copyright.authorNames} />
                <InfoRow label="Organization" value={copyright.organization} />
                 <InfoRow label="Ownership Type" value={copyright.ownershipType} />
                 <InfoRow
                  label="Created in Employment"
                  value={copyright.isWorkForHire ? 'Yes' : 'No'}
                />
              </Grid>
            </Grid>
          )}

          {/* ================= PUBLICATION ================= */}
          {tabs.value === 'publication' && (
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <InfoRow
                  label="Publication Status"
                  value={copyright.publicationStatus}
                />
                {copyright.publicationStatus === 'Published' && (
                <>
                    <InfoRow
                      label="Publication Date"
                      value={copyright.publicationDate}
                    />

                    <InfoRow
                      label="Country of First Publication"
                      value={copyright.publicationCountry}
                    />
                </>
              )}
              </Grid>
            </Grid>
          )}

          {/* ================= DOCUMENTS ================= */}
          {tabs.value === 'documents' && (
            <Stack spacing={2}>

              {documents.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No documents uploaded
                </Typography>
              )}

              {documents.map((doc) => (
                <Card key={doc.documentId} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between">

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Iconify icon="solar:file-text-bold" width={24} />

                      <Stack>
                        <Typography variant="body2">
                          {DOC_LABELS[doc.documentCategory] || doc.documentCategory}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {doc.originalFileName}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography variant="caption">
                      {fDateTime(doc.uploadedAt)}
                    </Typography>

                  </Stack>
                </Card>
              ))}

            </Stack>
          )}

        </Box>
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------


function InfoRow({ label, value }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // stack on mobile, row on larger screens
        alignItems: { xs: 'flex-start', sm: 'center' }, // left-align on mobile
        gap: 1.5,
        py: 0.8,
        borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
      }}
    >
      {/* LABEL */}
      <Typography
        variant="body2"
        sx={{
          width: { xs: '100%', sm: 180, md: 220 },
          flexShrink: 0,
          fontWeight: 600,
          color: 'text.secondary',
          whiteSpace: { xs: 'normal', sm: 'nowrap' },
          '&::after': {
            content: { xs: "''", sm: "':'" },
            marginLeft: 0.5,
          },
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: { xs: 'normal', sm: 'wrap' },
        }}
      >
        {value || 'Not provided'}
      </Typography>
    </Box>
  );
}