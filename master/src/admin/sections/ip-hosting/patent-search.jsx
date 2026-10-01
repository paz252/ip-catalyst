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
        width: 1,
        maxWidth: 240,
        p: '10px',
        borderRadius: 'var(--shape-borderRadius)',
        border: '1px solid rgb(205 205 205 / 80%)',
        ...sx,
      }}
      onSubmit={(e) => e.preventDefault()}
      elevation={1}
    >
      <TextField
        fullWidth
        variant="standard"
        placeholder="Search..."
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
