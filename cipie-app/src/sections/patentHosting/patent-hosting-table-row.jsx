import { Box, Button, Stack, Link, Avatar, ListItemText, LinearProgress } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}

export function RenderCellPublish({ params, onViewPublished }) {
  const statusMap = {
    0: {
      label: 'Draft',
      color: 'warning',
    },
    1: {
      label: 'In Review',
      color: 'info',
    },
    2: {
      label: 'Published',
      color: 'success',
    },
    3: {
      label: 'Rejected',
      color: 'error',
    },
    4: {
      label: 'Reapprove',
      color: 'primary',
    },
  };

  const status = statusMap[params.status] || {
    label: 'Unknown',
    color: 'default',
  };

  // return (
  //   <Label variant="soft" color={status.color}>
  //     {params.statusName}
  //   </Label>
  // );
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Label variant="soft" color={status.color}>
        {params.statusName}
      </Label>

      {params.statusName === 'Published' && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="solar:eye-bold" width={18} />}
          onClick={() => onViewPublished(params)}
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
          View Published
        </Button>
      )}
    </Stack>

    // <Stack direction="row" spacing={1} alignItems="center">
    //   <Label variant="soft" color={status.color}>
    //     {params.statusName}
    //   </Label>

    //   {params.statusName === 'Published' && (
    //     <Tooltip title="View Published Patent" arrow>
    //       <IconButton
    //         size="small"
    //         onClick={() => onViewPublished(params)}
    //         sx={(theme) => ({
    //           width: 34,
    //           height: 34,
    //           border: `1px solid ${theme.vars.palette.divider}`,
    //           color: 'text.secondary',
    //           bgcolor: 'background.paper',
    //           transition: 'all .25s ease',

    //           '& svg': {
    //             transition: 'transform .25s ease',
    //           },

    //           '&:hover': {
    //             color: 'primary.main',
    //             borderColor: 'primary.main',
    //             bgcolor: 'primary.lighter',
    //             boxShadow: `0 6px 14px ${theme.vars.palette.primary.main}22`,
    //             transform: 'translateY(-2px)',

    //             '& svg': {
    //               transform: 'scale(1.15)',
    //             },
    //           },

    //           '&:active': {
    //             transform: 'scale(.95)',
    //           },
    //         })}
    //       >
    //         <Iconify icon="solar:eye-bold" width={18} />
    //       </IconButton>
    //     </Tooltip>
    //   )}
    // </Stack>

    // <Stack spacing={1.5} flexDirection="row" alignItems="flex-start">
    //   <Label variant="soft" color={status.color}>
    //     {params.statusName}
    //   </Label>

    //   {params.statusName === 'Published' && (
    //     <Button
    //       size="small"
    //       variant="text"
    //       // startIcon={<Iconify icon="solar:eye-bold" />}
    //       sx={{ p: 0, minWidth: 0 }}
    //       onClick={() => onViewPublished(params)}
    //     >
    //       View Published
    //     </Button>
    //   )}
    // </Stack>
  );
}

export function RenderCellCreatedAt({ params }) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.createdAt)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.createdAt)}
      </Box>
    </Box>
  );
}

export function RenderCellStock({ params }) {
  const color =
    (params.row.inventoryType === 'out of stock' && 'error') ||
    (params.row.inventoryType === 'low stock' && 'warning') ||
    'success';

  return (
    <Box sx={{ width: 1, typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        color={color}
        variant="determinate"
        value={(params.row.available * 100) / params.row.quantity}
        sx={[{ mb: 1, width: 80, height: 6 }]}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
    </Box>
  );
}

export function RenderCellPatents({ params, href }) {
  // console.log(`Params`, params);
  // console.log(href);
  return (
    <ListItemText
      primary={
        <Link component={RouterLink} href={href} color="inherit">
          {!href ? params.mainTechnologyDomain : params.title}
        </Link>
      }
      // secondary={params.row.category}
      slotProps={{
        primary: { noWrap: true },
        secondary: { sx: { color: 'text.disabled' } },
      }}
    />
  );
}
export function Old_RenderCellPatents({ params, href }) {
  return (
    <Box
      sx={{
        py: 2,
        gap: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar
        alt={params.row.name}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      <ListItemText
        primary={
          <Link component={RouterLink} href={href} color="inherit">
            {params.row.name}
          </Link>
        }
        secondary={params.row.category}
        slotProps={{
          primary: { noWrap: true },
          secondary: { sx: { color: 'text.disabled' } },
        }}
      />
    </Box>
  );
}
