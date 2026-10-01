import { useState } from 'react';
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

// Only one tab needed for a simple query
const TABS = [{ value: 'details', label: 'Query Details' }];

export function QueryDetailsView({ application, error, loading }) {
  const tabs = useTabs('details');

  if (loading) return <DashboardContent>Loading...</DashboardContent>;
  if (error || !application) return <EmptyContent title="Query not found!" />;

  return (
    <DashboardContent>
      {/* --- HEADER SECTION --- */}
      <Stack direction="row" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4">Query Request</Typography>
            <Label 
              variant="soft"
              color={
                (application.status === 'Submitted' && 'info') ||
                (application.status === 'Draft' && 'default') ||
                'success'
              }
            >
              {application.status}
            </Label>
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Reference ID: {application.applicationId} • Submitted on {fDateTime(application.createdAt)}
          </Typography>
        </Stack>

        <Button
          component={RouterLink}
          href={paths.dashboard.userQuery.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Back to List
        </Button>
      </Stack>

      {/* --- CONTENT SECTION --- */}
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
          {tabs.value === 'details' && (
            <Stack spacing={4}>
              {/* The main query message - Using "Message" from your JSON */}
              <Box>
                {/* <Typography variant="subtitle1" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:chat-square-text-bold-duotone" width={24} sx={{ color: 'primary.main' }} />
                  Inquiry Message
                </Typography> */}
                <Card variant="outlined" sx={{ p: 2, bgcolor: 'background.neutral' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {application.message}
                  </Typography>
                </Card>
              </Box>

              {/* Simple Metadata Grid */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
                <Block label="Current Status" content={application.status} />
                <Block label="Submission Date" content={fDateTime(application.createdAt)} />
                <Block label="Record ID" content={application.applicationId} />
              </Stack>
            </Stack>
          )}
        </Box>
      </Card>
    </DashboardContent>
  );
}

// Helper Component for styling blocks
function Block({ label, content }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2">
        {content || 'Not provided'}
      </Typography>
    </Box>
  );
}