import { Box, Link, Card, Chip, Stack, Typography, Divider } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';
import { PATENT_DOMAINS } from 'src/config/patent-domain';
import CustomTimeline from 'src/pages/innovation-application/CustomTimeline';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PatentItemHorizontal({
  sx,
  patent,
  domain,
  subDomain,
  /*editHref,*/ detailsHref,
  ...other
}) {
  const patentData = patent.isNew
    ? {
        title: patent.header?.title ?? '',
        abstract: patent.patentInformation?.abstract ?? '',
        legalStatusCurrent: patent.header?.legalStatusCurrent ?? '',
        filingApplicationDate: patent.patentInformation?.filingApplicationDate ?? null,
        assignee: patent.patentInformation?.assignee ?? '',
        techSubDomain: patent.patentInformation?.techSubDomain ?? '',
        mainTechnologyDomain: patent.patentInformation?.mainTechnologyDomain ?? '',
        trlLevel: patent.patentInformation?.trlLevel ?? null,
      }
    : {
        title: patent.title ?? '',
        abstract: patent.abstract ?? '',
        legalStatusCurrent: patent.legalStatusCurrent ?? '',
        filingApplicationDate: patent.filingApplicationDate ?? null,
        assignee: patent.assignee ?? '',
        techSubDomain: patent.techSubDomain ?? '',
        mainTechnologyDomain: patent.mainTechnologyDomain ?? '',
        trlLevel: patent.trlLevel ?? null,
      };

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

  function getPatentImage(mainTechnologyDomain, technologySubDomain) {
    const domainKey = getDomainKey(mainTechnologyDomain);

    const subDomainKey = getSubDomainKey(domainKey, technologySubDomain);

    if (domainKey && subDomainKey) {
      return `${CONFIG.assetsDir}/assets/images/innovation-application/${domainKey}/${toHyphenCase(subDomainKey)}.jpg`;
    }

    if (domainKey) {
      return `${CONFIG.assetsDir}/assets/images/patents/ict.jpg`;
    }
    return `${CONFIG.assetsDir}/assets/images/patents/ict.jpg`;
  }

  return (
    <>
      {/* <Card sx={[{ display: 'flex' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}> */}
      <Card
        sx={[
          {
            display: 'flex',
            overflow: 'hidden',
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) => theme.shadows[2],
            transition: (theme) => theme.transitions.create(['transform', 'box-shadow']),
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: (theme) => theme.shadows[8],
            },
            '&:hover img': {
              transform: 'scale(1.05)',
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {/* Patent image and avatar */}
        {/* <Box
          sx={{
            p: 1,
            width: 180,
            height: 240,
            flexShrink: 0,
            position: 'relative',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Image
            alt={patentData.title}
            src={getPatentImage(patentData.mainTechnologyDomain, patentData.techSubDomain)}
            sx={{ height: 1, borderRadius: 1.5 }}
          />
        </Box> */}
        <Box
          sx={{
            p: 1,
            width: 180,
            height: 240,
            flexShrink: 0,
            position: 'relative', // already present
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Image
            alt={patentData.title}
            src={getPatentImage(patentData.mainTechnologyDomain, patentData.techSubDomain)}
            sx={{
              height: 1,
              borderRadius: 1.5,
              transition: (theme) => theme.transitions.create('transform'),
            }}
          />

          {/* Add overlay here */}
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              width: 42,
              height: 42,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2,
            }}
          >
            <Iconify icon="solar:cpu-bold" sx={{ color: 'primary.main' }} />
          </Box>
        </Box>

        <Stack
          spacing={1}
          sx={[
            (theme) => ({
              flexGrow: 1,
              p: theme.spacing(3, 3, 2, 3),
              // p: { xs: theme.spacing(2, 2, 1, 2), md: theme.spacing(3, 3, 2, 3) },
            }),
          ]}
        >
          {/* Patent status and patent filling date */}
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Chip
              label={patentData.legalStatusCurrent}
              icon={<Iconify icon="solar:shield-check-bold" />}
              color={STATUS_COLORS[patentData.legalStatusCurrent] ?? 'default'}
              sx={{ width: 'fit-content' }}
            />

            {/* <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'baseline' }}>
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.primary' }}>
                Application Date
              </Typography>
              <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                {fDate(patentData.filingApplicationDate)}
              </Typography>
            </Box> */}
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Iconify icon="solar:calendar-bold" width={18} sx={{ color: 'text.secondary' }} />

              <Typography variant="body2">{fDate(patentData.filingApplicationDate)}</Typography>
            </Stack>
          </Box>

          {/* Title and patent abstract */}
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Link
              component={RouterLink}
              href={detailsHref}
              state={{ patent }}
              color="inherit"
              variant="h6"
              fontWeight={700}
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                  '&:hover': {
                    color: 'primary.main',
                  },
                  // textAlign: 'justify',
                }),
              ]}
            >
              {patentData.title}
            </Link>

            <Typography
              className="patent-abstract"
              variant="body2"
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                  color: 'text.secondary',
                  // textAlign: 'justify',
                }),
              ]}
            >
              {patentData.abstract}
            </Typography>
          </Stack>

          <Box
            sx={{
              gap: 1.5,
              flexGrow: 1,
              display: 'flex',
              flexWrap: 'wrap',
              typography: 'caption',
              // color: 'text.disabled',
              justifyContent: 'flex-start',
            }}
          >
            {/* <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'baseline' }}>
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.primary' }}>
                Assignee
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {patentData.assignee}
              </Typography>
            </Box> */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'background.neutral',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Assignee
              </Typography>

              <Typography variant="subtitle2">{patentData.assignee}</Typography>
            </Box>
            {/* <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'background.neutral',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Domain
              </Typography>

              <Typography variant="subtitle2">{patentData.mainTechnologyDomain}</Typography>
            </Box> */}

            {/* <Stack spacing={0.5} alignItems="flex-start">
              <Typography variant="caption">Domain</Typography>

              <Typography variant="subtitle2">{patentData.techSubDomain}</Typography>
            </Stack> */}
            {/* <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'baseline' }}>
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.primary' }}>
                Domain
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                {patentData.techSubDomain}
              </Typography>
            </Box> */}
          </Box>

          {/* <HorizontalTimeline /> */}
          {patentData.trlLevel != null && (
            <Box>
              <Divider sx={{ my: 2 }} />

              <CustomTimeline trlLevel={patentData.trlLevel} />
            </Box>
          )}
          {/* </Box> */}
        </Stack>
      </Card>
    </>
  );
}
