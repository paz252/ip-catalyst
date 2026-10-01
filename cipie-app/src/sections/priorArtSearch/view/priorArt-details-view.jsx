import { useState, useEffect } from 'react';
import { useTabs } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
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

import { PriorArtDetailsSkeleton } from '../priorArt-details-skeleton';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'description', label: 'Invention Description' },
  { value: 'technical', label: 'Technical Details' },
  { value: 'history', label: 'Disclosure & Docs' },
];

export function PriorArtDetailsView({ priorArt: application, error, loading }) {
  const tabs = useTabs('description');

  //   if (loading) return <DashboardContent>Loading...</DashboardContent>;
  // if (error || !application) return <EmptyContent title="Application not found!" />;
  if (loading) return <PriorArtDetailsSkeleton />;

  if (error || !application) {
    return <EmptyContent title="Application not found" />;
  }

  return (
    <DashboardContent>
      {/* --- HEADER SECTION --- */}
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4">{application.title}</Typography>
            <Label color={application.status === 'Draft' ? 'info' : 'success'}>
              {application.status}
            </Label>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ID: {application.applicationId} • Created on {fDateTime(application.createdAt)}
          </Typography>
        </Stack>

        <Button
          component={RouterLink}
          href={paths.dashboard.priorArtSearch.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back
        </Button>
      </Stack>

      {/* --- SUMMARY CARD --- */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Problem Statement
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          {application.problemStatement}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Solution
        </Typography>
        <Typography variant="body1">{application.solution}</Typography>
      </Card>

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
          {tabs.value === 'description' && (
            <Stack spacing={3}>
              <Block label="Invention Description" content={application.inventionDescription} />
              <Block label="Novelty" content={application.novelty} />
            </Stack>
          )}

          {tabs.value === 'technical' && (
            <Stack spacing={3}>
              <Block label="Apparatus" content={application.apparatusDescription} />
              <Block label="Key Components" content={application.keyComponents} />
              <Block label="Technical Advantages" content={application.technicalAdvantages} />
            </Stack>
          )}

          {tabs.value === 'history' && (
            <Stack spacing={3}>
              <Block
                label="Prior Disclosure History"
                content={application.priorDisclosureHistory}
              />
              <Block label="Related Publications" content={application.relatedPublications} />

              <Typography variant="subtitle2">Documents</Typography>
              {application.documents?.map((doc) => (
                <Stack key={doc.documentId} direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:file-text-bold" width={24} />
                  <Typography variant="body2">
                    {doc.originalFileName} ({fDateTime(doc.uploadedAt)})
                  </Typography>
                </Stack>
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
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {content || 'Not provided'}
      </Typography>
    </Box>
  );
}
