import { useState, useEffect } from 'react';
import { useDebounce } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export function PatentSearch({ onSearch, sx }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedQuery !== query) {
      return;
    }
    //setLoading(true);
    onSearch(debouncedQuery);
    // const timeout = setTimeout(() => setLoading(false), 100); // fake loading
    // return () => clearTimeout(timeout);
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
    // setLoading(false);
    onSearch('');
  };

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: {
          xs: 1,
          md: '100%',
        },
        maxWidth: {
          xs: '100%',
          md: 520, // or 600
        },
        flexGrow: 1,
        p: '10px',
        borderRadius: 'var(--shape-borderRadius)',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        transition: (theme) => theme.transitions.create(['border-color', 'box-shadow']),

        '&:hover': {
          borderColor: 'primary.main',
        },

        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 0 0 3px ${theme.vars.palette.primary.lighter}`,
        },
        ...sx,
      }}
      onSubmit={(e) => e.preventDefault()}
      elevation={1}
    >
      <TextField
        fullWidth
        variant="standard"
        placeholder="Search patent title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        slotProps={{
          input: {
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', ml: 1 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {/* {loading && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />} */}
                {query && (
                  <IconButton
                    size="small"
                    edge="end"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleClear}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') handleClear();
                    }}
                  >
                    <Iconify icon="eva:close-outline" sx={{ color: 'text.disabled' }} />
                  </IconButton>
                )}
              </>
            ),
          },
        }}
      />
    </Box>
  );
}
