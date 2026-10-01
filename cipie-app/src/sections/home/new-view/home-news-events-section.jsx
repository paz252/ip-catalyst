import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { NEWS_DATA, UPCOMING_EVENTS_DATA } from 'src/config/news-data';

import { Iconify } from 'src/components/iconify';

import { AutoScroll } from '../wrapper/home-auto-scroll';

export function HomeNewsEventsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return undefined;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 5 },
        px: { xs: 2, md: 8, lg: 10 },
        // py: { xs: 6, md: 10 },
        // px: { xs: 2, md: 6 },
        background: `
          url(${CONFIG.assetsDir}/assets/images/home/news-events/background-1.jpg)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1.2fr 1fr 1fr',
          },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        {/* ================= NEWS ================= */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h3" fontWeight={700} mb={1}>
            News & Announcements
          </Typography>

          <Card sx={cardStyle}>
            <AutoScroll height={325} sx={autoscrollStyle} speed={0.5}>
              <Stack spacing={2}>
                {NEWS_DATA.map((event, index) => (
                  <NewsItem key={index} news={event} />
                ))}
              </Stack>
            </AutoScroll>

            <Button
              size="small"
              sx={linkBtn}
              component={RouterLink}
              to="/news"
              endIcon={<Iconify icon="flowbite:arrow-right-outline" width={20} />}
            >
              View All
            </Button>
          </Card>
        </Box>

        {/* ================= EVENTS ================= */}
        <Box
          sx={{
            gridColumn: { xs: 'auto', md: 'span 2' }, // 👈 spans both event columns
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography variant="h3" fontWeight={700} mb={1}>
              Events
            </Typography>
            <Button
              size="large"
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                // mt: 2,
                fontWeight: 600,
                // color: 'primary.main',
                color: '#1976d2',
              }}
              component={RouterLink}
              to="/events"
              endIcon={<Iconify icon="flowbite:arrow-right-outline" width={25} />}
            >
              View All
            </Button>
          </Stack>

          {/* MOBILE SLIDER */}
          {isMobile ? (
            <>
              <Box sx={{ position: 'relative' }}>
                <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex' }}>
                    {UPCOMING_EVENTS_DATA.map((item) => (
                      <Box
                        key={item.title}
                        sx={{
                          flex: '0 0 100%',
                          minWidth: 0,
                        }}
                      >
                        <EventsCard item={item} />
                      </Box>
                    ))}
                  </Box>
                </Box>
                {/* Arrows BELOW */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    mt: 4,
                  }}
                >
                  <IconButton
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    sx={{
                      transform: 'translateY(-50%)',
                      bgcolor: '#fff',
                      boxShadow: 2,
                      opacity: canScrollPrev ? 1 : 0.3,
                      cursor: canScrollPrev ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Iconify icon="eva:arrow-ios-back-fill" />
                  </IconButton>

                  <IconButton
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    sx={{
                      transform: 'translateY(-50%)',
                      bgcolor: '#fff',
                      boxShadow: 2,
                      opacity: canScrollNext ? 1 : 0.3,
                      cursor: canScrollNext ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Iconify icon="eva:arrow-ios-forward-fill" />
                  </IconButton>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                  },
                  gap: 3,
                  height: '100%',
                }}
              >
                <EventsCard item={UPCOMING_EVENTS_DATA[0]} />
                <EventsCard item={UPCOMING_EVENTS_DATA[1]} />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function GalleryNewsItem({ news }) {
  return (
    <>
      <Box
        component={RouterLink}
        to={`/news/${news.slug}`}
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
            {news.title}
          </Typography>
          {news.isNew && <BlinkBadge />}
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {news.date}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />
    </>
  );
}

function NewsListItem({ news }) {
  // console.log(news);
  return (
    <>
      <Box
        component={RouterLink}
        // to={`/innovation/${news.domain}/${news.category}/news/${news.slug}`}
        to={`/news/${news.slug}`}
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
            {news.title}
          </Typography>
          {news.patentStatus && <StatusBadge status="Granted" />}
          {news.isNew && <BlinkBadge />}
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {news.date}
        </Typography>

        {news.patentNo && news.applicationNo && (
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            {news.patentNo && (
              <Chip
                size="small"
                label={`Patent: ${news.patentNo}`}
                color="primary"
                variant="soft"
              />
            )}
            {news.applicationNo && (
              <Chip
                size="small"
                label={`Application: ${news.applicationNo}`}
                color="info"
                variant="soft"
              />
            )}
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />
    </>
  );
}

function NewsItem({ news }) {
  return <NewsListItem news={news} />;
}

function EventsCard({ item }) {
  const isExternal = !item.link.startsWith('/');
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',

        height: '100%', // ✅ ensures equal height
        display: 'flex',
        flexDirection: 'column',

        transition: 'all 0.25s ease',

        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* IMAGE */}
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/images/home/news-events/events/${item.image}`}
          alt={item.title}
          sx={{
            width: '100%',
            height: 180, // reduced for balance
            objectFit: 'cover',
          }}
        />

        {item.isNew && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: '#e41e2b',
              color: '#fff',
              fontSize: 12,
              px: 1.2,
              py: 0.4,
              borderRadius: 1,
              fontWeight: 600,
              animation: 'blink 1.2s infinite',
              '@keyframes blink': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.3 },
              },
            }}
          >
            NEW
          </Box>
        )}
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 2.5, flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} mb={1}>
          {item.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Meta icon="mdi:calendar" text={item.date} />
          <Meta icon="mdi:map-marker" text={item.location} />
        </Stack>
      </Box>

      {/* CTA */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          sx={linkBtn}
          size="small"
          component={isExternal ? 'a' : RouterLink}
          {...(isExternal
            ? {
                href: item.link,
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {
                to: item.link,
              })}
          endIcon={<Iconify icon="flowbite:arrow-right-outline" width={20} />}
        >
          Read More
        </Button>
        {/* <Button
          sx={linkBtn}
          size="small"
          component="a"
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read More
          <Iconify icon="flowbite:arrow-right-outline" width={20} sx={{ color: '#2085e8' }} />
        </Button> */}
      </Box>
    </Card>
  );
}

const cardStyle = {
  p: 3,
  borderRadius: 3,
  border: (theme) => `1px solid ${theme.palette.divider}`,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const autoscrollStyle = {
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
    zIndex: 1,
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

function Meta({ icon, text }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Iconify icon={icon} width={16} />
      <Typography variant="caption">{text}</Typography>
    </Stack>
  );
}

const linkBtn = {
  // mt: 2,
  fontWeight: 600,
  // color: 'primary.main',
  color: '#1976d2',
};

function BlinkBadge() {
  return (
    <Box
      sx={{
        px: 0.9,
        py: 0.3,
        fontSize: 10,
        fontWeight: 600,
        borderRadius: 1,
        bgcolor: '#e41e2b',
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
