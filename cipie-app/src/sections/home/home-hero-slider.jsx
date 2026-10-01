import { m } from 'framer-motion';
import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { varFade } from 'src/components/animate';
import { useCarousel, Carousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

const SLIDES = [
  // {
  //   id: 1,
  //   title: 'Logo Challenge Round - 2026',
  //   description: 'Upload a logo for the challenge and win exciting prizes.',
  //   chipDesc: "Powering India's Innovation Ecosystem",
  //   image: '/assets/images/home/dummy/logo-challenge.jpg',
  //   imageMobile: '/assets/images/home/dummy/logo-challenge.jpg',
  //   button: 'Get Started',
  // },
  {
    id: 2,
    title: 'Empowering Innovation',
    description: 'Manage your patents with confidence and clarity.',
    chipDesc: "Powering India's Innovation Ecosystem",
    image: '/assets/images/home/banner-1.jpg',
    imageMobile: '/assets/images/home/dummy/Ip-Catalyst.webp',
    button: 'Get Started',
  },
  {
    id: 3,
    title: 'Secure Your IP',
    description: 'From filing to granting, we’ve got you covered.',
    chipDesc: "Powering India's Innovation Ecosystem",
    image: '/assets/images/home/banner-1.jpg',
    imageMobile: '/assets/images/home/dummy/Ip-Catalyst.webp',
    button: 'Learn More',
  },
  {
    id: 4,
    title: 'Global Patent Solutions',
    description: 'Protect your ideas worldwide.',
    chipDesc: "Powering India's Innovation Ecosystem",
    image: '/assets/images/home/banner-1.jpg',
    imageMobile: '/assets/images/home/dummy/Ip-Catalyst.webp',
    button: 'Explore Services',
  },
  {
    id: 5,
    title: 'Global Patent Solutions',
    description: 'Protect your ideas worldwide.',
    chipDesc: "Powering India's Innovation Ecosystem",
    image: '/assets/images/home/banner-1.jpg',
    imageMobile: '/assets/images/home/dummy/Ip-Catalyst.webp',
    button: 'Explore Services',
  },
];
export function HomeHeroSlider() {
  const carousel = useCarousel({ loop: true }, [Autoplay({ playOnInit: true, delay: 4000 })]);

  // console.log(carousel);
  return (
    <Box
      className="main-container"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',

        aspectRatio: {
          xs: '16 / 9',
          md: '16 / 7',
        },

        // fallback for small screens / weird cases
        minHeight: {
          xs: 320,
          // sm: 380,
          md: 450,
        },
      }}
    >
      <Carousel
        carousel={carousel}
        sx={{
          height: '100%',
          '& .slick-list, & .slick-track': {
            height: '100%',
          },
        }}
      >
        {SLIDES.map((slide) => (
          <Box key={slide.id} sx={{ position: 'relative', height: '100%' }}>
            {/* Image */}
            {/* <Box
              component="img"
              src={slide.image}
              alt={slide.title}
              sx={{
                width: 1,
                height: '100%',
                objectFit: 'cover',
              }}
            /> */}

            <Box
              component="picture"
              sx={{
                width: 1,
                height: '100%',
                display: 'block',
              }}
            >
              {/* Mobile Image */}
              <source media="(max-width:600px)" srcSet={slide.imageMobile} />

              {/* Default / Desktop Image */}
              <Box
                component="img"
                src={slide.image}
                alt={slide.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>

            {/* Overlay */}
            <Box
              sx={(theme) => ({
                position: 'absolute',
                inset: 0,
                // background: `linear-gradient(
                //   90deg,
                //   ${alpha(theme.palette.grey[900], 0.6)} 0%,
                //   ${alpha(theme.palette.grey[900], 0.25)} 50%,
                //   transparent 100%
                // )`,
                background: {
                  xs: `linear-gradient(
                        to top,
                        rgba(0,0,0,0.7),
                        rgba(0,0,0,0.2)
                    )`,
                  md: `linear-gradient(
                        90deg,
                        rgba(0,0,0,0.7),
                        rgba(0,0,0,0.3),
                        transparent
                    )`,
                },
              })}
            />

            {/* Content */}
            <Container
              className="banner-container"
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                px: { xs: 2, sm: 4, md: 6 },
              }}
            >
              <Stack
                spacing={{ xs: 2, md: 3 }}
                maxWidth={{ xs: '90%', sm: 420, md: 520 }}
                sx={{ textAlign: { xs: 'center', md: 'left' } }}
              >
                {/* <m.div variants={varFade('inUp')}> */}
                <Chip
                  label={slide.chipDesc}
                  size="small"
                  color="info"
                  variant="soft"
                  sx={{
                    // mt: 0.5,
                    // height: 18,
                    // fontSize: '0.68rem',
                    bgcolor: '#E8EFF8',
                    color: '#1A3A6B',
                  }}
                />
                {/* </m.div> */}
                <m.div variants={varFade('inUp')}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: 'common.white',
                      fontWeight: 800,
                      lineHeight: 1.2,
                      fontSize: {
                        xs: 20,
                        sm: 28,
                        md: 40,
                        lg: 48,
                      },
                    }}
                  >
                    {slide.title}
                  </Typography>
                </m.div>

                <m.div variants={varFade('inUp')}>
                  <Typography
                    variant="body1"
                    sx={{ color: alpha('#fff', 0.85), fontSize: { xs: 14, sm: 16 } }}
                  >
                    {slide.description}
                  </Typography>
                </m.div>

                {/* Cta button */}
                <m.div variants={varFade('inUp')} className="carousel-cta">
                  <Button
                    size="large"
                    variant="contained"
                    sx={{
                      alignSelf: { xs: 'center', md: 'flex-start' },
                      width: { xs: '70%', sm: 'auto' },
                      px: { xs: 1, sm: 4, md: 4 },
                      py: { xs: 1, sm: 2, md: 1.5 },
                      borderRadius: 2,
                      fontSize: { xs: 14, sm: 16 },
                    }}
                  >
                    {slide.button}
                  </Button>
                </m.div>
              </Stack>
            </Container>
          </Box>
        ))}
      </Carousel>

      {/* Left arrow */}
      <IconButton
        className="carousel-arrow carousel-arrow-left"
        onClick={carousel.arrows.onClickPrev}
        sx={(theme) => ({
          display: { xs: 'none', md: 'flex' },
          position: 'absolute',
          top: '40%',
          transform: 'translateY(-50%)',
          left: { xs: 8, md: 16 },
          width: { xs: 32, md: 40 },
          height: { xs: 32, md: 40 },
          bgcolor: alpha(theme.palette.common.white, 0.12),
          backdropFilter: 'blur(8px)',
          color: 'common.white',
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: alpha(theme.palette.common.white, 0.25),
            transform: 'translateY(-50%) scale(1.1)',
          },
        })}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={24} />
      </IconButton>

      {/* Right arrow */}
      <IconButton
        onClick={carousel.arrows.onClickNext}
        sx={(theme) => ({
          display: { xs: 'none', md: 'flex' },
          position: 'absolute',
          top: '40%',
          transform: 'translateY(-50%)',
          right: { xs: 8, md: 16 },
          width: { xs: 32, md: 40 },
          height: { xs: 32, md: 40 },
          bgcolor: alpha(theme.palette.common.white, 0.12),
          backdropFilter: 'blur(8px)',
          color: 'common.white',
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: alpha(theme.palette.common.white, 0.25),
            transform: 'translateY(-50%) scale(1.1)',
          },
        })}
      >
        <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
      </IconButton>

      {/* Dots */}
      {/* <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          px: 1.5,
          py: 0.8,
          borderRadius: 2,
          backdropFilter: 'blur(4px)',
          backgroundColor: (theme) => alpha(theme.palette.common.black, 0.25),
        }}
      >
        {SLIDES.map((_, index) => (
          <Box
            key={index}
            onClick={() => carousel.dots.onClickDot(index)}
            sx={(theme) => ({
              width: 8,
              height: 8,
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              bgcolor:
                carousel.currentIndex === index
                  ? theme.palette.primary.main
                  : alpha(theme.palette.common.white, 0.6),

              transform: carousel.currentIndex === index ? 'scale(1.4)' : 'scale(1)',
            })}
          />
        ))}
      </Stack> */}
    </Box>
  );
}
