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

export default function ActivityDetailsHistory({ activities }) {
  const renderTimeline = () => (
    <Timeline
      sx={{
        p: 0,
        [`& .${timelineItemClasses.root}:before`]: { p: 0, flex: 0 },
      }}
    >
      {activities?.map((item, index) => {
        const firstTime = index === 0;
        const lastTime = index === activities.length - 1;

        return (
          <TimelineItem key={item.patentTitle}>
            <TimelineSeparator>
              <TimelineDot color={firstTime ? 'primary' : 'grey'} />
              {lastTime ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="subtitle2">{item.activityType}</Typography>
              <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                {item.description}
              </Box>
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
    <Card sx={{ backgroundColor: '#fafdff', border: '1px solid #e6f3ff' }}>
      <CardHeader title="Activity-Logs" />
      <Box
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          alignItems: { md: 'flex-start' },
          flexDirection: { xs: 'column-reverse', md: 'row' },
        }}
      >
        <Box
          //  sx={{ flexGrow: 1 }}
          sx={{
            p: 1,
            maxHeight: 500,
            overflowY: 'auto',
            pr: 2,

            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 8,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: 'rgba(0,0,0,0.35)',
            },
          }}
        >
          {renderTimeline()}
        </Box>
      </Box>
    </Card>
  );
}
