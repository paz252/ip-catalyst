import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export function DocumentViewer({ documentUrl, documentName }) {
  // const [searchParams] = useSearchParams();

  // const documentUrl = searchParams.get('url');

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const pageRefs = useRef({});

  const handleDocumentLoadSuccess = ({ numPages: totalPages }) => {
    setNumPages(totalPages);
    //setPageNumber(1);
  };

  const handleNextPage = () => {
    if (!numPages) return;

    const nextPage = Math.min(pageNumber + 1, numPages);

    setPageNumber(nextPage);

    pageRefs.current[nextPage]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handlePreviousPage = () => {
    const previousPage = Math.max(pageNumber - 1, 1);

    setPageNumber(previousPage);

    pageRefs.current[previousPage]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleZoomOut = () => {
    setScale((value) => Math.max(value - 0.2, 0.6));
  };

  const handleZoomIn = () => {
    setScale((value) => Math.min(value + 0.2, 2));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.neutral',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mt: 0.2,
          px: { xs: 2, sm: 3 },
          py: 1,
          bgcolor: 'background.paper',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          minHeight: 64,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          {/* PDF icon */}
          <Box
            sx={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1.5,
              bgcolor: 'error.lighter',
              color: 'error.main',
              flexShrink: 0,
            }}
          >
            <Iconify icon="solar:document-text-bold" width={25} />
          </Box>

          {/* Document information */}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body1"
              noWrap
              sx={{
                color: 'text.primary',
                fontWeight: 600,
              }}
            >
              {documentName}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mt: 0.25,
              }}
            >
              PDF Document
            </Typography>
          </Box>
        </Stack>
      </Box>
      {/* Document Content */}
      <Box
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          pb: 5,
        }}
      >
        <Document
          file={documentUrl}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading={
            <Box
              sx={{
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">Loading document...</Typography>
            </Box>
          }
          error={
            <Box
              sx={{
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="error">Unable to load this document.</Typography>
            </Box>
          }
        >
          {/* Floating Toolbar */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0.5}
            sx={{
              position: 'sticky',
              top: 16,
              zIndex: 20,

              width: 'fit-content',
              mx: 'auto',
              my: 0.8,

              px: 1,
              py: 0.75,

              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: (theme) => theme.shadows[6],

              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Previous */}
            <Tooltip title="Previous page">
              <span>
                <IconButton size="small" onClick={handlePreviousPage} disabled={pageNumber <= 1}>
                  <Iconify icon="eva:arrow-ios-back-fill" width={20} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Page Number */}
            <Typography
              variant="body2"
              sx={{
                minWidth: 65,
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              {pageNumber} / {numPages || '-'}
            </Typography>

            {/* Next */}
            <Tooltip title="Next page">
              <span>
                <IconButton
                  size="small"
                  onClick={handleNextPage}
                  disabled={!numPages || pageNumber >= numPages}
                >
                  <Iconify icon="eva:arrow-ios-forward-fill" width={20} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Divider */}
            <Box
              sx={{
                width: 1,
                height: 24,
                bgcolor: 'divider',
                mx: 0.75,
              }}
            />

            {/* Zoom Out */}
            <Tooltip title="Zoom out">
              <span>
                <IconButton size="small" onClick={handleZoomOut} disabled={scale <= 0.6}>
                  <Iconify icon="mingcute:zoom-out-line" width={20} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Zoom Percentage */}
            <Typography
              variant="body2"
              sx={{
                minWidth: 50,
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              {Math.round(scale * 100)}%
            </Typography>

            {/* Zoom In */}
            <Tooltip title="Zoom in">
              <span>
                <IconButton size="small" onClick={handleZoomIn} disabled={scale >= 2}>
                  <Iconify icon="mingcute:zoom-in-line" width={20} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          {/* All PDF Pages */}
          {numPages &&
            Array.from({ length: numPages }, (_, index) => {
              const page = index + 1;

              return (
                <Box
                  key={`page_${page}`}
                  ref={(element) => {
                    pageRefs.current[page] = element;
                  }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',

                    mb: 3,

                    scrollMarginTop: 100,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                      boxShadow: (theme) => theme.shadows[8],

                      maxWidth: '100%',

                      '& .react-pdf__Page__canvas': {
                        display: 'block',
                        maxWidth: '100%',
                        height: 'auto !important',
                      },
                    }}
                  >
                    <Page
                      pageNumber={page}
                      scale={scale}
                      renderAnnotationLayer
                      renderTextLayer
                      loading={null}
                    />
                  </Box>
                </Box>
              );
            })}
        </Document>
      </Box>
    </Box>
  );
}
