import { Box, IconButton } from '@mui/material';

import Iconify from 'src/components/iconify';
import { useCarousel } from 'src/components/carousel';

export function TechnologyCarousel({ children }) {
  const carousel = useCarousel({ loop: false, align: 'start', slidesToScroll: 1 }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Arrows */}
      <IconButton
        onClick={carousel.onPrev}
        sx={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" />
      </IconButton>

      <IconButton
        onClick={carousel.onNext}
        sx={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': { bgcolor: 'background.paper' },
        }}
      >
        <Iconify icon="eva:arrow-ios-forward-fill" />
      </IconButton>

      {/* Carousel Track */}
      <Box ref={carousel.carouselRef} sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
