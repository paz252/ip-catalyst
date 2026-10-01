import { Box, Card, Typography, Stack, Button, Divider } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function HomeInsightsSection1() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, px: 1 }}>
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

          <Button size="small" sx={linkBtn}>
            View All Stories →
          </Button>
        </Card>

        {/* ================= NEWS ================= */}
        <Card sx={cardStyle}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Latest News & Announcements
          </Typography>

          <Stack spacing={2}>
            {NEWS_DATA.map((item, index) => (
              <Box key={index}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={600}>
                    {item.title}
                  </Typography>

                  {item.isNew && <Box sx={blinkBadge}>NEW</Box>}
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {item.date}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>

                {index !== NEWS_DATA.length - 1 && <Divider sx={{ mt: 1 }} />}
              </Box>
            ))}
          </Stack>

          <Button size="small" sx={linkBtn}>
            View All News →
          </Button>
        </Card>

        {/* ================= EVENTS ================= */}
        <Card sx={cardStyle}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Upcoming Events
          </Typography>

          <Stack spacing={2}>
            {EVENTS_DATA.map((event, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <Iconify icon="solar:calendar-bold" width={22} />

                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {event.title}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {event.date}
                  </Typography>

                  {event.venue && (
                    <Typography variant="caption" display="block">
                      {event.venue}
                    </Typography>
                  )}
                </Box>
              </Stack>
            ))}
          </Stack>

          <Button size="small" sx={linkBtn}>
            View All Events →
          </Button>
        </Card>
      </Stack>
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
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 420,
};

const linkBtn = {
  mt: 2,
  alignSelf: 'flex-start',
  fontWeight: 600,
  color: 'primary.main',
};

const blinkBadge = {
  px: 1,
  py: 0.2,
  borderRadius: 1,
  fontSize: 10,
  fontWeight: 700,
  color: '#fff',
  bgcolor: 'error.main',
  animation: 'blink 1.2s infinite',
  '@keyframes blink': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.2 },
  },
};

//
// ================= DATA =================
//
const NEWS_DATA = [
  {
    title: 'IP Catalyst: Patent Grant Announcement',
    date: 'Recently',
    desc: 'Patent “A Method for Fabrication of Battery Electrodes',
    patentNo: 'IN582161',
    applicationNo: '202211033784',
    isNew: true,
  },
  {
    title: 'IP Catalyst: Patent Grant Announcement',
    date: 'Recently',

    desc: 'Patent “A Data Scheduling Register Tree for Radix-2 FFT Architecture',
    patentNo: 'IN581062',
    applicationNo: '202041007125',
    isNew: true,
  },
];

const EVENTS_DATA = [
  {
    title:
      'A one-day conference on “From Patent to Product: Accelerating IP Commercialization in Electronics & IT”',
    date: '12 May 2026',
    isNew: true,
  },
  {
    title: 'Training on Technology Innovation and Intellectual Property Management',
    date: '9 Dec 2024',
    isNew: false,
  },
  {
    title: 'Patent Informatics for Research and Business Planning',
    date: '26 Apr 2024',
    isNew: false,
  },
  {
    title: 'IPR: Strategies for Innovation and Protection',
    date: '21 Mar 2024',
    venue: 'IIT Tirupati',
    isNew: false,
  },
  {
    title: 'IPR Essentials: Enhancing Technology Transfer Through Strategic IP Management',
    date: '13 Mar 2024',
    venue: 'Shivajinagar, Pune',
    isNew: false,
  },
  {
    title: 'Strategies for Technology Transfer and IP Evaluation for Startups',
    date: '21 Feb 2024',
    venue: 'Maker Village, Kochi',
    isNew: false,
  },
  {
    title: 'Intellectual Property Strategies for Technology Commercialization',
    date: '30 Jan 2024',
    venue: 'Assam Startup The Nest',
    isNew: false,
  },
  {
    title: 'Idea to Market – The IPR Journey',
    date: '19 Dec 2023',
    venue: 'Punjab University',
    isNew: false,
  },
  {
    title: 'Emerging Innovation Brainwave Session on IPR',
    date: '14 Dec 2023',
    venue: 'Bhau Institute',
    isNew: false,
  },
  {
    title: 'Unleashing Innovation: The Role of IPR in Taking Ideas to Market',
    date: '30 Nov 2023',
    venue: 'IIIT Naya Raipur',
    // venue: 'International Institute of Information Technology Naya Raipur',
    isNew: false,
  },
];
