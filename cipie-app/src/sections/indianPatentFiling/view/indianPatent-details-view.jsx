
import { useState, useEffect } from 'react';
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
  { value: 'details', label: 'Indian Patent Details' },
  { value: 'documents', label: 'Documents' },
];

const DOC_LABELS = {
  PRIOR_ART_REPORT: 'Prior Art Report',
  ORG_NOC: 'Organization NOC',
  PATENT_FORM_1: 'Patent Form 1',
  PATENT_FORM_2: 'Patent Form 2',
  PATENT_FORM_3: 'Patent Form 3',
};

export function IndianPatentDetailsView({ indianPatent: application, error, loading }) {
  const tabs = useTabs('details');

  if (loading) return <DashboardContent>Loading...</DashboardContent>;
  if (error || !application) return <EmptyContent title="Application not found!" />;
  const documents = application.documents || [];

  return (
    <DashboardContent>
      {/* --- HEADER SECTION --- */}
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>

          <Stack direction="row" spacing={1} alignItems="center">

            <Typography variant="h4">
              Indian Patent Filing Request
            </Typography>

            <Label color={application.status === 'Draft' ? 'info' : 'success'}>
              {application.status}
            </Label>

          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Application ID: {application.applicationId}
          </Typography>

        </Stack>

        <Button
          component={RouterLink}
          href={paths.dashboard.indianPatentFiling.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>
      </Stack>


      {/* --- TABS SECTION --- */}
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

          {/* DETAILS TAB */}

          {tabs.value === 'details' && (

            <Grid container spacing={2} sx={{ width: '100%' }}>

              <Grid item xs={12}>
                <InfoRow
                  label="Application ID"
                  value={application.applicationId}
                />
              </Grid>

              <Grid item xs={12}>
                <InfoRow
                  label="Prior Art Application ID"
                  value={application.priorArtApplicationId}
                />
              </Grid>

              {/* <Grid item xs={12}>
    <InfoRow label="Status">
      <Label color={application.status === 'Draft' ? 'info' : 'success'}>
        {application.status}
      </Label>
    </InfoRow>
  </Grid> */}

            </Grid>
          )}

          {/* DOCUMENTS TAB */}

          {tabs.value === 'documents' && (

            <Stack spacing={2}>

              {documents.map((doc) => (

                <Card key={doc.documentId} sx={{ p: 2 }}>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >

                    <Stack direction="row" spacing={2} alignItems="center">

                      <Iconify icon="solar:file-text-bold" width={24} />

                      <Stack>

                        <Typography variant="body2">
                          {DOC_LABELS[doc.documentCategory]}
                        </Typography>

                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {doc.originalFileName}
                        </Typography>

                      </Stack>

                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">

                      <Typography variant="caption">
                        {fDateTime(doc.uploadedAt)}
                      </Typography>

                      {/* <Button
                        size="small"
                        startIcon={<Iconify icon="eva:download-fill" />}
                      >
                        Download
                      </Button> */}

                    </Stack>

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

// Helper Component for styling blocks of text
function Block({ label, content }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{content || 'Not provided'}</Typography>
    </Box>
  );
}

function Info({ label, value }) {

  return (
    <Box>

      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        {label}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {value || 'Not provided'}
      </Typography>

    </Box>
  );
}

function InfoRow({ label, value, children }) {
  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>

      <Typography
        variant="subtitle2"
        sx={{ width: 220, flexShrink: 0 }}
      >
        {label}
      </Typography>

      <Typography variant="subtitle2">:</Typography>

      <Box sx={{ flex: 1 }}>
        {children ? (
          children
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {value || 'Not provided'}
          </Typography>
        )}
      </Box>

    </Stack>
  );
}
