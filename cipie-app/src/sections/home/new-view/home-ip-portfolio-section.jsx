import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Accent color mapping (matches your UI tones)
const ACCENT_MAP = {
  primary: {
    lightBg: 'rgba(255, 192, 203, 0.25)', // pinkish
    border: '#f8bbd0',
  },
  success: {
    lightBg: 'rgba(46, 204, 113, 0.15)', // 👈 green
    border: '#86efac',
  },
  info: {
    lightBg: 'rgba(0, 188, 212, 0.15)',
    border: '#80deea',
  },
  warning: {
    lightBg: 'rgba(255, 152, 0, 0.15)',
    border: '#ffcc80',
  },
};

// const DATA = [
//   {
//     title: 'Domestic Patents',
//     description: 'Patents filed and granted within India',
//     items: [
//       { label: 'Filed', value: 160, icon: 'solar:document-add-bold', color: 'warning' },
//       { label: 'Granted', value: 131, icon: 'solar:verified-check-bold', color: 'secondary' },
//     ],
//     accent: 'primary',
//   },
//   {
//     title: 'International Patents',
//     description: 'Patents filed and granted globally',
//     items: [
//       { label: 'Filed', value: 65, icon: 'solar:document-add-bold', color: 'warning' },
//       { label: 'Granted', value: 60, icon: 'solar:verified-check-bold', color: 'secondary' },
//     ],
//     accent: 'success',
//   },
//   {
//     title: 'Intellectual Property',
//     description: 'Copyrights and trademarks registered',
//     items: [
//       { label: 'Copyright', value: 529, icon: 'solar:copyright-bold', color: 'warning' },
//       { label: 'Trademark', value: 168, icon: 'solar:tag-bold', color: 'secondary' },
//     ],
//     accent: 'info',
//   },
//   {
//     title: 'Technology Transfer',
//     description: 'Copyrights and trademarks registered',
//     items: [
//       {
//         label: 'Technology Transfer',
//         value: 25,
//         icon: 'solar:transfer-horizontal-bold',
//         color: 'warning',
//       },
//       {
//         label: 'Available Technology',
//         value: 234,
//         icon: 'tabler:device-desktop-check',
//         color: 'secondary',
//       },
//     ],
//     accent: 'warning',
//   },
// ];

const DATA = [
  {
    title: 'Domestic Patents',
    description: 'Patents Filed & Granted within India',
    items: [
      // { label: 'Filed', value: 170, icon: 'solar:document-add-bold', color: 'warning' },
      // { label: 'Granted', value: 146, icon: 'solar:verified-check-bold', color: 'secondary' },
      {
        label: 'Filed',
        value: 169,
        icon: 'basil:document-solid',
        color: '#4dabf7',
      },
      { label: 'Granted', value: 145, icon: 'solar:verified-check-bold', color: '#2ecc71' },
    ],
    accent: 'primary',
  },
  {
    title: 'International Patents',
    description: 'Patents Filed & Granted Globally',
    items: [
      { label: 'Filed', value: 84, icon: 'basil:document-solid', color: '#4dabf7' },
      { label: 'Granted', value: 81, icon: 'solar:verified-check-bold', color: '#2ecc71' },
    ],
    accent: 'success',
  },
  {
    title: 'Other IP',
    description: 'Copyrights & Trademarks Registered',
    items: [
      { label: 'Copyright', value: 529, icon: 'solar:copyright-bold', color: '#bf2008' },
      { label: 'Trademark', value: 168, icon: 'solar:tag-bold', color: '#f7912a' },
    ],
    accent: 'info',
  },
  {
    title: 'Technology Transfer',
    description: 'Transferred & Licensable Technology',
    items: [
      {
        label: 'Technology Transfer',
        value: 16,
        icon: 'solar:transfer-horizontal-bold',
        color: '#730fba',
      },
      {
        label: 'Available Technology',
        value: 253,
        icon: 'tabler:device-desktop-check',
        color: '#4dabf7',
      },
    ],
    accent: 'warning',
  },
];
export function HomeIPPortfolioSection() {
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

  // useEffect(() => {
  //   if (!emblaApi) return;

  //   emblaApi.on('select', onSelect);
  //   emblaApi.on('reInit', onSelect);

  //   onSelect(); // initial state

  //   return () => {
  //     emblaApi.off('select', onSelect);
  //     emblaApi.off('reInit', onSelect);
  //   };
  // }, [emblaApi, onSelect]);

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
    <Box sx={{ py: { xs: 6, md: 5 } }}>
      {/* <Box sx={{ maxWidth: 1350, mx: 'auto', px: 2 }}> */}
      <Box
        sx={{
          width: '100%',
          px: {
            xs: 2,
            sm: 4,
            md: 6,
            lg: 8,
            xl: 12, // 👈 expands nicely on big screens
          },
        }}
      >
        {/* Heading */}
        <Stack spacing={1} textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight={700}>
            IP Portfolio Programs
          </Typography>
          <Typography variant="body1">
            Key Statistics on Patents, IP Assets and Technology Licensing
          </Typography>
        </Stack>

        {/* MOBILE SLIDER */}
        {isMobile ? (
          <Box sx={{ position: 'relative' }}>
            <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
              <Box sx={{ display: 'flex' }}>
                {DATA.map((card, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: '0 0 100%',
                      px: 1,
                    }}
                  >
                    <CardItem card={card} />
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

            {/* Arrows */}
            {/* <IconButton
              onClick={scrollPrev}
              sx={{
                position: 'absolute',
                top: '50%',
                left: -10,
                transform: 'translateY(-50%)',
                bgcolor: '#fff',
                boxShadow: 2,
              }}
            >
              <Iconify icon="eva:arrow-ios-back-fill" />
            </IconButton>

            <IconButton
              onClick={scrollNext}
              sx={{
                position: 'absolute',
                top: '50%',
                right: -10,
                transform: 'translateY(-50%)',
                bgcolor: '#fff',
                boxShadow: 2,
              }}
            >
              <Iconify icon="eva:arrow-ios-forward-fill" />
            </IconButton> */}
          </Box>
        ) : (
          /* DESKTOP GRID */
          <Grid container spacing={2}>
            {DATA.map((card, index) => (
              <Grid
                key={index}
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{ display: 'flex', flex: '1 1 260px' }}
              >
                <CardItem card={card} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

/* 🔹 Reusable Card Component */
function CardItem({ card }) {
  const accent = ACCENT_MAP[card.accent];

  return (
    <Card
      sx={{
        width: '100%',
        // maxWidth: 320,
        // mx: 'auto',
        p: 3,
        borderRadius: 2,
        backgroundColor: accent.lightBg,
        border: `1px solid ${accent.border}`,
        boxShadow: 'none',

        minHeight: {
          xs: 300, // mobile height (increase as needed)
          sm: 'auto',
        },
      }}
    >
      <Typography variant="h5" fontWeight={700} mb={0.5} sx={{ fontSize: '1.2875rem !important' }}>
        {card.title}
      </Typography>

      <Typography variant="body2" sx={{ mb: { xs: 4, md: 2 }, display: 'block' }}>
        {card.description}
      </Typography>

      <Stack spacing={1.5}>
        {card.items.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#fff',
              borderRadius: 2,
              px: 2,
              py: 1.5,
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // bgcolor: item.color === 'warning' ? '#4dabf7' : '#2ecc71',
                  bgcolor: item.color,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <Iconify icon={item.icon} width={18} />
              </Box>

              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  fontWeight: 700,
                }}
              >
                {item.label}
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              fontWeight={700}
              sx={{
                color: item.color === 'warning' ? '#2ecc71' : '#6f42c1',
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
