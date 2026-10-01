import { useState } from 'react';
import { kebabCase } from 'es-toolkit';

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

const DOMAIN_KEY_MAP = {
  'Information & Communication Technology': 'ict',
  'Mechanical & Industrial Engineering': 'mech',
  'Materials, Chemical & Nano Sciences': 'mat',
  'Medical & Life Sciences': 'med',
  'Electrical & Electronics Engineering': 'elec',
  'Measurement & Optical Technologies': 'opt',
  'Other Technologies': 'other',
};

export function PatentPublishedDialog({ open, onClose, patent }) {
  // console.log(`PatentPublishedDialog`, patent);
  const { id, title, mainTechnologyDomain, techSubDomain } = patent || {};
  const [copied, setCopied] = useState(false);

  const publicPatentPath =
    mainTechnologyDomain && techSubDomain && title
      ? paths.innovationApplication.details1(
          DOMAIN_KEY_MAP[mainTechnologyDomain],
          kebabCase(techSubDomain),
          id
        )
      : '';
  // console.log(publicPatentPath);

  const publicPatentUrl = publicPatentPath ? `${window.location.origin}${publicPatentPath}` : '';

  function toSlug(value = '') {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const handleCopyLink = async () => {
    console.log(publicPatentUrl);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(publicPatentUrl);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = publicPatentUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        document.execCommand('copy');

        document.body.removeChild(textarea);
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleCopy = async (text) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          // Prevent dialog from exceeding screen height
          maxHeight: '90vh',
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* ---------------- Hero ---------------- */}

        <Box
          sx={{
            position: 'relative',
            px: 2,
            py: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg,#F0FDF4 0%,#ECFEFF 55%,#EFF6FF 100%)',
          }}
        >
          {/* <Box
            sx={{
              width: 88,
              height: 88,
              mx: 'auto',
              mb: 2,
              borderRadius: '50%',
              // bgcolor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: (theme) => theme.shadows[10],
            }}
          >
            <Iconify icon="solar:check-circle-bold" width={52} sx={{ color: 'success.main' }} />
          </Box> */}

          <Box
            sx={{
              width: 82,
              height: 82,
              mx: 'auto',
              borderRadius: '50%',
              bgcolor: 'warning.lighter',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 3s ease-in-out infinite',

              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.08)',
                },
                '100%': {
                  transform: 'scale(1)',
                },
              },
            }}
          >
            <Iconify icon="solar:check-circle-bold" width={52} sx={{ color: 'warning.main' }} />
          </Box>

          <Typography variant="h4" fontWeight={800}>
            Patent Published Successfully
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1.5,
              maxWidth: 620,
              mx: 'auto',
            }}
          >
            Your patent is now publicly available on the CIPIE Portal and can be accessed using the
            link below.
          </Typography>
        </Box>

        {/* ---------------- Body ---------------- */}

        <Stack spacing={3} sx={{ p: 2 }}>
          {/* Location */}

          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.neutral',
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="solar:folder-with-files-bold" color="primary.main" width={24} />

                <Typography variant="h6">Published Location</Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                <Chip
                  icon={<Iconify icon="solar:home-2-bold" />}
                  label="Home"
                  color="primary"
                  variant="soft"
                />

                <Iconify icon="solar:alt-arrow-right-bold" />

                <Chip
                  icon={<Iconify icon="solar:magic-stick-3-bold" />}
                  label="Innovation"
                  color="primary"
                  variant="soft"
                />

                <Iconify icon="solar:alt-arrow-right-bold" />

                <Chip
                  icon={<Iconify icon="solar:layers-bold" />}
                  label="Information & Communication Technology"
                  // label={mainTechnologyDomain}
                  color="info"
                  variant="soft"
                />

                <Iconify icon="solar:alt-arrow-right-bold" />

                <Chip
                  icon={<Iconify icon="solar:folder-bold" />}
                  label="Audio-Visual Technology"
                  // label={techSubDomain}
                  color="secondary"
                  variant="soft"
                />
              </Stack>
            </Stack>
          </Card>

          {/* URL */}
          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                Public Patent Link
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  px: 2,
                  py: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                  gap: 1,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ minWidth: 0, flex: 1 }}
                >
                  <Iconify
                    icon="solar:link-bold"
                    width={18}
                    sx={{ color: 'primary.main', flexShrink: 0 }}
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {publicPatentUrl}
                  </Typography>
                </Stack>

                {/* <Tooltip title={copied ? 'Copied' : 'Copy'}>
                  <IconButton
                    size="small"
                    color={copied ? 'success' : 'default'}
                    onClick={handleCopyLink}
                    sx={{
                      transition: 'all .25s',
                      '&:hover': {
                        bgcolor: 'primary.lighter',
                      },
                    }}
                  >
                    <Iconify
                      icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'}
                      width={18}
                    />
                  </IconButton>
                </Tooltip> */}
                <Tooltip title={copied ? 'Copied' : 'Copy'}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={!publicPatentUrl}
                      color={copied ? 'success' : 'default'}
                      onClick={() => handleCopy(publicPatentUrl)}
                    >
                      <Iconify
                        icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'}
                        width={18}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Paper>
            </Stack>
          </Card>

          {/* Info */}

          <Alert
            severity="success"
            variant="outlined"
            icon={<Iconify icon="solar:verified-check-bold" />}
          >
            Your patent is now visible to all visitors on the CIPIE Portal. Share the above link to
            let others explore your innovation.
          </Alert>
        </Stack>
      </DialogContent>

      {/* Footer */}

      <DialogActions
        sx={{
          px: { xs: 2, sm: 4 },
          py: 2,
          borderTop: (theme) => `1px solid ${theme.vars.palette.divider}`,
          justifyContent: 'space-between',
          flexShrink: 0,

          flexDirection: {
            xs: 'column-reverse',
            sm: 'row',
          },

          gap: 2,

          '& .MuiButton-root': {
            width: {
              xs: '100%',
              sm: 'auto',
            },
          },
        }}
      >
        <Button color="inherit" size="large" onClick={onClose}>
          Close
        </Button>

        <Button
          component={RouterLink}
          href={publicPatentPath}
          variant="contained"
          size="large"
          startIcon={<Iconify icon="solar:eye-bold" />}
        >
          View Published Patent
        </Button>
      </DialogActions>
    </Dialog>
  );
  // return (
  //   <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
  //     <DialogContent sx={{ p: 4, position: 'relative', overflow: 'hidden' }}>
  //       {/* Background Glow */}
  //       <Box
  //         sx={{
  //           position: 'absolute',
  //           top: -80,
  //           right: -80,
  //           width: 220,
  //           height: 220,
  //           borderRadius: '50%',
  //           bgcolor: 'success.lighter',
  //           opacity: 0.35,
  //         }}
  //       />

  //       <Stack spacing={3} sx={{ position: 'relative', zIndex: 2 }}>
  //         {/* Success Icon */}
  //         <Box
  //           sx={{
  //             width: 82,
  //             height: 82,
  //             mx: 'auto',
  //             borderRadius: '50%',
  //             bgcolor: 'warning.lighter',
  //             display: 'flex',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             animation: 'pulse 3s ease-in-out infinite',

  //             '@keyframes pulse': {
  //               '0%': {
  //                 transform: 'scale(1)',
  //               },
  //               '50%': {
  //                 transform: 'scale(1.08)',
  //               },
  //               '100%': {
  //                 transform: 'scale(1)',
  //               },
  //             },
  //           }}
  //         >
  //           <Iconify icon="solar:check-circle-bold" width={52} sx={{ color: 'warning.main' }} />
  //         </Box>

  //         {/* Title */}
  //         <Box textAlign="center">
  //           <Typography variant="h4" fontWeight={700}>
  //             Your Patent is Now Live
  //           </Typography>

  //           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
  //             Your patent has been published successfully and is now visible to portal visitors.
  //           </Typography>
  //         </Box>

  //         {/* <Divider /> */}

  //         {/* Published Location */}
  //         <Box>
  //           <Stack direction="row" spacing={1} alignItems="center" mb={2}>
  //             <Iconify icon="solar:folder-with-files-bold" sx={{ color: 'primary.main' }} />

  //             <Typography variant="subtitle1" fontWeight={700}>
  //               Published Under
  //             </Typography>
  //           </Stack>

  //           <Stack
  //             direction="row"
  //             spacing={1}
  //             justifyContent="center"
  //             alignItems="center"
  //             flexWrap="wrap"
  //           >
  //             <Chip
  //               color="primary"
  //               variant="outlined"
  //               icon={<Iconify icon="solar:home-2-bold" />}
  //               label="Home"
  //             />
  //             <Iconify icon="solar:alt-arrow-right-bold" sx={{ color: 'text.secondary' }} />
  //             <Chip
  //               color="primary"
  //               variant="outlined"
  //               icon={<Iconify icon="solar:magic-stick-3-bold" />}
  //               label="Innovation Menu"
  //             />
  //             <Iconify icon="solar:alt-arrow-right-bold" sx={{ color: 'text.secondary' }} />
  //             <Chip
  //               color="primary"
  //               variant="outlined"
  //               icon={<Iconify icon="solar:layers-bold" />}
  //               label={mainTechnologyDomain}
  //             />

  //             <Iconify icon="solar:alt-arrow-right-bold" sx={{ color: 'text.secondary' }} />

  //             <Chip
  //               color="primary"
  //               variant="outlined"
  //               icon={<Iconify icon="solar:folder-bold" />}
  //               label={techSubDomain}
  //             />
  //           </Stack>
  //         </Box>

  //         {/* <Divider /> */}

  //         {/* Link */}
  //         <Box>
  //           <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //             Public Patent Link
  //           </Typography>
  //           <Stack spacing={1} flexDirection="row">
  //             <Paper
  //               variant="outlined"
  //               sx={{
  //                 p: 1.5,
  //                 display: 'flex',
  //                 alignItems: 'center',
  //                 justifyContent: 'space-between',
  //                 gap: 1,
  //                 borderRadius: 2,
  //                 bgcolor: 'background.neutral',
  //               }}
  //             >
  //               <Typography
  //                 variant="body2"
  //                 color="text.secondary"
  //                 sx={{
  //                   overflow: 'hidden',
  //                   textOverflow: 'ellipsis',
  //                   // whiteSpace: 'nowrap',
  //                 }}
  //               >
  //                 {publicPatentUrl}
  //               </Typography>
  //             </Paper>
  //             <Button
  //               disabled={!publicPatentUrl}
  //               size="small"
  //               variant={copied ? 'contained' : 'outlined'}
  //               color={copied ? 'success' : 'primary'}
  //               startIcon={
  //                 <Iconify icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'} />
  //               }
  //               onClick={handleCopyLink}
  //             >
  //               {copied ? 'Copied' : 'Copy'}
  //             </Button>
  //           </Stack>
  //         </Box>

  //         <Alert
  //           severity="success"
  //           variant="outlined"
  //           icon={<Iconify icon="solar:verified-check-bold" />}
  //         >
  //           Anyone with this link can now view your published patent.
  //         </Alert>
  //       </Stack>
  //     </DialogContent>

  //     <DialogActions
  //       sx={{
  //         px: 3,
  //         pb: 3,
  //         justifyContent: 'space-between',
  //       }}
  //     >
  //       <Button color="inherit" onClick={onClose}>
  //         Close
  //       </Button>

  //       <Button
  //         disabled={!publicPatentUrl}
  //         component={RouterLink}
  //         // href={publicPatentPath}
  //         href={publicPatentPath}
  //         variant="contained"
  //         startIcon={<Iconify icon="solar:eye-bold" />}
  //       >
  //         View Published Patent
  //       </Button>
  //     </DialogActions>
  //   </Dialog>
  // );
}
