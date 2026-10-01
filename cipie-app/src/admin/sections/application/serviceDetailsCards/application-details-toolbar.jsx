import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const STATUS_COLORS = {
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'error',
  Submitted: 'info',
};

export function ApplicationDetailsToolbar({
  status,
  backHref,
  createdAt,
  orderNumber,
  serviceCode,
  isUserQuery,
  isFinalStatus,
  isQueryStatus,
  handleApprove,
  handleReject,
  handleInProcess,
  handleUpdateAndResubmit,
  onOpenForm,
}) {
  const menuActions = usePopover();

  const handleMenuClick = (callback) => () => {
    menuActions.onClose();
    callback();
  };

  return (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        mb: { xs: 3, md: 5 },
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box sx={{ gap: 1, display: 'flex', alignItems: 'flex-start' }}>
        <IconButton component={RouterLink} href={backHref}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4">
              {serviceCode} {orderNumber}
            </Typography>

            <Label variant="soft" color={STATUS_COLORS[status] || 'default'}>
              {status}
            </Label>
          </Box>

          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {fDateTime(createdAt)}
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          gap: 1.5,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {isUserQuery ? (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onOpenForm}
            disabled={isQueryStatus}
          >
            Reply to Query
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="inherit"
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={menuActions.onOpen}
              disabled={isFinalStatus}
            >
              Take Action
            </Button>

            <CustomPopover
              open={menuActions.open}
              anchorEl={menuActions.anchorEl}
              onClose={menuActions.onClose}
              slotProps={{ arrow: { placement: 'top-right' } }}
            >
              <MenuList>
                <MenuItem onClick={handleMenuClick(handleInProcess)}>
                  <Iconify
                    icon="solar:refresh-circle-bold"
                    width={20}
                    sx={{ mr: 1, color: 'text.secondary' }}
                  />
                  In Process
                </MenuItem>

                <MenuItem onClick={handleMenuClick(handleApprove)}>
                  <Iconify
                    icon="solar:check-circle-bold"
                    width={20}
                    sx={{ mr: 1, color: 'success.main' }}
                  />
                  Approve
                </MenuItem>

                <MenuItem onClick={handleMenuClick(handleUpdateAndResubmit)}>
                  <Iconify
                    icon="solar:restart-circle-bold"
                    width={20}
                    sx={{ mr: 1, color: 'error.main' }}
                  />
                  Update & Resubmit
                </MenuItem>
              </MenuList>
            </CustomPopover>
          </>
        )}
      </Box>
    </Box>
  );
}