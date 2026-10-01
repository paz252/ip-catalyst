import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import Divider from '@mui/material/Divider';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';

export function WorkflowCard({ workflow }) {
  if (!workflow) return null;
  const histories = workflow?.histories || [];

  console.log("workflow", workflow)

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Workflow
      </Typography>

      <Stack spacing={2}>
        <InfoRow
          label="Current Step"
          value={workflow.currentStep}
        />

        <InfoRow
          label="Current Status"
          value={workflow.currentStatus}
        />

        <InfoRow
          label="Created"
          value={new Date(workflow.createdAt).toLocaleString()}
        />
      </Stack>

      <Divider sx={{ my: 3 }} />
{/* 
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Workflow History
      </Typography>

      <Timeline>
        {workflow?.histories?.map((history) => (
          <TimelineItem key={history.workflowHistoryId}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="subtitle2">
                {history.actionType}
              </Typography>

              <Typography variant="body2">
                {history.notes}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {new Date(history.createdAt).toLocaleString()}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline> */}

      {/* <Stack spacing={2}>
        {workflow.histories?.map((history) => (
          <Stack key={history.workflowHistoryId}>
            <Typography variant="subtitle2">
              {history.actionType}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {history.notes}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {history.createdAt}
            </Typography>
          </Stack>
        ))}
      </Stack> */}
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2">
        {label}
      </Typography>

      <Typography  variant="caption" color="text.secondary">{value || '-'}</Typography>
    </Stack>
  );
}