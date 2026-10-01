import { useParams } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Typography,
  Chip,
  Stack,
  Card,
  Divider,
  Dialog,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';

import { CONFIG } from 'src/global-config';
import { NEWS_DATA } from 'src/config/news-data';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BlinkBadge } from './news-list';

export default function NewsDetailsPage() {
  const { slug } = useParams();
  // const [openPreview, setOpenPreview] = useState(false);

  const news = NEWS_DATA.find((item) => item.slug === slug);

  if (!news) return <div>Not Found</div>;
  return (
    // <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 4 }}>
    <Box
      sx={{
        maxWidth: '100%',
        // mx: 'auto',
        px: { xs: 2, md: 4, lg: 6 },
        py: { xs: 4, md: 5 },
      }}
    >
      {news.newsView === 1 && <PatentGrantedNews news={news} />}

      {news.newsView === 2 && <GalleryNews news={news} />}

      {news.newsView === 3 && <TrademarkNews news={news} />}
    </Box>
  );
}

function PatentGrantedNews({ news }) {
  return (
    // <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 4 }}>
    <>
      {/* ================= HEADER ================= */}
      <Stack spacing={2}>
        <CustomBreadcrumbs
          // heading={news.title}
          links={[
            { name: 'Home', href: '/' },
            { name: 'News', href: '/news' },
            { name: news.title },
          ]}
          sx={{ mb: 3 }}
        />
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h4" fontWeight={800}>
            {news.title}
          </Typography>

          {/* {news.isNew && <Chip label="NEW" color="error" size="small" />} */}

          {/* <Chip label="Granted" color="success" size="small" /> */}
        </Stack>

        {/* META INFO */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip icon={<Iconify icon="solar:calendar-bold" />} label={news.date} />
          <Chip label={`Patent: ${news.patentNo}`} color="primary" variant="soft" />
          <Chip label={`Application: ${news.applicationNo}`} color="info" variant="soft" />
          <Chip label={`Status: ${news.patentStatus}`} color="warning" variant="soft" />
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ================= DESCRIPTION ================= */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Description
      </Typography>

      <Stack spacing={2}>
        {news.description.map((paragraph, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.8,
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Stack>

      <Typography variant="h6" fontWeight={700} mt={2}>
        Applicant
      </Typography>

      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
        {news.applicant}
      </Typography>

      {/* ================= APPLICANT ================= */}
      {/* <Card sx={{ mt: 3, p: 1.5, bgcolor: 'grey.50' }}></Card>

      <Divider sx={{ my: 4 }} /> */}

      {/* ================= CERTIFICATE ================= */}
      <Stack direction="row" spacing={2} mt={2} justifyContent="space-between">
        <Typography variant="h6" fontWeight={700} mb={2}>
          Patent Certificate
        </Typography>

        {/* ACTIONS */}
        {/* <Button
          variant="outlined"
          size="small"
          startIcon={<Iconify icon="solar:eye-bold" />}
          onClick={() => setOpenPreview(true)}
        >
          View Full
        </Button>
        <ImageDialog
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          src={`${CONFIG.assetsDir}/assets/images/news/${news.applicationNo}.jpg`}
        /> */}
      </Stack>

      <Card
        sx={{
          width: '100%',

          maxWidth: {
            xs: '100%',
            sm: 700,
            md: 850,
            lg: 1000,
          },
          mx: 'auto',

          aspectRatio: '1 / 1.414',

          // p: 2,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'grey.100',
        }}
      >
        {/* A4 IMAGE */}
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/images/news/${news.applicationNo}.jpg`}
          alt="Patent Certificate"
          sx={{
            width: '100%',
            // maxWidth: 600,
            aspectRatio: '1 / 1.414', // A4 ratio
            objectFit: 'contain',
            borderRadius: 1,
            boxShadow: 3,
            bgcolor: 'white',
          }}
        />
      </Card>
    </>
  );
}

function GalleryNews({ news }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const [isHovered, setIsHovered] = useState(false);

  const selectedImage = news.gallery[selectedIndex];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      onSelect();
      emblaApi.on('select', onSelect);
    }

    return () => {
      if (emblaApi) {
        emblaApi.off('select', onSelect);
      }
    };
  }, [emblaApi, onSelect]);

  // Auto play
  useEffect(() => {
    let interval;

    if (emblaApi && !isHovered) {
      interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [emblaApi, isHovered]);

  return (
    <>
      {/* ================= HEADER ================= */}
      <Stack spacing={2}>
        <CustomBreadcrumbs
          // heading={news.title}
          links={[
            { name: 'Home', href: '/' },
            { name: 'News', href: '/news' },
            { name: news.title },
          ]}
          sx={{ mb: 3 }}
        />
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h4" fontWeight={800}>
            {news.title}
          </Typography>

          {news.isNew && <BlinkBadge />}
        </Stack>

        {/* META INFO */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip icon={<Iconify icon="solar:calendar-bold" />} label={news.date} />
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ================= DESCRIPTION ================= */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Description
      </Typography>

      <Stack spacing={2}>
        {news.description.map((paragraph, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.8,
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Stack>

      {/* ================= GALLERY ================= */}
      <Typography variant="h6" fontWeight={700} mt={4} mb={2}>
        News Gallery
      </Typography>

      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          maxWidth: 1000,
          mx: 'auto',
        }}
      >
        {/* Carousel */}
        <Box
          ref={emblaRef}
          sx={{
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex' }}>
            {news.gallery.map((item, index) => (
              <Box
                key={index}
                sx={{
                  flex: '0 0 100%',
                  minWidth: 0,
                }}
              >
                <Card
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={`${CONFIG.assetsDir}/assets/images/news/${item.image}`}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: {
                        xs: 250,
                        sm: 400,
                        md: 520,
                      },
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: 1.5,
                      bgcolor: 'grey.100',
                    }}
                  />
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Navigation */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
          <IconButton onClick={scrollPrev}>
            <Iconify icon="eva:arrow-left-fill" />
          </IconButton>

          {/* Dots */}
          <Stack direction="row" spacing={0.75}>
            {news.gallery.map((_, index) => (
              <Box
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                sx={{
                  width: index === selectedIndex ? 22 : 7,
                  height: 7,
                  borderRadius: 10,
                  bgcolor: index === selectedIndex ? 'primary.main' : 'action.disabled',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </Stack>

          <IconButton onClick={scrollNext}>
            <Iconify icon="eva:arrow-right-fill" />
          </IconButton>
        </Stack>

        {/* Image Information */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {selectedImage.title}
          </Typography>

          {/* <Typography
            variant="body2"
            sx={{
              mt: 0.75,
              color: 'text.secondary',
              lineHeight: 1.7,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            {selectedImage.description}
          </Typography> */}
        </Box>
      </Box>
    </>
  );
}

function TrademarkNews({ news }) {
  return (
    <>
      {/* ================= HEADER ================= */}
      <Stack spacing={2}>
        <CustomBreadcrumbs
          // heading={news.title}
          links={[
            { name: 'Home', href: '/' },
            { name: 'News', href: '/news' },
            { name: news.title },
          ]}
          sx={{ mb: 3 }}
        />
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h4" fontWeight={800}>
            {news.title}
          </Typography>

          {news.isNew && <BlinkBadge />}
        </Stack>

        {/* META INFO */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip icon={<Iconify icon="solar:calendar-bold" />} label={news.date} />
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ================= DESCRIPTION 1 ================= */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Description
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.8,
          mb: 3,
        }}
      >
        {news.description[0]}
      </Typography>

      {/* ================= TRADEMARK TABLE ================= */}
      <Typography variant="h6" fontWeight={700} mb={2}>
        Trademark Applications
      </Typography>

      <Card
        sx={{
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Trademark</TableCell>

                <TableCell sx={{ fontWeight: 700 }}>Application No.</TableCell>

                <TableCell sx={{ fontWeight: 700 }}>Classes</TableCell>

                <TableCell sx={{ fontWeight: 700 }}>Filing Data</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {news.trademarkTable.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip size="small" label={row.trademark} color="primary" variant="soft" />
                  </TableCell>

                  <TableCell>{row.applicationNo}</TableCell>

                  <TableCell>{row.class}</TableCell>

                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ================= DESCRIPTION 2 ================= */}
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.8,
          mt: 3,
        }}
      >
        {news.description[1]}
      </Typography>

      {/* ================= DOCUMENT ================= */}
      <Box sx={{ mt: 3 }}>
        <Button
          component="a"
          href={`${CONFIG.assetsDir}/assets/images/news/${news.pdf}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          color="primary"
          startIcon={<Iconify icon="solar:document-text-bold" width={18} />}
          endIcon={<Iconify icon="flowbite:arrow-right-outline" width={18} />}
          sx={{
            borderRadius: 1.5,
            fontWeight: 700,
          }}
        >
          View Trademark Document
        </Button>
      </Box>
    </>
  );
}

function ImageDialog({ open, onClose, src }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        {/* Close Button */}
        <IconButton
          // className="hello"
          onClick={onClose}
          sx={{
            position: 'absolute',
            color: 'black',
            zIndex: 10,
            // top: 10,
            // right: 10,
            // width: 40,
            top: { xs: 8, sm: 12, md: 16 },
            right: { xs: 8, sm: 12, md: 16 },

            width: { xs: 36, sm: 42, md: 48 },
            height: { xs: 36, sm: 42, md: 48 },
          }}
        >
          <Iconify icon="solar:close-circle-bold" />
        </IconButton>

        {/* Image */}
        <Box
          component="img"
          src={src}
          alt="Certificate"
          sx={{
            width: '100%',
            maxWidth: 900,
            objectFit: 'contain',
            borderRadius: 1,
          }}
        />
      </Box>
    </Dialog>
  );
}

function ImageDialog1({ open, onClose, src }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 1.5, md: 2.5 }, // 👈 responsive padding
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',

            top: { xs: 8, sm: 12, md: 16 },
            right: { xs: 8, sm: 12, md: 16 },

            width: { xs: 36, sm: 42, md: 48 },
            height: { xs: 36, sm: 42, md: 48 },

            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',

            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.8)',
            },

            zIndex: 10,
          }}
        >
          <Iconify icon="solar:close-circle-bold" width={24} />
        </IconButton>

        {/* Image */}
        <Box
          component="img"
          src={src}
          alt="Certificate"
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: 900 },
            maxHeight: { xs: '70vh', md: '80vh' }, // 👈 prevents overflow
            objectFit: 'contain',
            borderRadius: 1,
          }}
        />
      </Box>
    </Dialog>
  );
}
