import { Box, Card, Typography, Stack, Button, Chip, Divider } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { NEWS_DATA, EVENTS_DATA } from 'src/config/news-data';

import { Iconify } from 'src/components/iconify';

import { AutoScroll } from './wrapper/home-auto-scroll';

export function HomeInsightsSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: 5,
        background: 'linear-gradient(180deg, #FFF 50%, hsl(210, 100%, 96%) 100%);',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* ================= SUCCESS STORIES ================= */}
        <Card sx={cardStyle}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Success Stories
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            Dr. A. Seema is an eminent Indian scientist from the Centre for Materials for
            Electronics Technology (CMET), Thrissur, Kerala. She led a pioneering research team that
            developed an innovative wearable device
          </Typography>

          <Box
            component="img"
            // src="http://10.208.208.172:3001/assets/images/fame/wall-of-fame1.png"
            src="https://cipie.in/assets/images/fame/wall-of-fame1.png"
            alt="success"
            sx={{
              width: '100%',
              height: 200,
              borderRadius: 2,
              objectFit: 'cover',
              mb: 2,
            }}
          />

          <Typography variant="caption" color="text.secondary">
            — Dr. A. Seema – Nari Shakti Puraskar (2019)
          </Typography>

          <Button size="small" sx={linkBtn} component={RouterLink} to="/wall-of-fame">
            View All Stories →
          </Button>
        </Card>

        {/* ================= NEWS ================= */}
        <Card sx={cardStyle}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            News & Announcements
          </Typography>

          <AutoScroll height={280} sx={autoscrollStyle} speed={0.5}>
            <Stack spacing={2}>
              {NEWS_DATA.map((event, index) => (
                <NewsItem key={index} event={event} />
              ))}
            </Stack>
          </AutoScroll>

          <Button size="small" sx={linkBtn} component={RouterLink} to="/news">
            View All News →
          </Button>
        </Card>

        {/* ================= EVENTS ================= */}
        <Card sx={cardStyle}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Events
          </Typography>

          <AutoScroll height={280} sx={autoscrollStyle} speed={0.5}>
            <Stack spacing={2}>
              {EVENTS_DATA.map((event, index) => (
                <EventsItem key={index} event={event} />
              ))}
            </Stack>
          </AutoScroll>

          <Button size="small" sx={linkBtn} component={RouterLink} to="/events">
            View All Events →
          </Button>
        </Card>
      </Stack>
    </Box>
  );
}

function NewsItem({ event }) {
  return (
    <>
      <Box
        component={RouterLink}
        to={`/innovation/${event.domain}/${event.category}/news/${event.slug}`}
        sx={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          p: 1,
          borderRadius: 2,
          transition: 'all 0.2s ease',

          '&:hover': {
            bgcolor: 'action.hover',
            transform: 'translateX(4px)',
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, lineHeight: 1.4, color: 'text.primary' }}
          >
            {event.title}
          </Typography>
          <StatusBadge status="Granted" />
          {event.isNew && <BlinkBadge />}
        </Stack>

        {/* <Typography variant="body2" sx={{ mt: 0.5 }}>
          {event.title}
        </Typography> */}

        <Typography variant="caption" color="text.secondary">
          {event.date}
        </Typography>

        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
          <Chip size="small" label={`Patent: ${event.patentNo}`} color="primary" variant="soft" />
          <Chip
            size="small"
            label={`Application: ${event.applicationNo}`}
            color="info"
            variant="soft"
          />
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />
    </>
  );
}

function EventsItem({ event }) {
  const isClickable = event.isNew && event.link;

  const content = (
    <Stack direction="row" spacing={2}>
      {/* Icon */}
      <Box
        sx={(theme) => ({
          width: 36,
          height: 36,
          borderRadius: 2,
          // bgcolor: theme.palette.primary.lighter,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        })}
      >
        <Iconify icon="solar:calendar-bold" width={18} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {/* Title + Badge */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={600}>
            {event.title}
          </Typography>

          {event.isNew && <BlinkBadge />}
        </Stack>

        {/* Date */}
        <Typography variant="caption" color="text.secondary">
          {event.date}
        </Typography>

        {/* Venue */}
        {event.venue && (
          <Stack direction="row" spacing={0.1} alignItems="center">
            <Iconify icon="mdi:map-marker" width={16} sx={{ color: '#bf2929' }} />

            <Typography variant="caption" display="block">
              {event.venue}
            </Typography>
          </Stack>
        )}

        {/* CTA */}
        {isClickable && (
          <Box
            sx={(theme) => ({
              width: 'fit-content',
              mt: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.6,

              px: 1.4,
              py: 0.8,

              borderRadius: 1.5,
              fontSize: 12,
              fontWeight: 700,

              color: '#fff',
              bgcolor: '#0B3C5D',

              cursor: 'pointer',
              transition: 'all 0.25s ease',

              '&:hover': {
                bgcolor: '#07293F',
                transform: 'translateX(2px)',
                boxShadow: '0 4px 12px rgba(11,60,93,0.3)',
              },
            })}
          >
            Register Now
            <Iconify icon="solar:arrow-right-bold" width={14} />
          </Box>
        )}
      </Box>
    </Stack>
  );

  return (
    <>
      {isClickable ? (
        <Box
          component="a"
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            p: 1,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'all 0.2s ease',

            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'translateX(4px)',
            },
          }}
        >
          {content}
        </Box>
      ) : (
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            opacity: 0.85,
          }}
        >
          {content}
        </Box>
      )}

      <Divider sx={{ my: 1 }} />
    </>
  );
}

function BlinkBadge() {
  return (
    <Box
      sx={{
        px: 0.8,
        py: 0.2,
        fontSize: 10,
        fontWeight: 700,
        borderRadius: 1,
        bgcolor: 'error.main',
        color: '#fff',
        animation: 'blink 1.2s infinite',
        '@keyframes blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      }}
    >
      NEW
    </Box>
  );
}

function StatusBadge({ status }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.3,
        borderRadius: 1,
        fontSize: 11,
        fontWeight: 700,
        bgcolor: 'success.lighter',
        color: 'success.main',
        ml: 1,
      }}
    >
      {status}
    </Box>
  );
}

//
// ================= STYLES =================
//
const cardStyle = {
  flex: 1,
  p: 3,
  borderRadius: 3,
  border: (theme) => `1px solid ${theme.palette.divider}`,
  minHeight: 440,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const linkBtn = {
  mt: 2,
  fontWeight: 600,
  color: 'primary.main',
};

const autoscrollStyle = {
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    height: 30,
    zIndex: 2,
  },
  '&::before': {
    top: 0,
    background: 'linear-gradient(to bottom, white, transparent)',
  },
  '&::after': {
    bottom: 0,
    background: 'linear-gradient(to top, white, transparent)',
  },
};
