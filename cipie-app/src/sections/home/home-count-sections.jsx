import { Box, Container, Grid, Typography } from '@mui/material';

const STATS_DATA = [
  {
    title: 'Domestic Patents',
    color: '#1A3A6B',
    bgLight: '#E8EFF8',
    items: [
      {
        label: 'Filed',
        value: 160,
        path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      },
      { label: 'Granted', value: 131, path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
  },
  {
    title: 'International Patents',
    color: '#D97706',
    bgLight: '#FEF3C7',
    items: [
      {
        label: 'Filed',
        value: 65,
        path: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        label: 'Granted',
        value: 60,
        path: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      },
    ],
  },
  {
    title: 'Intellectual Property',
    color: '#15803D',
    bgLight: '#DCFCE7',
    items: [
      {
        label: 'Copyright',
        value: 529,
        path: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      },
      {
        label: 'Trademark',
        value: 168,
        path: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      },
    ],
  },
  {
    title: 'Technology Transfer',
    color: '#15803D',
    bgLight: '#DCFCE7',
    items: [
      {
        label: 'Technology Transfer',
        value: 25,
        path: 'M10.25 4a.75.75 0 0 0-1.303-.507l-5.5 6A.75.75 0 0 0 4 10.75h16a.75.75 0 0 0 0-1.5h-9.75zm3.5 16v-5.25H4a.75.75 0 0 1 0-1.5h16a.75.75 0 0 1 .553 1.257l-5.5 6A.75.75 0 0 1 13.75 20',
      },
      {
        label: 'Available Technology',
        value: 234,
        path: 'M12 16H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8m-6 6l2 2l4-4M7 20h4m-2-4v4',
      },
    ],
  },
];

function StatIcon({ path, color, bgLight }) {
  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: bgLight,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    </Box>
  );
}
export function HomeCountSection() {
  return (
    <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #E2E8F0', py: 0 }}>
      <Container maxWidth="xl">
        <Box
          sx={{ display: 'flex', alignItems: 'stretch', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
        >
          {STATS_DATA.map((group, gi) => (
            <Box
              key={group.title}
              sx={{
                flex: 1,
                minWidth: { xs: '100%', md: 0 },
                display: 'flex',
                alignItems: 'stretch',
                borderRight: gi < STATS_DATA.length - 1 ? '1px solid #E2E8F0' : 'none',
              }}
            >
              {/* Group label sidebar */}
              <Box
                sx={{
                  width: 6,
                  flexShrink: 0,
                  //   bgcolor: group.color,
                  borderRadius: '0px',
                }}
              />

              <Box sx={{ flex: 1, py: 2.5, px: 2.5 }}>
                {/* Group title */}
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: group.color,
                    mb: 1.8,
                    opacity: 0.85,
                  }}
                >
                  {group.title}
                </Typography>

                {/* Two stat items side by side */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {group.items.map((item, ii) => (
                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <StatIcon path={item.path} color={group.color} bgLight={group.bgLight} />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '1.55rem',
                            fontWeight: 800,
                            color: '#1C2B3A',
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {item.value.toLocaleString()}
                        </Typography>
                        <Typography
                          sx={{ fontSize: '0.72rem', color: '#64748B', mt: 0.25, fontWeight: 500 }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
