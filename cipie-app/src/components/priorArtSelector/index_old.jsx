import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import {
  Box,
  Card,
  Button,
  Dialog,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { useGetMyPriorArts } from 'src/actions/~priorArt'; // ✅ YOUR HOOK

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PriorArtSelector({ value, onChange }) {
  const modal = useBoolean();

  const { myPriorArts, myPriorArtsLoading } = useGetMyPriorArts();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  // ----------------------------------------------------------------------

  const filtered = myPriorArts.filter((item) => {
    const text = `${item.fileNumber} ${item.title}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  // ----------------------------------------------------------------------

  const handleSelect = (item) => {
    setSelected(item);
  };

  const handleConfirm = () => {
    onChange(selected?.applicationId || '');
    modal.onFalse();
  };

  const handleClear = () => {
    setSelected(null);
    onChange('');
  };

  // ----------------------------------------------------------------------

  const selectedFromList = myPriorArts.find((x) => x.applicationId === value) || selected;

  // ----------------------------------------------------------------------

  return (
    <>
      {/* ================= SELECTED CARD ================= */}
      <Card sx={{ p: 2, borderRadius: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Prior Art Application</Typography>

          {value ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'grey.100',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {selectedFromList?.applicationId || 'Selected'}
                </Typography>

                <Typography variant="caption">{selectedFromList?.title}</Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <IconButton onClick={modal.onTrue}>
                  <Iconify icon="eva:edit-outline" />
                </IconButton>

                <IconButton onClick={handleClear}>
                  <Iconify icon="eva:close-outline" />
                </IconButton>
              </Stack>
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:search-outline" />}
              onClick={modal.onTrue}
            >
              Select Prior Art
            </Button>
          )}
        </Stack>
      </Card>

      {/* ================= MODAL ================= */}
      <Dialog open={modal.value} onClose={modal.onFalse} fullWidth maxWidth="md">
        <DialogTitle>Select Prior Art</DialogTitle>

        <DialogContent>
          <Stack spacing={2}>
            {/* SEARCH */}
            <TextField
              size="small"
              placeholder="Search by file number or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* LOADING */}
            {myPriorArtsLoading ? (
              <Box textAlign="center" py={3}>
                <CircularProgress size={28} />
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>File No</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered.map((row) => {
                    const isSelected = selected?.applicationId === row.applicationId;

                    return (
                      <TableRow key={row.applicationId} hover selected={isSelected}>
                        <TableCell>{row.applicationId}</TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.status}</TableCell>

                        <TableCell align="right">
                          <Button
                            size="small"
                            variant={isSelected ? 'contained' : 'outlined'}
                            onClick={() => handleSelect(row)}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}

            {/* ACTIONS */}
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={modal.onFalse}>Cancel</Button>

              <Button variant="contained" disabled={!selected} onClick={handleConfirm}>
                Confirm Selection
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
