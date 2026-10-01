import { useState } from 'react';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Autocomplete,
    TextField,
} from '@mui/material';

export default function DomainSelectionDialog({
    open,
    domains,
    // loading,
    onSubmit,
}) {
    const [domain, setDomain] = useState(null);

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Complete Your Profile</DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Autocomplete
                    options={domains}
                    getOptionLabel={(option) => option.displayName}
                    value={domain}
                    onChange={(_, value) => setDomain(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Domain"
                            margin="normal"
                        />
                    )}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    // disabled={!domain || loading}
                    disabled={!domain}
                    onClick={() => onSubmit(domain)}
                >
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
}