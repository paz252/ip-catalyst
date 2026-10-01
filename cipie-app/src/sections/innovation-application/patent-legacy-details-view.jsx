import {
  Card,
  Chip,
  Grid,
  Typography,
  Box,
  Stack,
  Button,
  Container,
  Divider,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { DOMAIN_ICONS, PATENT_DOMAINS } from 'src/config/patent-domain';
import CustomTimeline from 'src/pages/innovation-application/CustomTimeline';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PatentDetailsSkeleton } from './patent-skeleton';
import PatentDetailsNewTabView from './patent-details-new-tab-view';

export function PatentLegacyDetailsView({ domain, category, patent }) {
  const STATUS_COLORS = {
    'Active - Granted': 'success',
    'Active - Applied': 'info',
    'Inactive - Expired': 'error',
    'Inactive - Withdrawn / Surrendered': 'warning',
    'Inactive - Nonpayment': 'warning',
  };

  function getDomainKey(domainLabel) {
    return Object.entries(PATENT_DOMAINS).find(([, value]) => value?.label === domainLabel)?.[0];
  }

  function getSubDomainKey(domainKey, subDomainLabel) {
    if (!domainKey) return null;

    const subDomains = PATENT_DOMAINS[domainKey]?.subDomains;

    return Object.entries(subDomains || {}).find(
      ([, value]) => value && subDomainLabel && value.toLowerCase() === subDomainLabel.toLowerCase()
    )?.[0];
  }

  function toHyphenCase(str) {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function getPatentImage(patentItem) {
    const domainKey = getDomainKey(patentItem.mainTechnologyDomain);

    const subDomainKey = getSubDomainKey(domainKey, patentItem.techSubDomain);

    if (domainKey && subDomainKey) {
      return `${CONFIG.assetsDir}/assets/images/innovation-application/${domainKey}/${toHyphenCase(subDomainKey)}.jpg`;
    }

    if (domainKey) {
      return `${CONFIG.assetsDir}/assets/images/patents/ict.jpg`;
    }
    return `${CONFIG.assetsDir}/assets/images/patents/ict.jpg`;
  }

  if (!patent) {
    return <PatentDetailsSkeleton />;
  }

  if (patent.length === 0) {
    return (
      <Container sx={{ mt: 5, mb: 10 }}>
        <EmptyContent
          filled
          title="Patent not found!"
          action={
            <Button
              component={RouterLink}
              href={paths.innovationApplication.root}
              startIcon={<Iconify width={16} icon="eva:arrow-ios-back-fill" />}
              sx={{ mt: 3 }}
            >
              Back to list
            </Button>
          }
          sx={{ py: 10 }}
        />
      </Container>
    );
  }
  // console.log(`Patent =>`, patent);
  return (
    <>
      <Container
        // disableGutters
        maxWidth="xl"
        sx={{
          // px: { xs: 2, md: 8 },
          py: 4,
        }}
      >
        <CustomBreadcrumbs
          className="breadcrumb"
          links={[
            {
              name: 'Home',
              href: '/',
            },
            {
              name: patent.mainTechnologyDomain,
              href: paths.innovationApplication.domain(domain),
            },
            {
              name: patent.techSubDomain,
              href: paths.innovationApplication.category(domain, category),
            },
            {
              name: patent.recordNumber,
            },
          ]}
          sx={{ my: 4 }}
        />
        <Card
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) => theme.customShadows.card,
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                position: 'absolute',
                top: 15,
                right: 15,
                width: 56,
                height: 56,
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                bgcolor: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: (theme) => theme.shadows[4],

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                zIndex: 2,

                animation: 'glow 3s ease-in-out infinite',

                '@keyframes glow': {
                  '0%': {
                    boxShadow: '0 0 0 rgba(59,130,246,0)',
                  },
                  '50%': {
                    boxShadow: '0 0 20px rgba(59,130,246,.35)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 rgba(59,130,246,0)',
                  },
                },
              }}
            >
              <Iconify
                className="hero-tech-icon"
                icon={DOMAIN_ICONS[patent.mainTechnologyDomain] ?? 'solar:lightbulb-bold'}
                width={30}
                sx={{
                  color: 'primary.main',

                  animation: 'technologyFloat 5s ease-in-out infinite',

                  '@keyframes technologyFloat': {
                    '0%': {
                      transform: 'translateY(0px) rotate(0deg)',
                    },
                    '25%': {
                      transform: 'translateY(-4px) rotate(4deg)',
                    },
                    '50%': {
                      transform: 'translateY(0px) rotate(0deg)',
                    },
                    '75%': {
                      transform: 'translateY(-4px) rotate(-4deg)',
                    },
                    '100%': {
                      transform: 'translateY(0px) rotate(0deg)',
                    },
                  },
                }}
              />
            </Box>
            <Chip
              variant="soft"
              label={patent.legalStatusCurrent}
              color="success"
              icon={<Iconify icon="solar:shield-check-bold" />}
              sx={{ width: 'fit-content', fontWeight: 700, px: 1, height: 34 }}
            />

            <Typography
              variant="h3"
              fontWeight={800}
              letterSpacing={-0.5}
              sx={{
                lineHeight: 1.25,
                transition: 'color .25s',

                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {patent.title}
            </Typography>

            <Typography color="text.secondary">{patent.abstract}</Typography>
          </Stack>
          <Divider sx={{ my: 2, opacity: 0.7 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={patent.mainTechnologyDomain}
              color="info"
              icon={<Iconify width={20} icon="solar:layers-bold" />}
              sx={{ width: 'fit-content', fontWeight: 700, px: 1 }}
            />
            <Chip
              label={patent.techSubDomain}
              color="info"
              width={20}
              icon={<Iconify width={15} icon="solar:folder-bold" />}
              sx={{ width: 'fit-content', fontWeight: 700, px: 1 }}
            />
            {/* <Chip size="small" label={`TRL ${trl}`} /> */}
          </Stack>
          {/* <Chip
            icon={<Iconify icon="solar:shield-check-bold" />}
            label={patent.legalStatusCurrent}
            color={STATUS_COLORS[patent.legalStatusCurrent] ?? 'default'}
            sx={{ mb: 2 }}
          />
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              lineHeight: 1.25,
            }}
          >
            {patent.title}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              //   maxWidth: 900,
              lineHeight: 1.8,
            }}
          >
            {patent.abstract}
          </Typography> */}

          <Box
            sx={{
              p: 3,
              bgcolor: 'background.neutral',
              borderRadius: 3,
              my: 4,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Iconify icon="solar:rocket-bold" width={22} sx={{ color: 'primary.main' }} />

                <Typography variant="subtitle">Technology Readiness Level</Typography>
              </Stack>

              <Chip size="small" color="primary" label={`TRL ${patent.trlLevel}`} />
            </Stack>
            <CustomTimeline trlLevel={patent.trlLevel} />
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
                  <Iconify icon="solar:gallery-bold" width={24} sx={{ color: 'primary.main' }} />

                  <Typography variant="h6" fontWeight={700}>
                    Innovation Media
                  </Typography>
                </Stack>
                <Box
                  component="img"
                  alt="Patent Cover"
                  // src={`${CONFIG.assetsDir}/assets/images/patents/cover-3.webp`}
                  src={getPatentImage(patent)}
                  sx={{
                    width: 1,
                    height: 220,
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: (theme) => theme.customShadows.card,
                    transition: 'transform .3s',

                    '&:hover': {
                      transform: 'scale(1.03)',
                    },
                  }}
                />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 'none',
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 3 }}>
                  <Iconify
                    icon="solar:document-text-bold"
                    width={24}
                    sx={{ color: 'primary.main' }}
                  />

                  <Typography variant="h6" fontWeight={700}>
                    Patent Information
                  </Typography>
                </Stack>
                <PatentDetailsNewTabView patent={patent} />
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
}
