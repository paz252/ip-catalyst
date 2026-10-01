import { useState } from 'react';

import { Box, Button, IconButton, Popover, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function SubmissionRequirementPopover({ sx }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        size="small"
        // color="primary"
        variant="text"
        startIcon={<Iconify icon="solar:danger-circle-bold" />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          p: 0,
          minWidth: 'auto',
          fontWeight: 600,
          textTransform: 'none',
          color: '#076cd9',
          '&:hover': {
            bgcolor: 'transparent',
            textDecoration: 'underline',
          },
          ...sx,
        }}
      >
        Why can&apos;t I submit?
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
            sx: {
              width: 430,
              borderRadius: 4,
              p: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: (theme) => theme.shadows[16],
            },
          },
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
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
                  icon="solar:danger-circle-bold"
                  width={22}
                  sx={{ color: 'warning.main' }}
                />
              </Box>

              <Box>
                <Typography fontWeight={700}>Submission Requirements</Typography>

                <Typography variant="caption" color="text.secondary">
                  Complete all required sections
                </Typography>
              </Box>
            </Stack>

            <IconButton size="small" onClick={() => setAnchorEl(null)}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Before submitting your patent for approval, please make sure the following sections are
            completed:
          </Typography>

          <Stack spacing={1.5}>
            {['Header Information', 'Patent Information', 'At least one Patent Document'].map(
              (item) => (
                <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                  <Iconify
                    icon="solar:check-circle-bold"
                    width={20}
                    sx={{ color: 'success.main' }}
                  />

                  <Typography variant="body2">{item}</Typography>
                </Stack>
              )
            )}
          </Stack>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'warning.lighter',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Once all required information and documents are provided, the
              <strong> Submit for Approval </strong>
              action will become available.
            </Typography>
          </Box>
        </Stack>
      </Popover>
    </>
  );
}
