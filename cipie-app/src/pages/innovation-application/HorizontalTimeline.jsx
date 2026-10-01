import { Box, Typography } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';

export default function HorizontalTimeline() {
  return (
    <Timeline
      sx={{
        flexDirection: 'row', // ✅ make horizontal
        p: 0,
      }}
    >
      {[1, 2, 3].map((item, index) => (
        <TimelineItem
          key={index}
          sx={{
            flex: 1,
            '&:before': { display: 'none' }, // remove default line spacing
          }}
        >
          <TimelineSeparator
            sx={{
              flexDirection: 'row', // horizontal connector
              alignItems: 'center',
            }}
          >
            <TimelineDot />
            {index < 2 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="subtitle2">Step {item}</Typography>
            <Typography variant="body2">Details</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
