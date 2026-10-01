import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export function DiscardChangesDialog({ open, onCancel, onDiscard }) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Discard changes?</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          You have unsaved changes. If you leave now, your changes will be lost.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Continue Editing</Button>

        <Button color="error" variant="contained" onClick={onDiscard}>
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
}
