import { Box, Container, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

const OLD_STATS = [
  {
    count: 500,
    title: 'Innovations Supported',
  },
  {
    count: 200,
    title: 'Patents Filed',
  },
  {
    count: 50,
    title: 'Startups & MSMEs Empowered',
  },
  {
    count: 25,
    title: 'Countries Targeted',
  },
];
const STATS = [
  {
    count: 8,
    title: 'Autonomous Societies',
  },
  {
    count: 256,
    title: 'Startups & MSMEs',
  },
  {
    count: 158,
    title: 'PCT Targeted Countries (IPFS)',
  },
  {
    count: 26,
    title: 'Centers of Excellence (CoEs)',
  },
];

export function HomeCountStatsSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 6 },

        backgroundImage: `url(${CONFIG.assetsDir}/assets/images/home/section-4/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexWrap: {
              xs: 'wrap',
              md: 'nowrap',
            },
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {STATS.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: '0 0 calc(50% - 12px)',

                  sm: '0 0 calc(50% - 12px)',

                  md: '0 0 250px',
                },
              }}
            >
              <StatsCard item={item} index={index} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

// --------------------------------------------

function StatsCard({ item, index }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 160,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid white',
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={`${CONFIG.assetsDir}/assets/images/home/section-4/group-${index + 1}.png`}
        alt={item.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Overlay */}
      {/* <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
        }}
      /> */}

      {/* Content */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          p: 2.5,

          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',

          textAlign: 'center',
        }}
      >
        {/* Count */}
        <Typography variant="h3" fontWeight={700} sx={{ color: '#fff' }}>
          {item.count}
        </Typography>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            opacity: 0.9,
            mt: 0.5,
          }}
        >
          {item.title}
        </Typography>
      </Box>
    </Box>
  );
}
