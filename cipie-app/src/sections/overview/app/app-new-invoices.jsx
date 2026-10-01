
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function AppNewInvoices({ title, subheader, tableData, headCells, sx, ...other }) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 402 }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom headCells={headCells} />

          <TableBody>
            {tableData.map((row, index) => (
              <RowItem key={row.id ?? index} row={row} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View all
        </Button>
      </Box> */}
    </Card>
  );
}

// ----------------------------------------------------------------------

function RowItem({ row }) {
  const menuActions = usePopover();

  // const handleDownload = () => {
  //   menuActions.onClose();
  //   console.info('DOWNLOAD', row.id);
  // };

  // const handlePrint = () => {
  //   menuActions.onClose();
  //   console.info('PRINT', row.id);
  // };

  // const handleShare = () => {
  //   menuActions.onClose();
  //   console.info('SHARE', row.id);
  // };

  // const handleDelete = () => {
  //   menuActions.onClose();
  //   console.info('DELETE', row.id);
  // };


// const handleDownload = () => {
//   menuActions.onClose();

//   const data = `Category: ${row.category}\nStatus: ${row.status}`;
//   const blob = new Blob([data], { type: 'text/plain' });

//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = `${row.category}.txt`;
//   link.click();
// };

const handleDownload = () => {
  menuActions.onClose();

  const countText = row.count ?? 0;           // fallback for count
  const statusText = row.status ?? '';        // <-- empty string instead of 'New'
  const data = `Category: ${row.category}\nCount: ${countText}` + 
               (statusText ? `\nStatus: ${statusText}` : '');

  const blob = new Blob([data], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${row.category}.txt`;
  link.click();
};
const handlePrint = () => {
  menuActions.onClose();

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <h3>IPR Details</h3>
    <p>Category: ${row.category}</p>
    <p>Status: ${row.status}</p>
  `);
  printWindow.document.close();
  printWindow.print();
};

const handleShare = async () => {
  menuActions.onClose();

  if (navigator.share) {
    await navigator.share({
      title: 'IPR Details',
      text: `Category: ${row.category}, Status: ${row.status}`,
    });
  } else {
    alert('Sharing not supported on this browser');
  }
};

const handleDelete = () => {
  menuActions.onClose();
  alert(`Deleted: ${row.category}`); // simple working delete for now
};

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      {/* <TableRow>
        <TableCell>{row.invoiceNumber}</TableCell>

        <TableCell>{row.category}</TableCell>

        <TableCell>{fCurrency(row.price)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'progress' && 'warning') ||
              (row.status === 'out of date' && 'error') ||
              'success'
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow> */}



{/* <TableRow>
  <TableCell>{row.category}</TableCell>

  <TableCell>
    <Label
      variant="soft"
      color={
        row.status === 'Approved'
          ? 'success'
          : row.status === 'Pending'
          ? 'warning'
          : 'info'
      }
    >
      {row.status}
    </Label>
  </TableCell>

  <TableCell align="right" sx={{ pr: 1 }}>
    <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
      <Iconify icon="eva:more-vertical-fill" />
    </IconButton>
  </TableCell>
</TableRow> */}
    
  <TableRow>
  <TableCell>{row.category}</TableCell>
  <TableCell>{row.count ?? 0}</TableCell> {/* render count */}
  <TableCell align="right" sx={{ pr: 1 }}>
    <IconButton color={menuActions.open ? 'inherit' : 'default'} onClick={menuActions.onOpen}>
      <Iconify icon="eva:more-vertical-fill" />
    </IconButton>
  </TableCell>
</TableRow>
      {renderMenuActions()}
    </>
  );
}