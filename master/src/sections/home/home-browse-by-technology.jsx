import { useNavigate } from 'react-router-dom';

import { Box, Typography, Grid, Card, CardActionArea, Skeleton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetPatentDomainsCount } from 'src/actions/patent';

import { Iconify } from 'src/components/iconify';

// map API labels → route keys
const DOMAIN_KEY_MAP = {
  'Information & Communication Technology': 'ict',
  'Mechanical & Industrial Engineering': 'mech',
  'Materials, Chemical & Nano Sciences': 'mat',
  'Medical & Life Sciences': 'med',
  'Electrical & Electronics Engineering': 'elec',
  'Measurement & Optical Technologies': 'opt',
  'Other Technologies': 'other',
};

const DOMAIN_ICON_MAP = {
  ict: 'material-symbols:laptop-mac-outline',
  mech: 'weui:setting-filled',
  mat: 'iconoir:test-tube-solid',
  med: 'mdi:medical-bag',
  elec: 'material-symbols:bolt',
  opt: 'mdi:microscope',
  other: 'solar:box-bold',
  all: 'solar:chart-2-bold',
};

const DOMAIN_COLOR_MAP = {
  ict: 'primary',
  mech: 'warning',
  mat: 'success',
  med: 'error',
  elec: 'info',
  opt: 'secondary',
  other: 'grey',
  all: 'primary',
};

export function BrowseByTechnology() {
  const navigate = useNavigate();

  const { domains, total, domainsLoading } = useGetPatentDomainsCount();

  // include "All Technologies"
  const formattedDomains = [
    ...(domains || []),
    {
      mainTechnologyDomain: 'All Technologies',
      total,
    },
  ];

  return (
    <Box sx={{ py: { xs: 5, md: 8 } }}>
      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          mb: 5,
        }}
      >
        Browse Patents by Technology
      </Typography>

      <Grid container spacing={3}>
        {(domainsLoading ? Array.from(new Array(8)) : formattedDomains).map((item, index) => {
          if (domainsLoading) {
            return (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Skeleton variant="rounded" height={180} />
              </Grid>
            );
          }

          const label = item.mainTechnologyDomain;
          const count = item.total;

          const key = label === 'All Technologies' ? 'all-technologies' : DOMAIN_KEY_MAP[label];

          return (
            <Grid item xs={6} sm={4} md={1} key={label} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  width: '100%',
                  height: 230, // ✅ fixed height
                  display: 'flex',
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.25s ease',

                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: (theme) => theme.customShadows?.z8,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(paths.innovationApplication.domain(key))}
                  sx={{
                    p: 2.5,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // ✅ center horizontally
                    justifyContent: 'center', // ✅ center vertically
                    textAlign: 'center',
                    gap: 1.5,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={(theme) => {
                      const colorKey = DOMAIN_COLOR_MAP[key] || 'grey';

                      return {
                        width: 60,
                        height: 60,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: theme.palette[colorKey]?.lighter || theme.palette.grey[200],
                        color: theme.palette[colorKey]?.main || theme.palette.grey[700],
                      };
                    }}
                  >
                    <Iconify icon={DOMAIN_ICON_MAP[key]} width={30} />
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.3,
                      width: '100%',
                      maxWidth: 180,
                      minHeight: 60, // ✅ reserves space → keeps cards equal
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {label}
                  </Typography>

                  {/* Count */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {count} patents
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
