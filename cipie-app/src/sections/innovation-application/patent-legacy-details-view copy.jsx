// import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
// import { Card, Tab, Tabs } from '@mui/material';
// import Typography from '@mui/material/Typography';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fShortenNumber } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';
import { PATENT_DOMAINS } from 'src/config/patent-domain';
// import { PATENT_DETAILS_TAB_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PatentDetailsSkeleton } from './patent-skeleton';
import { PatentDetailsHero } from './patent-details-hero';
import PatentDetailsTabView from './patent-details-tab-view';

export function PatentLegacyDetailsView({ domain, category, patent }) {
  // console.log('PatentDetailsView', domain, category);

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
        maxWidth={false}
        sx={[
          (theme) => ({
            px: { md: 'unset' },
            py: 3,
            // mb: 5,
            borderBottom: `solid 1px ${theme.vars.palette.divider}`,
          }),
        ]}
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
          sx={{ maxWidth: 1, mx: 'auto', px: { md: 12 } }}
        />
      </Container>
      <PatentDetailsHero
        title={patent?.title ?? ''}
        author={patent?.assignee}
        // coverUrl={`${CONFIG.assetsDir}/assets/images/patents/cover-1.webp`}
        createdAt={patent?.filingApplicationDate}
      />

      <Container maxWidth={false} sx={{ px: { md: 5 } }}>
        <Stack
          sx={{
            // maxWidth: 720,
            // maxWidth: 1,
            mx: 'auto',
            px: { md: 12 },
            mt: 2,
          }}
        >
          {/* <Typography variant="subtitle1">{patent?.abstract}</Typography> */}
          <Stack
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 10,
            }}
          >
            <Box
              component="img"
              alt="Patent Cover"
              // src={`${CONFIG.assetsDir}/assets/images/patents/cover-3.webp`}
              src={getPatentImage(patent)}
              sx={{
                width: { xs: '80%', md: '20%' },
                borderRadius: 1,
                p: 1,
                border: '1px solid gray',
              }}
            />
            {/* <Stack> */}
            {/* <Card> */}
            <PatentDetailsTabView patent={patent} />
            {/* </Card> */}
            {/* </Stack> */}
          </Stack>

          <Divider sx={{ mt: 5, mb: 2 }} />
        </Stack>
      </Container>
    </>
  );
}
