import { Box, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

export function HomeWhoCanApplySection() {
  const DATA = [
    {
      title: 'Startups',
      subtitle: 'DPIIT Recognized',
    },
    {
      title: 'MSMEs',
      subtitle: 'Udyam Registered',
    },
    {
      title: 'MeitY',
      subtitle: 'Societies / Autonomous Bodies',
    },
    {
      title: 'MeitY',
      subtitle: 'Grantee Institutions',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 5 },
        px: { xs: 2, md: 8, lg: 12, xl: 12 },
        // py: { xs: 6, md: 5 },
        // px: { xs: 2, md: 8 },
        // py: { xs: 6, md: 5 },
        // px: { xs: 2, md: 8, lg: 12 },

        backgroundImage: `url(${CONFIG.assetsDir}/assets/images/home/wca/background.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 4, md: 8 },
        }}
      >
        {/* LEFT */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              //   color: '#000',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Who Can Apply?
          </Typography>
        </Box>

        {/* RIGHT */}
        <Box
          className="dfjf"
          sx={{
            flex: 2,
            // display: 'flex',
            // flexWrap: { xs: 'wrap', md: 'nowrap' },
            // justifyContent: 'space-between',
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)', // 👈 mobile: 2 columns
              md: 'repeat(4, 1fr)', // 👈 desktop: 1 row (4 items)
            },
            textAlign: 'flex-start',
            gap: { xs: 0, md: 2 },
          }}
        >
          {DATA.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: '0 0 50%', // 👈 2 per row on mobile
                  md: '1',
                },

                px: 1,
                py: 1,

                borderRight: {
                  md: index !== DATA.length - 1 ? '1px solid rgba(0,0,0,0.2)' : 'none',
                },
              }}
            >
              {/* Title */}
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                {item.title}
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="body1"
                sx={
                  {
                    //   color: '#666',
                  }
                }
              >
                {item.subtitle}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
