import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// ----------------------------------------------------------------------

export function PatentSort({ sort, sortOptions, onSort }) {
  const handleChange = (event) => {
    onSort(event.target.value);
  };

  return (
    <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
      <InputLabel>Sort by</InputLabel>

      <Select
        value={sort}
        label="Sort by"
        onChange={handleChange}
        MenuProps={{
          slotProps: {
            paper: {
              sx: { maxHeight: 240 },
            },
          },
        }}
      >
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
