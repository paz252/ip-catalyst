import { useNavigate } from 'react-router-dom';

import { Box, Typography, IconButton, Card, CardActionArea, Skeleton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetPatentDomainsCount } from 'src/actions/patent';

import { Iconify } from 'src/components/iconify';
import { Carousel, CarouselArrowBasicButtons, useCarousel } from 'src/components/carousel';

// Map backend label → route key
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
  'all-technologies': 'solar:chart-2-bold',
};

const DOMAIN_COLOR_MAP = {
  ict: 'primary',
  mech: 'warning',
  mat: 'success',
  med: 'error',
  elec: 'info',
  opt: 'secondary',
  other: 'grey',
  'all-technologies': 'primary',
};

// const DOMAIN_ORDER = ['ict', 'mech', 'mat', 'med', 'elec', 'opt', 'other', 'all-technologies'];

export function BrowseTechnologyCarousel() {
  const navigate = useNavigate();
  const { domains, total, domainsLoading } = useGetPatentDomainsCount();

  const carousel = useCarousel({ loop: false, align: 'start' });
  //   console.log(`carousel`, carousel);

  const data = domainsLoading
    ? Array.from(new Array(6))
    : [...(domains || []), { mainTechnologyDomain: 'All Technologies', total }];

  // console.log(carousel.mainRef);
  return (
    <Box
      sx={{
        py: { xs: 5, md: 8 },
        px: 4,
        position: 'relative',
        background: 'linear-gradient(180deg, #FFF 50%, hsl(210, 100%, 96%) 100%);',
      }}
    >
      {/* Heading */}
      <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 2 }}>
        Browse Patents by Technology
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        {/* Left spacer (keeps alignment) */}
        <Box />

        {/* Arrows */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={carousel.arrows.onClickPrev}
            disabled={carousel.arrows.disablePrev}
            sx={{
              width: 36,
              height: 36,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',

              '&:hover': {
                bgcolor: 'grey.100',
              },

              '&.Mui-disabled': {
                opacity: 0.4,
              },
            }}
          >
            <Iconify icon="eva:arrow-ios-back-fill" width={18} />
          </IconButton>

          <IconButton
            onClick={carousel.arrows.onClickNext}
            disabled={carousel.arrows.disableNext}
            sx={{
              width: 36,
              height: 36,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',

              '&:hover': {
                bgcolor: 'grey.100',
              },

              '&.Mui-disabled': {
                opacity: 0.4,
              },
            }}
          >
            <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
          </IconButton>
        </Box>
      </Box>

      {/* Carousel */}
      <Box ref={carousel.mainRef} sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', gap: 1.2 }}>
          {data.map((item, index) => {
            if (domainsLoading) {
              return (
                <Box
                  key={index}
                  sx={{ flex: '0 0 auto', width: { xs: '80%', sm: '45%', md: '23%' } }}
                >
                  <Skeleton variant="rounded" height={200} />
                </Box>
              );
            }

            const label = item.mainTechnologyDomain;
            const count = item.total;

            const key = label === 'All Technologies' ? 'all-technologies' : DOMAIN_KEY_MAP[label];

            const colorKey = DOMAIN_COLOR_MAP[key] || 'grey';

            return (
              <Box
                key={label}
                sx={{
                  flex: '0 0 auto',
                  width: { xs: '45%', sm: '45%', md: '19%' },
                  marginLeft: { xs: 2, md: 0.7 },
                }}
              >
                <Card
                  sx={{
                    height: { xs: 200, md: 230 },
                    borderRadius: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    transition: 'all 0.25s ease',

                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: (theme) => `0 8px 20px ${theme.palette[colorKey]?.main}20`,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(paths.innovationApplication.domain(key))}
                    sx={{
                      p: 2,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: 1.2,
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={(theme) => ({
                        width: 60,
                        height: 60,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: theme.palette[colorKey]?.lighter || theme.palette.grey[200],
                        color: theme.palette[colorKey]?.main || theme.palette.grey[700],
                      })}
                    >
                      <Iconify icon={DOMAIN_ICON_MAP[key]} width={30} />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                        minHeight: 60,
                        width: '100%',
                        maxWidth: 160,
                        // minHeight: 60,
                        display: '-webkit-box',
                        // WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {label}
                    </Typography>

                    {/* Count */}
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {count} Patents
                    </Typography>
                  </CardActionArea>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
