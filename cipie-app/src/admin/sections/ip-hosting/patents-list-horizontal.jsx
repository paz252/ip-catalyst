import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';

import { PatentItemHorizontal } from 'src/sections/innovation-application/patent-item-horizontal';

import { PatentListSkeleton } from './patent-skeleton';
// import { useEffect } from 'react';
// ----------------------------------------------------------------------

export function PatentListHorizontal({ domain, subDomain, category, patents, loading }) {
  const renderLoading = () => <PatentListSkeleton variant="horizontal" />;

  function toHyphenCase(str) {
    return str
      .trim()
      .toLowerCase()
      // Replace non-alphanumeric characters (like commas) and spaces with hyphens
      .replace(/[^a-z0-9]+/g, '-')
      // Remove leading or trailing hyphens
      .replace(/^-+|-+$/g, '');
  }

  const renderList = () =>
    patents?.map((patent) => (
      // <Typography key={patent.id}>{patent.title}</Typography>
      <PatentItemHorizontal
        key={patent.id}
        patent={patent}
        detailsHref={paths.innovationApplication.details(domain, category, patent.title)}
        domain={domain}
        subDomain={subDomain ? toHyphenCase(subDomain) : ""}
      />
    ));

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' },
        }}
      >
        {loading ? renderLoading() : renderList()}
      </Box>
    </>
  );
}
