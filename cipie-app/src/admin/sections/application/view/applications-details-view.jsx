import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';

import { paths } from 'src/routes/paths';

import { _orders } from 'src/_mock/_order';
import { DashboardContent } from 'src/layouts/dashboard';
import { approveApplication, rejectApplication, inProcessApplication, updateAndResubmitApplication } from 'src/admin/actions/application';

import { toast } from 'src/components/snackbar';

import { QueryForm } from '../query-form';
import { WorkflowCard } from '../workflow-card';
import { DocumentsCard } from '../documents-card';
import { ServiceDetailsCard } from '../serviceDetailsCards/index';
import { WorkflowDetailsHistory } from '../workflow-details-history';
import ApplicationDetailsSkeleton from '../application-details-skeletone';
import { ApplicationDetailsToolbar } from '../serviceDetailsCards/application-details-toolbar';
import { ApplicationDetailsApplicant } from '../serviceDetailsCards/application-details-applicant';

export const APPLICATION_STATUS_OPTIONS = [
  { value: 'in-process', label: 'In Process' },
  { value: 'approved', label: 'Approve' },
  { value: 'update', label: 'Update & Resubmit' },
  //{ value: 'answered', label: 'Answered' },
];

export function ApplicationDetailsView({ application, loading, error }) {
  const [currentTab, setCurrentTab] = useState('application');
  const [openForm, setOpenForm] = useState(false);
  const [queryReplyText, setQueryReplyText] = useState('');

  const theme = useTheme();

  // if (loading) return <>Loading...</>;
  if (loading) {
    return (
      <DashboardContent forceFullWidth>
        <ApplicationDetailsSkeleton />
      </DashboardContent>
    );
  }

  if (error) return <>Failed to load application.</>;

  const app = application?.application;
  const applicant = application?.applicant;
  const workflow = application?.workflow;

  const isUserQuery = app.serviceCode === 'USER_QUERY';
  const isFinalStatus = app.status === 'Approved' || app.status === 'Rejected';
  const isQueryStatus = app.status === 'Answered';

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

  const handleInProcess = async () => {
    try {
      await inProcessApplication({
        applicationId: app.applicationId,
        remarks: 'Marked as in process by Admin',
      });

      toast.success('Application marked as in process');
    } catch (er) {
      toast.error(er.message);
    }
  };

  const handleUpdateAndResubmit = async () => {
    try {
      await updateAndResubmitApplication({
        applicationId: app.applicationId,
        remarks: 'Needs updates and marked for resubmission.',
      });

      toast.success('Application marked for updates and resubmission');
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
      <DashboardContent forceFullWidth>
        {/* <CustomBreadcrumbs
          heading="Application Details"
          links={[
            { name: 'Dashboard', href: paths.admin.dashboard },
            { name: 'Applications', href: paths.admin.list },
            { name: 'Details' },
          ]}
          action={
            <Stack direction="row" spacing={2}>
              {isUserQuery && (
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
        /> */}

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

        <ApplicationDetailsToolbar
          status={app.status}
          createdAt={app?.createdAt}
          orderNumber={app?.applicationId}
          serviceCode={app?.serviceCode}
          backHref={paths.admin.list}
          // onChangeStatus={handleChangeStatus}
          statusOptions={APPLICATION_STATUS_OPTIONS}
          isUserQuery={isUserQuery}
          isFinalStatus={isFinalStatus}
          handleApprove={handleApprove}
          handleReject={handleReject}
          handleInProcess={handleInProcess}
          handleUpdateAndResubmit={handleUpdateAndResubmit}
          onOpenForm={onOpenForm}
          isQueryStatus={isQueryStatus}
        />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                gap: 3,
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'column' },
              }}
            >
              <ServiceDetailsCard application={app} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <ApplicationDetailsApplicant customer={applicant} />

              <Divider sx={{ borderStyle: 'dashed' }} />
              {app.documents && (
                <DocumentsCard documents={app.documents} applicationId={app.applicationId} />
              )}

              <Divider sx={{ borderStyle: 'dashed' }} />
              <WorkflowDetailsHistory workflow={workflow} />

              <Divider sx={{ borderStyle: 'dashed' }} />
              <WorkflowCard workflow={workflow} />
            </Card>
          </Grid>
        </Grid>
      </DashboardContent>
      {renderReplyQueryDialog()}
    </>
  );
}
