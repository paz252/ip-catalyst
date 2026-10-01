import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

export function LogoChallengeTableFiltersResult({ filters, totalResults, onResetPage, sx }) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemoveDate = useCallback(() => {
    onResetPage();
    updateFilters({ startDate: null, endDate: null });
  }, [onResetPage, updateFilters]);

  const handleRemoveSearch = useCallback(() => {
    onResetPage();
    updateFilters({ search: '' });
  }, [onResetPage, updateFilters]);

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={() => {
        resetFilters();
        onResetPage();
      }}
      sx={sx}
    >
      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'all'}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Date:"
        isShow={Boolean(currentFilters.startDate && currentFilters.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(currentFilters.startDate, currentFilters.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.search}>
        <Chip {...chipProps} label={currentFilters.search} onDelete={handleRemoveSearch} />
      </FiltersBlock>
    </FiltersResult>
  );
}
