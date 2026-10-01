// import { useNavigate } from 'react-router';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

import { Box, Card, Typography, IconButton, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

const PROGRAMS = [
  {
    id: 1,
    title: 'International Patent Filing Support',
    bgColor: 'rgb(179 255 211 / 15%)',
    borderColor: '#97ffbc',
    description:
      'Patent filing support to help startups, MSMEs, MeitY societies / autonomous bodies and grantee institutions (MeitY supported project specific only) secure patent protection in foreign jurisdictions',
    points: [
      'It provides comprehensive patent filing support in the form of services, with total expenditure limited to ₹20 lakh per invention',
      'Support through PCT, Paris Convention and Direct Filing routes',
      // 'The invention must be in the ICT domain',
      // 'The patent application must be filed in the name of enterprise',
    ],
    section: 'services',
    domain: 'ipfs-services',
    subDomain: 'startup-msme',
    image: 'ipfs.svg',
    icon: 'mdi:web',
    path: paths.services.ipfsServices.startup,
  },
  {
    id: 2,
    title: 'IP Facilitation for Domestic IP Filing',
    bgColor: 'rgb(163 245 255 / 15%)',
    borderColor: '#91f3ff',
    description:
      'Patent filing support to help MeitY societies, MeitY autonomous bodies and MeitY grantee institutions (MeitY supported project specific only) secure patent protection in Indian jurisdiction',
    points: [
      'It provides various IP filing support including Patents, Trademarks, Designs, Copyrights and Semiconductor Integrated Circuits Layout Desig (SICLD)',
      'Support in the form of services for filing, prosecution and maintenance of domestic IP',
    ],
    section: 'services',
    domain: 'ip-facilitation-services',
    subDomain: 'domestic-patent-filing-maintaining',
    image: 'ipdf.svg',
    icon: 'solar:document-text-bold',
    path: paths.services.ipFacilitationServices.domestic,
  },
  {
    id: 3,
    title: 'Innovation Promotion Activities',
    bgColor: 'rgb(180 202 255 / 12%)',
    borderColor: '#b4caff',
    // description:
    //   'Initiatives designed to foster awareness, collaboration, innovation driven growth and to access available technologies developed by MeitY ',
    // description:
    //   'Initiatives designed to foster awareness, collaboration, innovation driven growth and to access available technologies developed by MeitY for facilitating collaboration and licensing / technology transfer to industry partner',
    description:
      'Initiatives designed to foster awareness, collaboration, innovation driven growth and to access available technologies developed by MeitY for facilitating collaboration and licensing ',
    points: [
      'Training programs and capacity-building workshops',
      'Challenge rounds to encourage breakthrough ideas',
      'Industry meets and networking platforms',
      'Awareness initiatives on IP management and commercialization',
    ],
    section: '',
    domain: 'innovation',
    subDomain: 'ict/computer-technology',
    image: 'ipa.svg',
    icon: 'solar:rocket-bold',
    // path: paths.innovationApplication.category('ict', 'computer-technology'),
    path: paths.innovationApplication.category('all', 'patents'),
  },
];

function ProgramCard({ item }) {
  // const navigate = useNavigate();
  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 3,
        width: '100%',
        aspectRatio: {
          xs: 'auto',
          md: '1.1 / 1.1',
        },
        height: {
          // md: 'unset !important',
          lg: 400,
        },

        maxHeight: {
          // md: 'unset !important',
          lg: 500,
        },
        border: `1px solid ${item.borderColor}`,
        bgcolor: item.bgColor,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: `0 10px 24px ${item.bgColor}`,
        },
      }}
    >
      {/* Icon */}
      <Box
        component="img"
        src={`${CONFIG.assetsDir}/assets/images/home/services-section/icon/${item.image}`}
        alt={item.title}
        sx={{ width: 75, height: 75, mb: 3 }}
      />
      {/* Title */}
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{
          // color: '#000',
          mb: 1,
          lineHeight: 1.3,
          // display: '-webkit-box',
          // WebkitLineClamp: 2,
          // WebkitBoxOrient: 'vertical',
          // overflow: 'hidden',
        }}
      >
        {item.title}
      </Typography>
      {/* Description */}
      <Typography
        variant="body"
        color="text.secondary"
        // color="#4d4d4d"
        sx={{
          lineHeight: 1.6,
          mb: {
            xs: 2,
            md: 'auto',
          },
          textAlign: {
            xs: 'left',
            md: 'left',
          },
          display: {
            xs: '-webkit-box',
            md: 'block',
          },
          WebkitLineClamp: {
            xs: 3,
            md: 'unset',
          },
          WebkitBoxOrient: {
            xs: 'vertical',
            md: 'unset',
          },
          overflow: {
            xs: 'hidden',
            md: 'visible',
          },
        }}
      >
        {item.description}
      </Typography>
      {/* CTA */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // gap: 0.5,
          // mt: 2,
          cursor: 'pointer',
        }}
      >
        <Typography variant="body1" fontWeight={500} sx={{ color: '#2085e8' }}>
          Know more
        </Typography>
        <IconButton component={RouterLink} to={item.path} edge="end">
          <Iconify icon="flowbite:arrow-right-outline" width={30} sx={{ color: '#2085e8' }} />
        </IconButton>
      </Box>
    </Card>
  );
}
export function HomeServicesProgramSection() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
  });
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
      // sx={{ py: { xs: 6, md: 5 }, px: { xs: 2, md: 8, lg: 12 } }}
      sx={{ py: { xs: 6, md: 5 }, px: { xs: 2, sm: 4, md: 8, lg: 12, xl: 12 } }}
    >
      {/* Heading */}
      <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 700, mb: 2 }}>
        IP Catalyst Programs
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', mb: 4 }}>
        Comprehensive Support for Protecting and Commercializing Intellectual Property
      </Typography>
      {isMobile ? (
        <>
          {/* Carousel */}
          <Box ref={emblaRef} sx={{ overflow: 'hidden' }}>
            <Box sx={{ display: 'flex' }}>
              {PROGRAMS.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    flex: '0 0 88%', // PERFECT width (1 card + peek)
                    mr: 2, // spacing between cards
                  }}
                >
                  <ProgramCard item={item} />
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
        </>
      ) : (
        /* Desktop Grid */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 3,
          }}
        >
          {PROGRAMS.map((item) => (
            <ProgramCard key={item.id} item={item} />
          ))}
        </Box>
      )}
    </Box>
  );
}
