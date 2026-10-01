import { orderBy } from 'es-toolkit';
import { useMemo, useState } from 'react';
import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useParams, NavLink, useSearchParams } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import {
  Box,
  Container,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  Stack,
  ListSubheader,
  Typography,
  CircularProgress,
  Card,
  // Pagination,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetPatents } from 'src/actions/patent';
import { PATENT_SORT_OPTIONS } from 'src/_mock/_patents';
import { PATENT_DOMAINS } from 'src/config/patent-domain';

import { EmptyContent } from 'src/components/empty-content';

import { PatentSearch } from 'src/sections/innovation-application/patent-search';
import { PatentSort } from 'src/sections/innovation-application/patent-sort-list';
import { PatentListHero } from 'src/sections/innovation-application/patent-list-hero';
import { PatentListHorizontal } from 'src/sections/innovation-application/patents-list-horizontal';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export default function PatentListPage() {
  const { domain, category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageSize = 10;

  const domainConfig = PATENT_DOMAINS[domain];
  const menuHeading = domainConfig?.heading || 'Innovation';
  const subDomains = domainConfig?.subDomains || {};
  const domainName = domainConfig?.label || 'Innovation';

  const {
    patents,
    patentsLoading,
    patentsEmpty,
    totalRecords,
    totalPages,
    currentPage,
    recordsCount,
  } = useGetPatents(domain, category, page, pageSize);

  const [sortBy, setSortBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(totalPages);

  // const dataFiltered = applyFilter({ inputData: patents, sortBy, searchQuery });
  const dataFiltered = useMemo(
    () => applyFilter({ inputData: patents ?? [], sortBy, searchQuery }),
    [patents, sortBy, searchQuery]
  );
  const isEmpty = !patentsLoading && !dataFiltered.length;
  const renderNoData = () => <EmptyContent filled sx={{ py: 10 }} />;
  const isFiltered = Boolean(searchQuery || sortBy !== 'all');
  const displayCount = isFiltered ? dataFiltered.length : totalRecords;
  const tabs = useTabs(category);

  const handlePageChange = (event, newPage) => {
    setSearchParams({ page: newPage });
  };

  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   setSearchParams({ page: 1 });
  // };

  // console.log(dataFiltered);
  // console.log('ROUTE PARAMS =>', { domain, category });

  return (
    <>
      {/* Banner */}
      <PatentListHero domainName={domainName} />
      <Card
        sx={{
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <Box
          sx={{
            gap: 2,
            p: { xs: 2, md: 2 },
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
          }}
        >
          {/* <CustomBreadcrumbs
            links={[
              {
                name: 'Home',
                href: '/',
              },
              {
                name: 'Information & Communication Technology',
              },
            ]}
            sx={{ maxWidth: 1, mx: 'auto', px: { md: 12 } }}
          /> */}
          {/* Search */}
          <PatentSearch onSearch={(query) => setSearchQuery(query)} />

          {/* Patents count */}
          <PatentLabel>
            <span>{displayCount}</span>
            <div>{isFiltered ? 'filtered patents' : 'patents found'}</div>
          </PatentLabel>

          {/* Filter */}
          <PatentSort
            sort={sortBy}
            onSort={(newValue) => setSortBy(newValue)}
            sortOptions={PATENT_SORT_OPTIONS}
          />
        </Box>
      </Card>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Custom sidebar */}
        <RenderContentDesktop domain={domain} category={category} subDomains={subDomains} />
        {/* Custom Tab view */}
        <RenderContentMobile domain={domain} category={category} subDomains={subDomains} />

        <Box sx={{ flex: 1 }}>
          {/* width: 100% */}
          {/* Horizontal patent list */}
          {isEmpty ? (
            renderNoData()
          ) : (
            <>
              <PatentListHorizontal
                domain={domain}
                category={category}
                menuHeading={menuHeading}
                subDomain={subDomains[category]}
                patents={dataFiltered}
                loading={patentsLoading}
              />
            </>
          )}

          <Pagination
            count={totalPages || 0}
            page={currentPage || page}
            onChange={handlePageChange}
            sx={{
              mt: { xs: 5, md: 8 },
              [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
            }}
          />
        </Box>
      </Box>
    </>
  );
}

function RenderContentMobile({ domain, category, subDomains }) {
  return (
    <Box sx={{ display: { md: 'none' } }}>
      <Tabs
        value={category}
        // onChange={tabs.onChange}
        sx={[
          (theme) => ({
            boxShadow: `0px -2px 0px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)} inset`,
          }),
        ]}
      >
        {Object.entries(subDomains).map(([slug, title]) => (
          <Tab
            key={slug}
            label={title}
            value={slug}
            component={NavLink}
            to={paths.innovationApplication.category(domain, slug)}
          />
        ))}
      </Tabs>
    </Box>
  );
}

function RenderContentDesktop({ subDomains, domain, category }) {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'grid' },
        // gap: { md: 4 }
      }}
    >
      <Paper
        elevation={1}
        sx={{
          width: 280,
          height: 'fit-content',
        }}
      >
        {/* <List subheader={<ListSubheader component="div">{domainConfig?.label}</ListSubheader>}> */}

        <List>
          {Object.entries(subDomains).map(([slug, title]) => (
            <ListItemButton
              key={slug}
              component={NavLink}
              to={paths.innovationApplication.category(domain, slug)}
              selected={slug === category}
              sx={{
                '&.active': {
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  fontWeight: 600,
                },
              }}
            >
              <ListItemText primary={title} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

const PatentLabel = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',
  width: 240,
  // maxWidth: 240,
  // border: `1px solid ${theme.palette.divider}`,
  border: '1px solid rgb(205 205 205 / 80%)',
  borderRadius: theme.shape.borderRadius,
  gap: 10,
  fontSize: '0.975rem',
  padding: '14px',
  // marginBottom: theme.spacing(1.5),
  span: {
    height: '24px',
    lineHeight: 1.5,
    cursor: 'default',
    padding: '0px calc(0.75 * var(--spacing))',
    fontSize: '0.875rem',
    fontWeight: 700,
    borderRadius: '6px',
    boxShadow: 'none',
    color: 'var(--palette-success-dark)',
    backgroundColor:
      'rgba(var(--palette-success-mainChannel) / calc(var(--opacity-soft-bg) * 100%))',
    display: 'inline-flex',
    alignItems: 'center',
  },
}));

function applyFilter({ inputData, sortBy, searchQuery }) {
  let data = [...inputData];

  if (searchQuery) {
    data = data.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (sortBy !== 'all') {
    data = data.filter((item) => item.legalStatusCurrent === sortBy);
  }

  data = orderBy(data, ['filingApplicationDate'], ['desc']);

  return data;
}
