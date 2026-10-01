import { useState } from 'react';

import { Box, Button, Chip, IconButton, Popover, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function AdminRemarkPopover({ approvalRemark, buttonText = 'Admin Remark', sx }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!approvalRemark) {
    return null;
  }

  return (
    <>
      <Button
        size="small"
        variant="text"
        // color="inherit"
        startIcon={<Iconify icon="solar:chat-round-dots-bold" sx={{ color: 'warning.main' }} />}
        onClick={handleOpen}
        sx={{
          color: 'warning.main',
          p: 0,
          minWidth: 'auto',
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': {
            bgcolor: 'transparent',
            textDecoration: 'underline',
          },
          ...sx,
        }}
      >
        {buttonText}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: {
                xs: 'calc(100vw - 32px)',
                sm: 420,
              },
              maxWidth: 420,
              borderRadius: 4,
              overflow: 'hidden',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: (theme) => theme.shadows[16],
            },
          },
        }}
      >
        <Box p={3}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon="solar:chat-round-dots-bold"
                  width={22}
                  sx={{ color: 'text.secondary' }}
                />
              </Box> */}
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  bgcolor: 'warning.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon="solar:chat-round-dots-bold"
                  width={22}
                  sx={{ color: 'warning.main' }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Administrator Remark
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Provided during review
                </Typography>
              </Box>
            </Stack>

            <IconButton size="small" onClick={handleClose}>
              <Iconify icon="mingcute:close-line" width={18} />
            </IconButton>
          </Stack>

          {/* Remark */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'grey.50',
              border: (theme) => `1px solid ${theme.palette.grey[200]}`,
              position: 'relative',
            }}
          >
            <Chip
              size="small"
              color="success"
              label="Reviewer Feedback"
              icon={<Iconify icon="solar:chat-round-dots-bold" width={16} />}
              sx={{ mb: 2 }}
            />
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                color: 'text.primary',
                maxHeight: 220,
                overflowY: 'auto',
              }}
            >
              {approvalRemark}
            </Typography>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: 'warning.lighter',
              border: (theme) => `1px solid ${theme.palette.warning.light}`,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Typography variant="body2" color="text.secondary">
                Please review the above comments carefully and update your submission before
                requesting approval again.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
