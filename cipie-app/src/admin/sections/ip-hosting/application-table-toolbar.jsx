import { useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

export const SERVICE_LABELS = {
    PRIOR_ART: 'Prior Art Search',
    TRADEMARK: 'Trademark',
    COPYRIGHT: 'Copyright',
    INDIAN_PATENT_FILING: 'Indian Patent Filing',
    INTERNATIONAL_PATENT_FILING: 'International Patent Filing',
    USER_QUERY: 'User Query',
};

export function ApplicationTableToolbar({
    filters,
    dateError,
    options,
    onResetPage,
}) {
    const menuActions = usePopover();

    const { state: currentFilters, setState: updateFilters } = filters;


    const handleFilterSearch = useCallback(
        (event) => {
            onResetPage();

            updateFilters({
                search: event.target.value,
            });
        },
        [onResetPage, updateFilters]
    );

    const handleFilterService = useCallback(
        (event) => {
            const newValue =
                typeof event.target.value === 'string'
                    ? event.target.value.split(',')
                    : event.target.value;

            onResetPage();

            updateFilters({
                service: newValue,
            });
        },
        [onResetPage, updateFilters]
    );

    const handleFilterStartDate = useCallback(
        (newValue) => {
            onResetPage();
            updateFilters({ startDate: newValue });
        },
        [onResetPage, updateFilters]
    );

    const handleFilterEndDate = useCallback(
        (newValue) => {
            onResetPage();
            updateFilters({ endDate: newValue });
        },
        [onResetPage, updateFilters]
    );


    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                <MenuItem onClick={() => menuActions.onClose()}>
                    <Iconify icon="solar:printer-minimalistic-bold" />
                    Print
                </MenuItem>

                <MenuItem onClick={() => menuActions.onClose()}>
                    <Iconify icon="solar:import-bold" />
                    Import
                </MenuItem>

                <MenuItem onClick={() => menuActions.onClose()}>
                    <Iconify icon="solar:export-bold" />
                    Export
                </MenuItem>
            </MenuList>
        </CustomPopover>
    );

    return (
        <>
            <Box
                sx={{
                    p: 2.5,
                    gap: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                }}
            >
                {/* <FormControl sx={{ width: { xs: 1, md: 300 } }}>
                    <InputLabel>Service</InputLabel>

                    <Select
                        multiple
                        label="Service"
                        value={currentFilters.service}
                        onChange={handleFilterService}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {options.services.map((service) => (
                            <MenuItem
                                key={service}
                                value={service}
                            >
                                <Checkbox
                                    checked={currentFilters.service.includes(service)}
                                />
                                {SERVICE_LABELS[service] || service}

                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> */}

                <DatePicker
                    label="Start date"
                    value={currentFilters.startDate}
                    onChange={handleFilterStartDate}
                    sx={{ maxWidth: { md: 180 } }}
                />

                <DatePicker
                    label="End date"
                    value={currentFilters.endDate}
                    onChange={handleFilterEndDate}
                    slotProps={{
                        textField: {
                            error: dateError,
                            helperText: dateError ? 'End date must be later than start date' : null,
                        },
                    }}
                    sx={{
                        maxWidth: { md: 180 },
                        [`& .${formHelperTextClasses.root}`]: {
                            bottom: { md: -40 },
                            position: { md: 'absolute' },
                        },
                    }}
                />

                <Box
                    sx={{
                        gap: 2,
                        width: 1,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        fullWidth
                        value={currentFilters.search}
                        onChange={handleFilterSearch}
                        placeholder="Search applicant, email, domain..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* <IconButton onClick={menuActions.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton> */}
                </Box>

            </Box>
            {/* {renderMenuActions()} */}
        </>
    );
}