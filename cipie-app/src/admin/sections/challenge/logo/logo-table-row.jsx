import { useBoolean, usePopover } from 'minimal-shared/hooks';

import {
  Box,
  Link,
  Button,
  MenuItem,
  Avatar,
  MenuList,
  TableRow,
  TableCell,
  IconButton,
  ListItemText,
  Stack,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fDate, fTime } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function LogoChallengeTableRow({ row, selected, onSelectRow, onDeleteRow, detailsHref }) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem component={RouterLink} href={detailsHref} onClick={menuActions.onClose}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </li>

        {/* Delete can be enabled later */}
        {/* <MenuItem
          onClick={() => {
            confirmDialog.onTrue();
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
      </MenuList>
    </CustomPopover>
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Delete"
      content="Are you sure want to delete?"
      action={
        <Button variant="contained" color="error" onClick={onDeleteRow}>
          Delete
        </Button>
      }
    />
  );

  return (
    <>
      <TableRow hover selected={selected}>
        {/* ================= LOGO + TITLE ================= */}
        <TableCell>
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
              minWidth: 280,
            }}
          >
            <Avatar
              variant="rounded"
              alt={row.title || 'Logo'}
              src={`${CONFIG.challenge.logo}${row.imagePath}`}
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'background.neutral',
              }}
            />

            <ListItemText
              primary={
                <Link
                  component={RouterLink}
                  href={detailsHref}
                  color="inherit"
                  underline="hover"
                  sx={{
                    color: 'text.primary',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {row.title || 'Untitled Logo'}
                </Link>
              }
              slotProps={{
                primary: {
                  sx: {
                    typography: 'body2',
                    fontWeight: 700,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                },
                secondary: {
                  sx: {
                    mt: 0.5,
                    color: 'text.disabled',
                    typography: 'caption',
                  },
                },
              }}
            />
          </Box>
        </TableCell>

        {/* ================= APPLICANT ================= */}
        <TableCell>
          <ListItemText
            primary={row.applicant || '-'}
            secondary={row.email || '-'}
            slotProps={{
              primary: {
                noWrap: true,
                sx: {
                  typography: 'body2',
                  fontWeight: 600,
                },
              },
              secondary: {
                sx: {
                  mt: 0.5,
                  typography: 'body2',
                },
              },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.userType || '-'}
            slotProps={{
              primary: {
                noWrap: true,
                sx: {
                  typography: 'body2',
                  fontWeight: 600,
                },
              },
              secondary: {
                sx: {
                  mt: 0.5,
                  typography: 'body2',
                },
              },
            }}
          />
        </TableCell>

        {/* ================= STATUS ================= */}
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Label
              variant="soft"
              color={
                (row.status === 'Submitted' && 'info') ||
                (row.status === 'InReview' && 'warning') ||
                (row.status === 'Shortlisted' && 'success') ||
                (row.status === 'Winner' && 'primary') ||
                (row.status === 'Rejected' && 'error') ||
                'default'
              }
            >
              {row.statusName || row.status}
            </Label>
          </Stack>
        </TableCell>

        {/* ================= SUBMITTED ON ================= */}
        <TableCell>
          <ListItemText
            primary={fDate(row.createdAt)}
            secondary={fTime(row.createdAt)}
            slotProps={{
              primary: {
                noWrap: true,
                sx: { typography: 'body2' },
              },
              secondary: {
                sx: {
                  mt: 0.5,
                  typography: 'caption',
                },
              },
            }}
          />
        </TableCell>

        {/* ================= ACTION ================= */}
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}
    </>
  );
}
