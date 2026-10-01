import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

// import { RouterLink } from 'src/routes/components';

const STORIES = [
  {
    id: 1,
    title:
      'C-DAC Completes Transfer of Technology for VIVAN – Brain-Computer Interface (BCI) to Aerobe Pvt. Ltd.',
    description:
      'C-DAC has always believed in bridging the gap between laboratory research and real-world impact. True to this spirit, C-DAC Delhi has achieved a significant milestone with the successful Transfer of Technology (ToT) of VIVAN – Brain-Computer Interface (BCI) to Aerobe Pvt. Ltd. — placing the institute firmly at the neural frontier of assistive neurotechnology and reinforcing its commitment to inclusive, indigenous innovation.',
    path: 'wall-of-fame',
    image: 'wof-4.jpg',
  },
  {
    id: 2,
    title:
      "Prama India and Government of India's C-DAC (MeitY) Announce Partnership for Thermal Camera Technology",
    description:
      'Prama India and Government of India’s C-DAC (MeitY) recently announced a technology partnership through the ‘Transfer of Technology’ (ToT) Pact for Thermal Cameras with Centre for Development of Advanced Computing (C-DAC), Ministry of Electronics & Information Technology (MeitY), Government of India. The ToT (Transfer of Technology) agreement with (C-DAC) enables Prama India as a technology partner to manufacture, market and support the innovative solutions. With this significant initiative, Prama India has created a new benchmark in the Indian Security Industry. This new initiative by Prama India will bolster R&D and help to develop innovative thermal technology applications.',
    path: 'wall-of-fame',
    image: 'wall-of-fame3.jpg',
  },
  // {
  //   id: 2,
  //   title: 'Dr. A. Seema – Nari Shakti Puraskar',
  //   description:
  //     'Dr. A. Seema is an eminent Indian scientist from the Centre for Materials for Electronics Technology (CMET), Thrissur, Kerala. She led a pioneering research team that developed an innovative wearable device—a smart bra capable of indicating the presence of breast cancer by detecting abnormalities in breast tissue.Her breakthrough contribution in the field of sensors and healthcare technology earned her national recognition, and she was conferred the prestigious Nari Shakti Puraskar in 2019 for her outstanding scientific achievement and societal impact.',
  //   path: 'wall-of-fame',
  //   image: 'wall-of-fame1.png',
  // },
  // {
  //   id: 3,
  //   title: ' C-DAC Chennai Signs Technology Transfer Agreement for NLOS Vicinity and Illuminate',
  //   description:
  //     'The Centre for Development of Advanced Computing (C-DAC), Chennai, under the Ministry of Electronics & Information Technology (MeitY), has signed a Transfer of Technology (ToT) agreement with Nav Wireless Technologies Pvt. Ltd. for commercialization of two innovative technologies — NLOS VICINITY and ILLUMINATE. The agreement was formalized on 28 November 2024 at Electronics Niketan, New Delhi by Dr. D. Ethirajan, Scientist-F and Centre Head of C-DAC Chennai, and Hardik Raval, Head of Embedded Department, Nav Wireless Technologies Pvt. Ltd',
  //   path: 'wall-of-fame',
  //   externalLink: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2078861&reg=3&lang=2',
  //   image: 'wall-of-fame2.jpg',
  // },
];

export function HomeSuccessStoriesSectionHorizontal() {
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
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              // background: 'linear-gradient(90deg, #ff7a18 0%, #ff2d95 50%, #1e3c72 100%)',
              // background: 'linear-gradient(90deg, #ff7a18 32%, #ff2d95 52%, #1e3c72 70%)',
              background: 'linear-gradient(90deg, #ff7a18 40%, #ff2d95 50%, #1e3c72 59%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Success Stories
          </Typography>
          {/* <Typography variant="body1">
            Comprehensive support for protecting and commercializing intellectual property
          </Typography> */}
        </Stack>

        {/* MOBILE SLIDER */}
        {isMobile ? (
          <Box sx={{ position: 'relative' }}>
            <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
              <Box sx={{ display: 'flex' }}>
                {STORIES.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: '0 0 100%',
                      px: 1,
                    }}
                  >
                    <CardItem item={item} />
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
          <>
            <Grid container spacing={3}>
              {STORIES.map((item, index) => (
                <Grid
                  // xs={12}
                  // sm={6}
                  // md={3}
                  // size={{ xs: 12, sm: 6, md: 3 }}
                  key={index}
                  sx={{ display: 'flex', flex: '1 1 260px' }}
                >
                  <CardItem item={item} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                size="large"
                sx={linkBtn}
                component={RouterLink}
                to="wall-of-fame"
                endIcon={<Iconify icon="flowbite:arrow-right-outline" width={25} />}
              >
                View All Stories
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

function CardItem({ item }) {
  return (
    <Card sx={cardStyle}>
      <Stack sx={{ flexDirection: { xs: 'colomn', md: 'row' } }} spacing={2}>
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/images/fame/${item.image}`}
          alt="success"
          sx={{
            width: { xs: 350, md: 280 },
            height: 190,
            // height: 220,
            borderRadius: 2,
            objectFit: 'cover',
          }}
        />
        <Stack
          sx={{
            flexDirection: { md: 'column' },
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
          // spacing={2}
        >
          <Box>
            <Typography
              variant="body1"
              fontWeight={700}
              sx={{
                display: '-webkit-box',
                // WebkitLineClamp: { xs: 2, md: 2, lg: 2 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                // textAlign: { xs: 'left', md: 'left', lg: 'justify' },
              }}
            >
              {item.title}
            </Typography>

            <Typography
              mt={1}
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: { xs: 4, md: 3, lg: 4 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: { xs: 'left', md: 'left', lg: 'justify' },
              }}
            >
              {item.description}
            </Typography>
          </Box>

          {/* <Button
            size="large"
            sx={linkBtn}
            component={RouterLink}
            target={item.externalLink && '_blank'}
            to={item.externalLink || item.path}
          >
            Read more →
          </Button> */}
        </Stack>
      </Stack>
    </Card>
  );
}

//
// ================= STYLES =================
//
const cardStyle = {
  //   flex: 1,
  p: 2,
  borderRadius: 3,
  // border: (theme) => `1px solid ${theme.palette.divider}`,
  border: '1px solid #ffd7ba',
  //   minHeight: 440,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const linkBtn = {
  fontWeight: 600,
  // color: 'primary.main',
  color: '#2085e8',
};
