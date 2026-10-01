import { Box, Link, ListItemText, LinearProgress } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';
import { fTime, fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellPrice({ params }) {
  return fCurrency(params.row.price);
}

export function RenderCellPublish({ params }) {
  const statusMap = {
    0: {
      label: 'Submitted',
      color: 'info',
    },
    1: {
      label: 'Shortlisted',
      color: 'success',
    },
    2: {
      label: 'In Review',
      color: 'warning',
    },

    3: {
      label: 'Winner',
      color: 'primary',
    },
    4: {
      label: 'Rejected',
      color: 'error',
    },
  };

  const status = statusMap[params.status] || {
    label: 'Unknown',
    color: 'default',
  };

  return (
    <Label variant="soft" color={status.color}>
      {params.statusName}
    </Label>
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

export function RenderCell({ params, href }) {
  return (
    <ListItemText
      sx={{
        minWidth: 0,
        flex: 1,
      }}
      primary={
        <Link
          component={RouterLink}
          href={href}
          color="inherit"
          sx={{
            display: 'block',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {params.title}
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
