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

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { PatentPublishedDialog } from 'src/sections/patentHosting/patent-published-dialog';

// ----------------------------------------------------------------------

export function ApplicationTableRow({
  row,
  selected,
  editHref,
  onSelectRow,
  onDeleteRow,
  detailsHref,
}) {
  const menuActions = usePopover();
  const confirmDialog = useBoolean();
  const publishDialog = useBoolean();
  const patent = {
    id: row.id,
    title: row.title,
    mainTechnologyDomain: row.mainTechnologyDomain,
    techSubDomain: row.techSubDomain,
  };

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

        {/* <li>
          <MenuItem component={RouterLink} href={editHref} onClick={menuActions.onClose}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li> */}

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

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
        {/* <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            slotProps={{
              input: {
                id: `${row.id}-checkbox`,
                'aria-label': `${row.id} checkbox`,
              },
            }}
          />
        </TableCell> */}

        <TableCell>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.email}>{row.email?.charAt(0)?.toUpperCase()}</Avatar>

            <ListItemText
              primary={row.firstName}
              secondary={
                <Link component={RouterLink} href={detailsHref} color="inherit">
                  {row.email}
                </Link>
              }
              slotProps={{
                primary: { noWrap: true, sx: { typography: 'body2' } },
                secondary: {
                  sx: { color: 'text.disabled', '&:hover': { color: 'text.secondary' } },
                },
              }}
            />
          </Box>
        </TableCell>

        {/* <TableCell>
          <ListItemText
            primary={fDate(row.dueDate)}
            secondary={fTime(row.dueDate)}
            slotProps={{
              primary: { noWrap: true, sx: { typography: 'body2' } },
              secondary: { sx: { mt: 0.5, typography: 'caption' } },
            }}
          />
        </TableCell>

        <TableCell>{fCurrency(row.totalAmount)}</TableCell>

        <TableCell align="center">{row.sent}</TableCell> */}

        <TableCell>{row.title}</TableCell>

        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Label
              variant="soft"
              color={
                (row.status === 'InReview' && 'warning') ||
                (row.status === 'Published' && 'success') ||
                (row.status === 'Answered' && 'info') ||
                (row.status === 'Rejected' && 'error') ||
                'default'
              }
            >
              {row.status}
            </Label>

            {row.status === 'Published' && (
              <Button
                size="small"
                variant="text"
                startIcon={<Iconify icon="solar:eye-bold" width={18} />}
                onClick={publishDialog.onTrue}
                sx={(theme) => ({
                  minWidth: 0,
                  px: 1,
                  py: 0.25,
                  borderRadius: 2,
                  color: 'text.secondary',
                  fontWeight: 600,
                  transition: 'all .25s ease',

                  '& .iconify': {
                    transition: 'transform .25s ease',
                  },

                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',

                    '& .iconify': {
                      transform: 'translateX(2px) scale(1.1)',
                    },
                  },

                  '&:active': {
                    transform: 'scale(.97)',
                  },
                })}
              >
                View
              </Button>
            )}
          </Stack>
        </TableCell>

        <TableCell>{row.mainTechnologyDomain}</TableCell>

        <TableCell>{row.techSubDomain}</TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.createdAt)}
            secondary={fTime(row.createdAt)}
            slotProps={{
              primary: { noWrap: true, sx: { typography: 'body2' } },
              secondary: { sx: { mt: 0.5, typography: 'caption' } },
            }}
          />
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {renderMenuActions()}
      {renderConfirmDialog()}

      <PatentPublishedDialog
        open={publishDialog.value}
        onClose={publishDialog.onFalse}
        patent={patent}
      />
    </>
  );
}
