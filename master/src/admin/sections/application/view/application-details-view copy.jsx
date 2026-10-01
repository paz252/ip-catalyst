import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  approveApplication,
  rejectApplication,
} from 'src/admin/actions/application';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QueryForm } from '../query-form';
import { WorkflowCard } from '../workflow-card';
import { DocumentsCard } from '../documents-card';
import { ApplicantInfoCard } from '../applicant-info-card';
import { ServiceDetailsCard } from '../serviceDetailsCards/index';

export function ApplicationDetailsView({
  application,
  loading,
  error,
}) {
  const [currentTab, setCurrentTab] = useState('application');
  const [openForm, setOpenForm] = useState(false);
  const [queryReplyText, setQueryReplyText] = useState('');

  const theme = useTheme();

  if (loading) return <>Loading...</>;

  if (error) return <>Failed to load application.</>;

  const app = application?.application;
  const applicant = application?.applicant;
  const workflow = application?.workflow;

  const isUserQuery = app.serviceCode === "USER_QUERY";
  const isFinalStatus =
    app.status === "Approved" || app.status === "Rejected";
  const isQueryStatus = app.status === "Answered";

  const flexStyles = {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  };

  const onOpenForm = () => {
    setOpenForm(true);
  };

  const onCloseForm = () => {
    setOpenForm(false);
    // setSelectedRange(null);
    // setSelectedEventId('');
  };

  const handleTabChange = (event, value) => {
    setCurrentTab(value);
  };

  const handleApprove = async () => {
    try {
      await approveApplication({
        applicationId: app.applicationId,
        remarks: 'Approved by Admin',
      });

      toast.success('Application approved');
    } catch (er) {
      toast.error(er.message);
    }
  };

  const handleReject = async () => {
    try {
      await rejectApplication({
        applicationId: app.applicationId,
        remarks: 'Rejected by Admin',
      });

      toast.success('Application rejected');
    } catch (er) {
      toast.error(er.message);
    }
  };

  // const handleReplyQuery = async (text) => {
  //   try {
  //     await replyToQuery({
  //       applicationId: app.applicationId,
  //       replyText: text,
  //     });

  //     toast.success('Application rejected');
  //   } catch (er) {
  //     toast.error(er.message);
  //   }
  // };

  const renderReplyQueryDialog = () => (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openForm}
      onClose={onCloseForm}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: theme.transitions.duration.shortest - 80,
      }}
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
            '& form': { ...flexStyles, minHeight: 0 },
          },
        },
      }}
    >
      <DialogTitle sx={{ minHeight: 76 }}>
        {/* {openForm && <> {currentEvent?.id ? 'Edit' : 'Add'} event</>} */}

        {openForm && <>Reply to Query</>}
      </DialogTitle>

      <QueryForm
        currentQuery={app}
        // colorOptions={CALENDAR_COLOR_OPTIONS}
        onClose={onCloseForm}
      />
    </Dialog>
  );

  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Application Details"
          links={[
            { name: 'Dashboard', href: paths.admin.dashboard  },
            { name: 'Applications', href: paths.admin.list },
            { name: 'Details' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              {isUserQuery && (
                // <Button
                //   variant="contained"
                //   // onClick={() => handleReplyQuery(queryReplyText)}
                //   disabled={isQueryStatus}
                // >
                //   Reply to Query
                // </Button>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={onOpenForm}
                  disabled={isQueryStatus}
                >
                  Reply to Query
                </Button>
              )}

              {!isUserQuery && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Iconify icon="solar:check-circle-bold" />}
                    onClick={handleApprove}
                    disabled={isFinalStatus}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Iconify icon="solar:close-circle-bold" />}
                    onClick={handleReject}
                    disabled={isFinalStatus}
                  >
                    Reject
                  </Button>
                </>
              )}
            </Stack>
          }
          sx={{ mb: 3 }}
        />

      
        {/* <Card sx={{ p: 3 }}>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            margin: 0,
            fontSize: 14,
          }}
        >
          {JSON.stringify(application, null, 2)}
        </pre>
      </Card> */}

        <Card sx={{ mb: 3, width: '100%' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{ px: 2 }}
          >
            <Tab
              value="application"
              label="Application Details"
            />

            <Tab
              value="applicant"
              label="Applicant Information"
            />

            <Tab
              value="workflow"
              label="Workflow"
            />
          </Tabs>
        </Card>

        {currentTab === 'application' && (
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <ServiceDetailsCard application={app} />
            </Grid>

            {app?.documents?.length > 0 && (
              <Grid item xs={12} sx={{ width: "100%" }}>
                <DocumentsCard
                  documents={app.documents}
                  applicationId={app.applicationId}
                />
              </Grid>
            )}
          </Grid>
        )}

        {currentTab === 'applicant' && (
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <ApplicantInfoCard applicant={applicant} />
            </Grid>
          </Grid>
        )}

        {currentTab === 'workflow' && (
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <WorkflowCard workflow={workflow} />
            </Grid>
          </Grid>
        )}

        {/* <Grid container spacing={3}>
        <Grid item xs={12}>
          <ServiceDetailsCard application={application?.application} />
        </Grid>

        <Grid item xs={12} md={6}>
          <ApplicantInfoCard applicant={application?.applicant} />
        </Grid>

        <Grid item xs={12} md={6}>
          <WorkflowCard workflow={application?.workflow} />
        </Grid>

        {application?.application?.documents?.length > 0 && (
          <Grid item xs={12}>
            <DocumentsCard documents={application.application.documents} applicationId={application?.application.applicationId} />
          </Grid>
        )}
      </Grid> */}

      </DashboardContent>
      {renderReplyQueryDialog()}
    </>
  );
}