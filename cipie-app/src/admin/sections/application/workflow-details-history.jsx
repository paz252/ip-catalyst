import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Timeline from '@mui/lab/Timeline';
import Button from '@mui/material/Button';
import TimelineDot from '@mui/lab/TimelineDot';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const workflowData = {
    "workflowInstanceId": "ec63deac-3663-4400-bb12-d641dc50fb9c",
    "applicationId": "b6beaa26-a008-4dd5-9b38-4f238e91c825",
    "serviceCode": "PRIOR_ART",
    "currentStep": "ADMIN_REVIEW",
    "currentStatus": "COMPLETED",
    "assignedToUserId": "3c6df34f-539f-40e4-af4b-adbd570d814a",
    "createdAt": "2026-06-11T06:57:18.382935Z",
    "completedAt": "2026-06-16T10:32:57.328803Z",
    "steps": [
        {
            "workflowStepInstanceId": "3ce71458-e1e6-43d1-a556-193ea95bf99c",
            "stepNumber": 2,
            "stepCode": "ADMIN_REVIEW",
            "assignedRole": "ADMIN",
            "assignedToUserId": "3c6df34f-539f-40e4-af4b-adbd570d814a",
            "status": "ANSWERED",
            "startedAt": "2026-06-16T10:32:57.328757Z",
            "completedAt": "2026-06-16T10:32:57.328768Z"
        },
        {
            "workflowStepInstanceId": "c1cbb96a-d21f-48f0-8dcf-8b938da731a3",
            "stepNumber": 1,
            "stepCode": "USER_SUBMISSION",
            "assignedRole": "ADMIN",
            "assignedToUserId": null,
            "status": "APPROVED",
            "startedAt": "2026-06-11T06:57:18.38321Z",
            "completedAt": "2026-06-16T10:32:57.328593Z"
        }
    ],
    "histories": [
        {
            "workflowHistoryId": "74fc1f43-ac12-4975-8cd1-60436f89db79",
            "actionType": "START",
            "stepCode": "USER_SUBMISSION",
            "stepStatus": "SUBMITTED",
            "fromStep": null,
            "toStep": "USER_SUBMISSION",
            "actionByUserId": "00000000-0000-0000-0000-000000000000",
            "assignedToUserId": null,
            "notes": "Application Submitted",
            "createdAt": "2026-06-11T06:57:18.383483Z"
        },
        {
            "workflowHistoryId": "a3ce0cf8-a7e0-45a1-877a-38ca8fc42c3b",
            "actionType": "APPROVE",
            "stepCode": "ADMIN_REVIEW",
            "stepStatus": "APPROVED",
            "fromStep": "USER_SUBMISSION",
            "toStep": "ADMIN_REVIEW",
            "actionByUserId": "3c6df34f-539f-40e4-af4b-adbd570d814a",
            "assignedToUserId": null,
            "notes": "Workflow approved",
            "createdAt": "2026-06-16T10:32:57.329033Z"
        }
    ]
}

export function WorkflowDetailsHistory({ workflow }) {

    const history = (workflow?.histories || []).toReversed();
    const items = [
        { label: 'Order placed', value: fDateTime(history?.createdAt) },
        { label: 'Payment time', value: fDateTime(history?.createdAt) },
        { label: 'Delivery time for the carrier', value: fDateTime(history?.createdAt) },
        { label: 'Completion time', value: fDateTime(history?.createdAt) },
    ];

    const renderSummary = () => (
        <Paper
            variant="outlined"
            sx={{
                p: 2.5,
                gap: 2,
                minWidth: 260,
                flexShrink: 0,
                borderRadius: 2,
                display: 'flex',
                typography: 'body2',
                borderStyle: 'dashed',
                flexDirection: 'column',
            }}
        >
            {items.map((item) => (
                <Box key={item.label} sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
                    <Box component="span" sx={{ color: 'text.secondary' }}>
                        {item.label}
                    </Box>
                    {item.value}
                </Box>
            ))}
        </Paper>
    );

    const renderTimeline = () => (
        <Timeline
            sx={{
                p: 0,
                [`& .${timelineItemClasses.root}:before`]: { p: 0, flex: 0 },
            }}
        >
            {history?.map((item, index) => {
                const firstTime = index === 0;
                const lastTime = index === history.length - 1;

                return (
                    <TimelineItem key={item.notes}>
                        <TimelineSeparator>
                            <TimelineDot color={firstTime ? 'primary' : 'grey'} />
                            {lastTime ? null : <TimelineConnector />}
                        </TimelineSeparator>

                        <TimelineContent>
                            <Typography variant="subtitle2">{item.notes}</Typography>
                            <Box component="span" sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                                {fDateTime(item.createdAt)}
                            </Box>
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );

    return (
        <Card>
            <CardHeader title="History" />
            <Box
                sx={{
                    p: 3,
                    gap: 3,
                    display: 'flex',
                    alignItems: { md: 'flex-start' },
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                }}
            >
                <Box sx={{ flexGrow: 1 }}>
                    {renderTimeline()}
                    {/* <Button
                        size="small"
                        color="inherit"
                        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} />}
                    >
                        Show more
                    </Button> */}
                </Box>
                {/* {renderSummary()} */}
            </Box>
        </Card>
    );
}
