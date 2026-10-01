import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { useTheme, useMediaQuery } from '@mui/material';
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
  Chip,
  Divider,
} from '@mui/material';

import { useGetMyPriorArts } from 'src/actions/~priorArt';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PriorArtSelector({ value, onChange }) {
  const modal = useBoolean();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { myPriorArts, myPriorArtsLoading } = useGetMyPriorArts();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  // ✅ Filter: Submitted + Search
  const filtered = myPriorArts
    .filter((x) => x.status === 'Approved')
    .filter((item) => {
      const text = `${item.fileNumber} ${item.title}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });

  // ----------------------------------------------------------------------

  const handleSelect = (item) => setSelected(item);

  const handleConfirm = () => {
    onChange(selected?.applicationId || '');
    modal.onFalse();
  };

  const handleClear = () => {
    setSelected(null);
    onChange('');
  };

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
                border: `1px dashed ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {selectedFromList?.fileNumber || 'Selected'}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', fontSize: '0.7rem' }}
                >
                  {selectedFromList?.title}
                </Typography>
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
              variant="soft"
              // color="primary"
              startIcon={<Iconify icon="eva:search-outline" />}
              onClick={modal.onTrue}
              sx={{ mb: 1 }}
            >
              Select Prior Art
            </Button>
          )}
        </Stack>
      </Card>

      {/* ================= MODAL ================= */}
      <Dialog
        open={modal.value}
        onClose={modal.onFalse}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
      >
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
              <Box textAlign="center" py={4}>
                <CircularProgress size={28} />
              </Box>
            ) : isMobile ? (
              /* ================= MOBILE VIEW ================= */
              <Box
                sx={{
                  maxHeight: '65vh',
                  overflowY: 'auto',
                }}
              >
                <Stack spacing={1.5}>
                  {filtered.length === 0 && (
                    <Typography variant="caption" textAlign="center">
                      No approved prior art found
                    </Typography>
                  )}

                  {filtered.map((row) => {
                    const isSelected = selected?.applicationId === row.applicationId;

                    return (
                      <Card
                        key={row.applicationId}
                        onClick={() => handleSelect(row)}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          cursor: 'pointer',
                          border: `1px solid ${
                            isSelected ? theme.palette.primary.main : theme.palette.divider
                          }`,
                          bgcolor: isSelected ? 'primary.lighter' : 'background.paper',
                        }}
                      >
                        <Stack spacing={0.5}>
                          <Typography variant="caption" fontWeight={600}>
                            {row.applicationId}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {row.title}
                          </Typography>

                          <Box>
                            <Chip label={row.status} size="small" color="success" variant="soft" />
                          </Box>
                        </Stack>
                      </Card>
                    );
                  })}
                </Stack>
              </Box>
            ) : (
              /* ================= DESKTOP TABLE ================= */
              <Box
                sx={{
                  maxHeight: 350,
                  overflowY: 'auto',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>File No</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="caption">No approved prior art found</Typography>
                        </TableCell>
                      </TableRow>
                    )}

                    {filtered.map((row) => {
                      const isSelected = selected?.applicationId === row.applicationId;

                      return (
                        <TableRow key={row.applicationId} hover selected={isSelected}>
                          <TableCell>
                            <Typography variant="caption">{row.applicationId}</Typography>
                          </TableCell>

                          <TableCell sx={{ maxWidth: 320 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                              title={row.title}
                            >
                              {row.title}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip label={row.status} size="small" color="success" variant="soft" />
                          </TableCell>

                          <TableCell align="right">
                            <Button
                              size="small"
                              variant={isSelected ? 'contained' : 'soft'}
                              color="info"
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
              </Box>
            )}

            {/* ACTIONS */}
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1, mb: 2 }}>
              <Button variant="soft" onClick={modal.onFalse}>
                Cancel
              </Button>

              <Button variant="soft" color="info" disabled={!selected} onClick={handleConfirm}>
                Confirm Selection
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
