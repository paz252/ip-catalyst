import { orderBy } from 'es-toolkit';
import { useMemo, useState } from 'react';
import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';
import { useParams, NavLink, useSearchParams } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  Stack,
  Typography,
  Card,
  Chip,
  // Pagination,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { PATENT_SORT_OPTIONS } from 'src/_mock/_patents';
import { PATENT_DOMAINS } from 'src/config/patent-domain';
import { useGetAllPatents, useGetPatents } from 'src/actions/patent';

import { Iconify } from 'src/components/iconify';
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

  const isAllPatents = domain === 'all' && category === 'patents';

  const domainConfig = PATENT_DOMAINS[domain];
  const menuHeading = domainConfig?.heading || 'Innovation';
  const subDomains = domainConfig?.subDomains || {};
  const domainName = isAllPatents
    ? 'All Technologies Patents'
    : domainConfig?.label || 'Innovation';

  // console.log('Domain Config =>', {
  //   domain,
  //   category,
  //   page,
  //   pageSize,
  //   isAllPatents,
  //   domainConfig,
  // });
  const patentsQuery = useGetPatents(domain, category, page, pageSize, {
    enabled: !isAllPatents,
  });

  const allPatentsQuery = useGetAllPatents(page, pageSize, {
    enabled: isAllPatents,
  });

  // console.log(isAllPatents);

  const activeQuery = isAllPatents ? allPatentsQuery : patentsQuery;

  const {
    patents,
    patentsLoading,
    patentsEmpty,
    totalRecords,
    totalPages,
    currentPage,
    recordsCount,
  } = activeQuery;

  const [sortBy, setSortBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <>
      {/* Banner */}
      <PatentListHero domainName={domainName} domain={domain} />

      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: (theme) => theme.customShadows?.card,
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <Box
          sx={{
            p: 3,
            display: 'flex',
            gap: 2,
            width: 1,
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            alignItems: {
              xs: 'center',
              md: 'center',
            },
            justifyContent: 'space-between',
          }}
        >
          <PatentSearch onSearch={(query) => setSearchQuery(query)} />

          {/* <PatentLabel>
            <span>{displayCount}</span>
            <div>{isFiltered ? 'filtered patents' : 'patents found'}</div>
          </PatentLabel> */}

          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              width: {
                xs: '100%',
                md: 'auto',
              },
            }}
          >
            <PatentSort
              sort={sortBy}
              onSort={(newValue) => setSortBy(newValue)}
              sortOptions={PATENT_SORT_OPTIONS}
            />
            <Chip
              color="primary"
              variant="soft"
              icon={<Iconify icon="solar:document-bold" />}
              label={`${displayCount} Patents`}
              sx={{
                py: 2,
                justifyContent: 'center',
              }}
            />
          </Box>
        </Box>
      </Card>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {!isAllPatents && (
          <>
            {/* Desktop Sidebar */}
            <RenderContentDesktop
              domain={domain}
              category={category}
              subDomains={subDomains}
              isAllPatents={isAllPatents}
            />

            {/* Mobile Tabs */}
            <RenderContentMobile
              domain={domain}
              category={category}
              subDomains={subDomains}
              isAllPatents={isAllPatents}
            />
          </>
        )}

        <Box sx={{ flex: 1 }}>
          {isEmpty ? (
            renderNoData()
          ) : (
            <PatentListHorizontal
              domain={domain}
              category={category}
              menuHeading={menuHeading}
              subDomain={subDomains[category]}
              patents={dataFiltered}
              loading={patentsLoading}
            />
          )}

          <Pagination
            count={totalPages || 0}
            page={currentPage || page}
            onChange={handlePageChange}
            sx={{
              mt: { xs: 5, md: 8 },
              mb: { xs: 5, md: 10 },
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
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        // justifyContent="center"
        sx={{ mb: 2, mx: 1 }}
      >
        <Iconify icon="solar:widget-5-bold" sx={{ color: 'primary.main' }} />

        <Typography variant="subtitle2">Technology Categories</Typography>
      </Stack>
      <Tabs
        value={category}
        variant="scrollable"
        scrollButtons="auto"
        sx={[
          (theme) => ({
            boxShadow: `0px -2px 0px 0px ${varAlpha(
              theme.vars.palette.grey['500Channel'],
              0.08
            )} inset`,

            '& .MuiTabs-indicator': {
              display: 'none',
            },

            '& .MuiTabs-flexContainer': {
              gap: 1,
            },

            '& .MuiTab-root': {
              minHeight: 42,
              minWidth: 'auto',
              px: 2,
              py: 1,
              borderRadius: 99,
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all .2s ease',
            },

            '& .Mui-selected': {
              backgroundColor: theme.vars.palette.primary.lighter,
              color: theme.vars.palette.primary.main,
            },
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
            sx={{
              borderRadius: 99,
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 42,
              px: 2,

              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                color: 'primary.main',
              },
              // transition: 'all .25s',

              // '&:hover': {
              //   bgcolor: 'action.hover',
              // },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

function RenderContentDesktop({ subDomains, domain, category }) {
  const domainLabel = PATENT_DOMAINS[domain]?.label;
  // console.log(domain);
  return (
    <Box
      sx={{
        display: {
          xs: 'none',
          md: 'block',
        },
        width: 280,

        position: 'sticky',
        top: 100,
        alignSelf: 'flex-start',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          // borderRadius: 1,
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: (theme) => theme.shadows[2],
          transition: (theme) => theme.transitions.create(['transform', 'box-shadow']),
          bgcolor: 'background.paper',
        }}
      >
        {/* Header */}
        {/* <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            px: 1,
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {domainLabel}
        </Typography> */}
        <Stack direction="row" alignItems="flex-start" gap={1}>
          <Box
            component="img"
            src={`${CONFIG.assetsDir}/assets/images/home/browse-patents/icons/${domain}.svg`}
            alt={domain}
            sx={{ width: 30, height: 30 }}
          />
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.4,
              letterSpacing: 0.2,

              color: 'text.primary',

              // px: 1,
              mb: 2,

              position: 'relative',

              // subtle accent line (premium touch)
              '&::after': {
                content: '""',
                display: 'block',
                width: 24,
                height: 3,
                mt: 1,
                borderRadius: 2,
                bgcolor: 'primary.main',
              },
            }}
          >
            {domainLabel}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {Object.keys(subDomains).length} Categories
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            height: 1,
            bgcolor: 'divider',
            mb: 1,
            opacity: 0.6,
          }}
        />

        {/* List */}
        <List disablePadding>
          {Object.entries(subDomains).map(([slug, title]) => {
            const isActive = slug === category;

            return (
              <ListItemButton
                key={slug}
                component={NavLink}
                to={paths.innovationApplication.category(domain, slug)}
                sx={{
                  mb: 0.5,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  position: 'relative',

                  transform: isActive ? 'translateX(0)' : 'translateX(0)',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 600 : 500,
                  bgcolor: isActive ? 'primary.lighter' : 'transparent',
                  boxShadow: isActive ? 1 : 0,

                  transition: 'all 0.2s ease',

                  '&:hover': {
                    transform: 'translateX(4px)',
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  },

                  // Left indicator (premium touch)
                  '&::before': isActive
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 6,
                        bottom: 6,
                        width: 3,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                      }
                    : {},
                }}
              >
                <ListItemText
                  primary={title}
                  primaryTypographyProps={{
                    fontSize: 14,
                    lineHeight: 1.4,
                  }}
                />
              </ListItemButton>
            );
          })}
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
  // console.log({
  //   sortBy,
  //   backendStatus: inputData?.[0]?.legalStatusCurrent,
  // });
  let data = [...inputData];

  if (searchQuery) {
    data = data.filter((item) => item?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (sortBy !== 'all') {
    data = data.filter(
      (item) => item.legalStatusCurrent?.trim().toLowerCase() === sortBy.trim().toLowerCase()
    );
  }

  data = orderBy(data, ['filingApplicationDate'], ['desc']);

  return data;
}
