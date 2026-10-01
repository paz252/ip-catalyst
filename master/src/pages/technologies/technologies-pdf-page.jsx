import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';

import { CONFIG } from 'src/global-config';
import { TECHNOLOGY_PDFS } from 'src/layouts/simple/technologies';

import { Iconify } from 'src/components/iconify';

export default function TechnologiesPdfPage() {
  const location = useLocation();

  const [openPreview, setOpenPreview] = useState(false);

  // ================= FIND TECHNOLOGY =================
  const technology = useMemo(
    () =>
      TECHNOLOGY_PDFS.flatMap((section) => section.items).find(
        (item) => item.path === location.pathname
      ),
    [location.pathname]
  );

  // ================= PAGE TITLE =================
  useEffect(() => {
    document.title = technology ? `${technology.title} | Technologies` : 'Technologies';
  }, [technology]);

  if (!technology) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Technology PDF not found
        </Typography>
      </Box>
    );
  }

  // ================= PDF URL =================
  const pdfUrl = `${CONFIG.assetsDir}/assets/pdfs/technologies/${technology.pdf}`;

  //   const pdfUrl = `${CONFIG.mainServerUrl}/technologies/pdfs/${technology.pdf}`;

  return (
    <Box
      sx={{
        maxWidth: '100%',
        // mx: 'auto',
        px: { xs: 2, md: 4, lg: 6 },
        py: { xs: 4, md: 5 },
      }}
    >
      {/* ================= HEADER ================= */}
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h4" fontWeight={800}>
            {technology.title}
          </Typography>
        </Stack>

        {/* ================= META INFO ================= */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            // icon={<Iconify icon="solar:cpu-bold" />}
            label={`Domain : ${technology.domain}`}
            color="primary"
            variant="soft"
          />

          <Chip
            // icon={<Iconify icon="solar:document-bold" />}
            label={`Pdf: ${technology.pdf}`}
            color="info"
            variant="soft"
            sx={{ '& .MuiChip-label': { fontWeight: 600 } }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* ================= DESCRIPTION ================= */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Technology Overview
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.8,
        }}
      >
        Explore commercialization-ready technologies across diverse strategic and emerging domains
        developed by R&D institutions under MeitY, available for further commercialization.
      </Typography>

      {/* ================= PDF SECTION ================= */}
      <Stack
        direction="row"
        spacing={2}
        mt={4}
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Typography variant="h6" fontWeight={700}>
          Technology Document
        </Typography>

        {/* ACTIONS */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="solar:eye-bold" />}
            onClick={() => setOpenPreview(true)}
          >
            View Full
          </Button>

          {/* <Button
            variant="contained"
            size="small"
            component="a"
            href={pdfUrl}
            download
            startIcon={<Iconify icon="solar:download-bold" />}
          >
            Download
          </Button> */}
        </Stack>
      </Stack>

      {/* ================= PDF PREVIEW ================= */}
      <Card
        sx={{
          mt: 2,
          p: { xs: 1, md: 2 },

          display: 'flex',
          justifyContent: 'center',

          bgcolor: 'grey.100',

          borderRadius: 3,
        }}
      >
        {/* A4 PDF */}
        <Box
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

            bgcolor: 'white',

            borderRadius: 2,
            overflow: 'hidden',

            boxShadow: 3,
          }}
        >
          <iframe
            title={technology.title}
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{
              border: 0,
            }}
          />
        </Box>
      </Card>

      {/* ================= PDF DIALOG ================= */}
      <PdfDialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        src={pdfUrl}
        title={technology.title}
      />
    </Box>
  );
}

// ================= PDF DIALOG =================
function PdfDialog({ open, onClose, src, title }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <Box
        sx={{
          position: 'relative',

          bgcolor: 'background.paper',

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          p: { xs: 1, md: 2 },

          height: {
            xs: '80vh',
            md: '90vh',
          },
        }}
      >
        {/* CLOSE BUTTON */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',

            top: { xs: 8, sm: 12, md: 16 },
            right: { xs: 8, sm: 12, md: 16 },

            width: { xs: 36, sm: 42, md: 48 },
            height: { xs: 36, sm: 42, md: 48 },

            zIndex: 10,

            bgcolor: 'background.paper',
            boxShadow: 2,

            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
        >
          <Iconify icon="solar:close-circle-bold" />
        </IconButton>

        {/* PDF */}
        <Box
          sx={{
            width: '100%',
            height: '100%',

            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <iframe
            title={title}
            src={src}
            width="100%"
            height="100%"
            style={{
              border: 0,
            }}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
