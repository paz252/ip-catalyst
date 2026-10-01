import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Chip,
  // Container,
  IconButton,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

const SLIDES = [
  // Static banner
  {
    id: 1,
    type: 'banner',
    // title: 'Logo Design Competition',
    // description:
    //   'Create a unique, meaningful and inspiring logo for Center for Intellectual Property and Innovation Exchange(CIP-IE)',
    // chipDesc: '',
    image: '/assets/images/home/banner/banner-6.png',
    imageMobile: '/assets/images/home/banner/logo-challenge-mobile.png',
    // button: 'Click Here',
    path: paths.challenge.logo,
  },
  {
    id: 2,
    type: 'content',
    title: 'Launch of IP Catalyst',
    description:
      'A MeitY Initiative Enabling Innovation, Technology Transfer & Commercialization for startups, MSMEs, MeitY R&D societies and grantee institutions.',
    chipDesc: "Powering India's Innovation Ecosystem",
    image: '/assets/images/home/banner/banner-4.jpg',
    imageMobile: '/assets/images/home/banner/Ip-Catalyst.webp',
    path: '/auth/jwt/sign-in?returnTo=%2Fdashboard',
    button: 'Get Started',

    overlay: 'rgba(0,0,0,0.25)',
    accent: '#f7d798',
    buttonGradient: ['#845ef7', '#5f3dc4'],
    buttonColor: ['#ee7070', '#ec7a7a'],
  },
  {
    id: 3,
    type: 'content',
    title: 'Co-Creating the Future Through Open Innovation',
    description:
      'A collaborative platform bringing together MeitY technologies, startups, academia, R&D institutions, and industry for commercialization and real-world impact.',
    chipDesc: "Powering India's Innovation Ecosystem",
    image: '/assets/images/home/banner/banner-1.jpg',
    imageMobile: '/assets/images/home/banner/Ip-Catalyst.webp',
    path: paths.innovationApplication.category('ict', 'computer-technology'),
    button: 'Get Started',

    overlay: 'rgba(0,0,0,0.35)',
    accent: '#74c0fc',
    buttonGradient: ['#7b61ff', '#5a43d6'],
    buttonColor: ['#0d6efd', '#0d5efd'],
  },
  {
    id: 4,
    type: 'content',
    title: 'Empowering Innovation',
    description:
      'Accelerating innovation by connecting breakthrough technologies, industry opportunities, startups, researchers, and strategic collaborations on a unified national platform.',
    chipDesc: "Powering India's Innovation Ecosystem",
    image: '/assets/images/home/banner/banner-2.jpg',
    imageMobile: '/assets/images/home/banner/Ip-Catalyst.webp',
    path: '/auth/jwt/sign-in?returnTo=%2Fdashboard',
    button: 'Get Started',

    overlay: 'rgba(0,0,0,0.35)',
    accent: '#e48ae5',
    buttonGradient: ['#7b61ff', '#5a43d6'],
    buttonColor: ['#bd53bf', '#c434c7'],
  },
  {
    id: 5,
    type: 'content',
    title: 'Where Research Meets Industry Needs',
    description:
      'A national platform showcasing MeitY technologies, enabling open innovation, and connecting industry challenges with innovation-driven solutions.',
    chipDesc: "Powering India's Innovation Ecosystem",
    image: '/assets/images/home/banner/banner-3.jpg',
    imageMobile: '/assets/images/home/banner/Ip-Catalyst.webp',
    path: paths.technologies.details('ict', 'high-performance-computing-hpc'),
    button: 'Learn More',

    overlay: 'rgba(0,0,0,0.25)',
    accent: '#72c0ff',
    buttonGradient: ['#845ef7', '#5f3dc4'],
    buttonColor: ['#247eff', '#0d7efd'],
  },
];

export function HomeHeroCarousel() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const visibleSlides = useMemo(
    () =>
      SLIDES.filter((slide) => {
        // Hide desktop-only static banners on mobile
        if (isMobile && slide.type === 'banner' && !slide.imageMobile) {
          return false;
        }

        return true;
      }),
    [isMobile]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Re-initialize Embla when mobile/desktop slides change
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.reInit();
    setSelectedIndex(0);
    emblaApi.scrollTo(0, true);
  }, [emblaApi, visibleSlides]);

  const scrollPrev = () => emblaApi?.scrollPrev();

  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Carousel */}
      <Box
        ref={emblaRef}
        sx={{
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          {visibleSlides.map((slide) => (
            <Box
              key={slide.id}
              sx={{
                flex: '0 0 100%',
                position: 'relative',
                // width: '100%',

                // Content slides use controlled responsive height
                // ...(slide.type === 'content'
                //   ? {
                height: {
                  xs: 450,
                  md: 560,
                },
                // height: {
                //   xs: '600px !important',
                //   md: '550px !important',
                //   lg: '600px !important',
                //   xl: '750px !important',
                // },
                // }
                // : {
                //     // Static banner follows its own image ratio
                //     aspectRatio: '1877 / 838',
                //   }),

                display: 'flex',
                alignItems: 'center',
                color: '#fff',
              }}
            >
              {/* ========================= */}
              {/* Background Image */}
              {/* ========================= */}

              {slide.type === 'content' ? (
                <Box
                  component="picture"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                  }}
                >
                  {slide.imageMobile && (
                    <source media="(max-width: 600px)" srcSet={slide.imageMobile} />
                  )}

                  <Box
                    component="img"
                    src={slide.image}
                    alt={slide.title || 'Banner'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      // objectFit: 'cover',
                      objectFit: slide.type === 'banner' ? 'contain' : 'cover',
                      objectPosition: 'top',
                    }}
                  />
                </Box>
              ) : (
                <Box
                  component="img"
                  src={isMobile && slide.imageMobile ? slide.imageMobile : slide.image}
                  alt="Banner"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                  }}
                />
              )}

              {/* ========================= */}
              {/* Content Slide */}
              {/* ========================= */}

              {slide.type === 'content' && (
                <>
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(
                        90deg,
                        ${slide.overlay} 10%,
                        rgba(0,0,0,0.05) 70%
                      )`,
                    }}
                  />

                  {/* Content */}
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 2,
                      width: '100%',

                      display: 'flex',
                      alignItems: 'center',

                      justifyContent: {
                        xs: 'center',
                        md: 'flex-start',
                      },

                      px: {
                        xs: 2,
                        sm: 4,
                        md: 8,
                        lg: 12,
                        xl: 12,
                      },

                      textAlign: {
                        xs: 'center',
                        md: 'left',
                      },
                    }}
                  >
                    <Stack
                      spacing={4}
                      maxWidth={600}
                      alignItems={{
                        xs: 'center',
                        md: 'flex-start',
                      }}
                    >
                      {/* Chip */}
                      <Chip
                        label={slide.chipDesc}
                        sx={{
                          bgcolor: slide.accent,
                          fontWeight: 500,
                          marginTop: 3,
                        }}
                      />

                      {/* Title */}
                      <Typography
                        sx={{
                          fontSize: {
                            xs: 28,
                            md: 38,
                          },
                          fontWeight: 800,
                          lineHeight: 1.2,
                          background: `linear-gradient(
                            180deg,
                            #ffffff 0%,
                            ${slide.accent} 100%
                          )`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {slide.title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        sx={{
                          color: '#ffffff',
                          opacity: 0.9,
                          fontSize: {
                            xs: 14,
                            md: 15,
                          },
                          maxWidth: {
                            xs: '90%',
                            sm: 420,
                            md: 520,
                          },
                          lineHeight: 1.6,
                        }}
                      >
                        {slide.description}
                      </Typography>

                      {/* Button */}
                      <Button
                        component={RouterLink}
                        to={slide.path}
                        variant="contained"
                        size="medium"
                        sx={{
                          mt: {
                            xs: 2,
                            md: 2,
                          },
                          borderRadius: '10px',
                          bgcolor: slide.buttonColor[0],
                          '&:hover': {
                            bgcolor: slide.buttonColor[1],
                          },
                          px: 2,
                        }}
                      >
                        {slide.button}
                      </Button>
                    </Stack>
                  </Box>
                </>
              )}

              {/* ========================= */}
              {/* Static Banner Click Area */}
              {/* ========================= */}

              {slide.type === 'banner' && (
                <Box
                  component={RouterLink}
                  to={slide.path}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ========================= */}
      {/* Arrows */}
      {/* ========================= */}

      <IconButton
        onClick={scrollPrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 16,
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0,0,0,0.4)',
          color: '#fff',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.6)',
          },
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" />
      </IconButton>

      <IconButton
        onClick={scrollNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 16,
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(0,0,0,0.4)',
          color: '#fff',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.6)',
          },
        }}
      >
        <Iconify icon="eva:arrow-ios-forward-fill" />
      </IconButton>

      {/* ========================= */}
      {/* Dots */}
      {/* ========================= */}

      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {visibleSlides.map((slide, index) => (
          <Box
            key={slide.id}
            onClick={() => emblaApi?.scrollTo(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              cursor: 'pointer',
              bgcolor: selectedIndex === index ? '#0d6efd' : 'rgba(255,255,255,0.5)',
              transition: '0.3s',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

// export function HomeHeroCarousel() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   const visibleSlides = useMemo(
//     () =>
//       SLIDES.filter((slide) => {
//         // Hide desktop-only static banners on mobile
//         if (isMobile && slide.type === 'banner' && !slide.imageMobile) {
//           return false;
//         }

//         return true;
//       }),
//     [isMobile]
//   );

//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
//     Autoplay({ delay: 6000, stopOnInteraction: false }),
//   ]);

//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     emblaApi.on('select', onSelect);
//     onSelect();

//     return () => {
//       emblaApi.off('select', onSelect);
//     };
//   }, [emblaApi, onSelect]);

//   useEffect(() => {
//     if (!emblaApi) return;

//     emblaApi.reInit();
//     setSelectedIndex(0);
//     emblaApi.scrollTo(0, true);
//   }, [emblaApi, visibleSlides]);

//   const scrollPrev = () => emblaApi?.scrollPrev();
//   const scrollNext = () => emblaApi?.scrollNext();

//   return (
//     <Box sx={{ position: 'relative', overflow: 'hidden' }}>
//       {/* Carousel */}
//       <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
//         <Box sx={{ display: 'flex' }}>
//           {SLIDES.map((slide) => (
//             <Box
//               key={slide.id}
//               sx={{
//                 flex: '0 0 100%',
//                 position: 'relative',
//                 // height: {
//                 //   xs: 450, // mobile taller 520
//                 //   md: 430, // desktop exact 454 354,
//                 // },

//                 // Content slides use controlled responsive height
//                 ...(slide.type === 'content'
//                   ? {
//                       height: {
//                         xs: 450,
//                         md: 430,
//                       },
//                     }
//                   : {
//                       // Static banner follows its own image ratio
//                       aspectRatio: '1877 / 838',
//                     }),

//                 display: 'flex',
//                 alignItems: 'center',
//                 color: '#fff',
//               }}
//             >
//               {/* Background Image */}
//               <Box
//                 component="picture"
//                 sx={{
//                   position: 'absolute',
//                   inset: 0,
//                 }}
//               >
//                 {/* {slide.imageMobile && ( */}
//                 <source media="(max-width:600px)" srcSet={slide.imageMobile} />
//                 {/* )} */}
//                 <Box
//                   component="img"
//                   src={slide.image}
//                   alt={slide.title}
//                   sx={{
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover',
//                     objectPosition: 'top',
//                   }}
//                 />
//               </Box>

//               {slide.type === 'content' && (
//                 <>
//                   {/* Overlay */}
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       inset: 0,
//                       // background: 'linear-gradient(90deg, rgba(0,0,0,0.75) 25%, rgba(0,0,0,0.1) 70%)',
//                       // background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 20%, rgba(0,0,0,0.05) 70%)',
//                       background: `linear-gradient(90deg, ${slide.overlay} 10%, rgba(0,0,0,0.05) 70%)`,
//                     }}
//                   />

//                   {/* Content */}
//                   {/* <Container
//                 sx={{
//                   position: 'relative',
//                   zIndex: 2,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: {
//                     xs: 'center', // center on mobile
//                     md: 'flex-start', // left align on desktop
//                   },
//                   textAlign: {
//                     xs: 'center',
//                     md: 'left',
//                   },
//                 }}
//               > */}
//                   <Box
//                     sx={{
//                       position: 'relative',
//                       zIndex: 2,
//                       width: '100%',

//                       display: 'flex',
//                       alignItems: 'center',

//                       justifyContent: {
//                         xs: 'center',
//                         md: 'flex-start',
//                       },

//                       px: {
//                         xs: 2,
//                         sm: 4,
//                         md: 8,
//                         lg: 12, // pushes content nicely on large screens
//                         xl: 12, // handles ultra-wide screens
//                       },

//                       textAlign: {
//                         xs: 'center',
//                         md: 'left',
//                       },
//                     }}
//                   >
//                     <Stack
//                       spacing={4} //2
//                       maxWidth={600}
//                       alignItems={{
//                         xs: 'center',
//                         md: 'flex-start',
//                       }}
//                     >
//                       {/* Chip */}
//                       <Chip
//                         label={slide.chipDesc}
//                         sx={{
//                           // bgcolor: '#bce1ff',
//                           // color: '#003a8c',
//                           bgcolor: slide.accent,
//                           fontWeight: 500,
//                           marginTop: 3,
//                         }}
//                       />

//                       {/* Title */}
//                       <Typography
//                         sx={{
//                           // fontSize: { xs: 28, md: 48 },
//                           fontSize: { xs: 28, md: 38 },
//                           fontWeight: 800,
//                           lineHeight: 1.2,
//                           background: `linear-gradient(180deg, #ffffff 0%,  ${slide.accent} 100%)`,
//                           WebkitBackgroundClip: 'text',
//                           WebkitTextFillColor: 'transparent',
//                         }}
//                       >
//                         {slide.title}
//                       </Typography>

//                       {/* Description */}
//                       <Typography
//                         // variant="h5"
//                         sx={{
//                           color: '#ffffff',
//                           opacity: 0.9,
//                           // fontSize: { xs: 14, md: 20 },
//                           fontSize: { xs: 14, md: 15 },
//                           maxWidth: {
//                             xs: '90%', // mobile → forces wrapping
//                             sm: 420,
//                             md: 520, // desktop → controlled width
//                           },

//                           lineHeight: 1.6,
//                         }}
//                       >
//                         {slide.description}
//                       </Typography>

//                       {/* Button */}
//                       <Button
//                         component={RouterLink}
//                         to={slide.path}
//                         variant="contained"
//                         size="medium"
//                         sx={{
//                           mt: { xs: 2, md: 2 },
//                           borderRadius: '10px',
//                           bgcolor: slide.buttonColor[0],
//                           '&:hover': { bgcolor: slide.buttonColor[1] },
//                           px: 2,
//                         }}
//                       >
//                         {slide.button}
//                       </Button>
//                     </Stack>
//                   </Box>
//                 </>
//               )}

//               {slide.type === 'banner' && (
//                 <Box
//                   component={RouterLink}
//                   to={slide.path}
//                   sx={{
//                     position: 'absolute',
//                     inset: 0,
//                     zIndex: 2,
//                   }}
//                 />
//               )}
//               {/* </Container> */}
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* Arrows */}
//       <IconButton
//         onClick={scrollPrev}
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           left: 16,
//           transform: 'translateY(-50%)',
//           bgcolor: 'rgba(0,0,0,0.4)',
//           color: '#fff',
//           '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
//         }}
//       >
//         <Iconify icon="eva:arrow-ios-back-fill" />
//       </IconButton>

//       <IconButton
//         onClick={scrollNext}
//         sx={{
//           position: 'absolute',
//           top: '50%',
//           right: 16,
//           transform: 'translateY(-50%)',
//           bgcolor: 'rgba(0,0,0,0.4)',
//           color: '#fff',
//           '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
//         }}
//       >
//         <Iconify icon="eva:arrow-ios-forward-fill" />
//       </IconButton>

//       {/* Dots */}
//       <Stack
//         direction="row"
//         spacing={1}
//         sx={{
//           position: 'absolute',
//           bottom: 16,
//           left: '50%',
//           transform: 'translateX(-50%)',
//         }}
//       >
//         {SLIDES.map((_, index) => (
//           <Box
//             key={index}
//             onClick={() => emblaApi?.scrollTo(index)}
//             sx={{
//               width: 10,
//               height: 10,
//               borderRadius: '50%',
//               cursor: 'pointer',
//               bgcolor: selectedIndex === index ? '#0d6efd' : 'rgba(255,255,255,0.5)',
//               transition: '0.3s',
//             }}
//           />
//         ))}
//       </Stack>
//     </Box>
//   );
// }
