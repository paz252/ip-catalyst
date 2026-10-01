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

// ----------------------------------------------------------------------

const TABS = [
    { value: 'details', label: 'Trademark Details' },
    { value: 'organizations', label: 'Organizations' },
    { value: 'inventors', label: 'Inventors' },
    { value: 'documents', label: 'Documents' },
];

export function TrademarkDetailsView({ trademark: application, error, loading }) {
   const tabs = useTabs('details');

    if (loading) return <DashboardContent>Loading...</DashboardContent>;
    if (error || !application) return <EmptyContent title="Application not found!" />;

    return (
        <DashboardContent>
            {/* --- HEADER SECTION --- */}
            <Stack direction="row" alignItems="flex-start" sx={{ mb: 3 }}>
                <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4">{application.trademarkName}</Typography>
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
                    href={paths.dashboard.trademark.root}
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                    Back
                </Button>
            </Stack>

            {/* --- SUMMARY CARD --- */}
            <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Description</Typography>
                {/* <pre>{JSON.stringify(application, null, "\t")}</pre> */}
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    {application.description}
                </Typography>               
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

          {/* DETAILS */}
          {tabs.value === 'details' && (
            <Stack spacing={3}>

              <Block label="Trademark Name" content={application.trademarkName} />

              <Block label="Service Code" content={application.serviceCode} />

              <Block label="Status" content={application.status} />

              <Block label="Created By" content={application.createdByUserId} />

            </Stack>
          )}

          {/* ORGANIZATIONS */}
          {tabs.value === 'organizations' && (

            <Stack spacing={2}>

              {application.organizations?.length === 0 && (
                <Typography variant="body2">No organizations provided</Typography>
              )}

              {application.organizations?.map((org, index) => (

                <Card key={index} sx={{ p: 2 }}>

                  <Typography variant="subtitle2">
                    {org.name} {org.isPrimary && "(Primary)"}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {org.address}
                  </Typography>

                  <Typography variant="body2">
                    {org.contactNumber}
                  </Typography>

                </Card>

              ))}

            </Stack>

          )}

          {/* INVENTORS */}
          {tabs.value === 'inventors' && (

            <Stack spacing={2}>

              {application.inventors?.length === 0 && (
                <Typography variant="body2">No inventors provided</Typography>
              )}

              {application.inventors?.map((inv, index) => (

                <Card key={index} sx={{ p: 2 }}>

                  <Typography variant="subtitle2">
                    {inv.fullName}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {inv.country}
                  </Typography>

                  <Typography variant="body2">
                    {inv.email}
                  </Typography>

                </Card>

              ))}

            </Stack>

          )}

          {/* DOCUMENTS */}
          {tabs.value === 'documents' && (

            <Stack spacing={2}>

              {application.documents?.length === 0 && (
                <Typography variant="body2">No documents uploaded</Typography>
              )}

              {application.documents?.map((doc) => (

                <Stack
                  key={doc.documentId}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >

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
            <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{content || 'Not provided'}</Typography>
        </Box>
    );
}