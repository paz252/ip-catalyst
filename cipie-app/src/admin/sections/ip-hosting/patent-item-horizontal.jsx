import { useEffect } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';
import { PATENT_DOMAINS } from 'src/config/patent-domain';
import CustomTimeline from 'src/pages/innovation-application/CustomTimeline';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function PatentItemHorizontal({
  sx,
  patent,
  domain,
  subDomain,
  /*editHref,*/ detailsHref,
  ...other
}) {
  // const menuActions = usePopover();

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

  // function old_getPatentImage(patentItem) {
  //   const domainKey = getDomainKey(patentItem.mainTechnologyDomain);
  //   const subDomainKey = getSubDomainKey(domainKey, patentItem.techSubDomain);

  //   if (domainKey && subDomainKey) {
  //     return `${CONFIG.assetsDir}/assets/images/innovation-application/${domainKey}/${toHyphenCase(subDomainKey)}.jpg`;
  //   }

  //   if (domainKey) {
  //     return `${CONFIG.assetsDir}/assets/images/patents/ict.jpg`;
  //   }

  //   // return `${CONFIG.assetsDir}/assets/images/patents/ict.jpg`;
  // }

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

  return (
    <>
      <Card sx={[{ display: 'flex' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
        {/* Patent image and avatar */}
        <Box
          sx={{
            p: 1,
            width: 180,
            height: 240,
            flexShrink: 0,
            position: 'relative',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {/* <Avatar
            alt={patent.assignee}
            src={`${CONFIG.assetsDir}/assets/images/mock/avatar/avatar-1.webp`}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
            }}
          /> */}
          <Image
            alt={patent.title}
            // src={`${CONFIG.assetsDir}/assets/images/patents/cover-3.webp`}
            // src={`${CONFIG.assetsDir}/assets/images/innovation-application/${domain}/${subDomain}.jpg`}
            src={getPatentImage(patent)}
            //  src={PATENT_DOMAINS[domain]?.image || `${CONFIG.assetsDir}/assets/images/patents/cover-3.webp`}
            sx={{ height: 1, borderRadius: 1.5 }}
          />
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
            <Label
              variant="soft"
              color={
                (patent.legalStatusCurrent === 'ACTIVE - GRANTED' && 'primary') ||
                (patent.legalStatusCurrent === 'INACTIVE - WITHDRAWN / SURRENDERED' && 'warning') ||
                'info'
              }
            >
              {patent.legalStatusCurrent}
            </Label>

            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'baseline' }}>
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.primary' }}>
                Application Date
              </Typography>
              <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                {fDate(patent.filingApplicationDate)}
              </Typography>
            </Box>
          </Box>

          {/* Title and patent abstract */}
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Link
              component={RouterLink}
              href={detailsHref}
              state={{ patent }}
              color="inherit"
              variant="subtitle2"
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                }),
              ]}
            >
              {patent.title}
            </Link>

            <Typography
              variant="body2"
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                  color: 'text.secondary',
                }),
              ]}
            >
              {patent.abstract}
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
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'baseline' }}>
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.primary' }}>
                Assignee
              </Typography>
              <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                {patent.assignee}
              </Typography>
            </Box>

            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'baseline' }}>
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.primary' }}>
                Domain
              </Typography>
              <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                {patent.techSubDomain}
              </Typography>
            </Box>

            {/* <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'baseline' }}>
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.primary' }}>
                Record No.
              </Typography>
              <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                {patent.recordNumber}
              </Typography>
            </Box> */}
          </Box>
          <Box>
            {/* <HorizontalTimeline /> */}
            <CustomTimeline trlLevel={patent.trlLevel} />
          </Box>
          {/* </Box> */}
        </Stack>
      </Card>
    </>
  );
}
