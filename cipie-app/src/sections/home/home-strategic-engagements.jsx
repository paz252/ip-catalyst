import { m } from 'framer-motion';
import { useTabs } from 'minimal-shared/hooks';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { varFade, varScale, MotionViewport } from 'src/components/animate';

import { SectionTitle } from './components/section-title';
import { FloatLine, FloatXIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

export function HomeStrategicEngagements({ sx, ...other }) {
  const tabs = useTabs('Technology Licensing');

  const renderDescription = () => (
    <SectionTitle
      // caption="plans"
      title="Our Strategic"
      txtGradient="Engagements"
      // description="Choose from flexible pricing options designed to fit your business needs and budget with no hidden fees."
      sx={{ mb: 2, textAlign: 'center' }}
    />
  );

  const renderContentDesktop = () => (
    <Box
      gridTemplateColumns="repeat(3, 1fr)"
      sx={{ display: { xs: 'none', md: 'grid' }, gap: { md: 4 } }}
    >
      {ENGAGEMENTS_DATA.map((data) => (
        <PlanCard
          key={data.title}
          option={data}
          // sx={(theme) => ({
          //   ...(data.title === 'Co-Development Projects' && {
          //     [theme.breakpoints.down(1440)]: {
          //       borderLeft: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          //       borderRight: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          //     },
          //   }),
          // })}
        />
      ))}
    </Box>
  );

  const renderContentMobile = () => (
    <Stack spacing={5} alignItems="center" sx={{ display: { md: 'none' } }}>
      <Tabs
        value={tabs.value}
        onChange={tabs.onChange}
        sx={[
          (theme) => ({
            boxShadow: `0px -2px 0px 0px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)} inset`,
          }),
        ]}
      >
        {ENGAGEMENTS_DATA.map((tab) => (
          <Tab key={tab.title} value={tab.title} label={tab.title} />
        ))}
      </Tabs>

      <Box
        sx={[
          (theme) => ({
            width: 1,
            borderRadius: 2,
            // border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          }),
        ]}
      >
        {ENGAGEMENTS_DATA.map(
          (tab) => tab.title === tabs.value && <PlanCard key={tab.title} option={tab} />
        )}
      </Box>
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[{ py: 0, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>
        <FloatLine vertical sx={{ top: 0, left: 80 }} />

        <Container>{renderDescription()}</Container>

        <Box
          sx={(theme) => ({
            position: 'relative',
            '&::before, &::after': {
              width: 64,
              height: 64,
              content: "''",
              [theme.breakpoints.up(1440)]: { display: 'block' },
            },
          })}
        >
          <Container>{renderContentDesktop()}</Container>

          <FloatLine sx={{ top: 64, left: 0 }} />
          <FloatLine sx={{ bottom: 64, left: 0 }} />
        </Box>

        <Container>{renderContentMobile()}</Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

const renderLines = () => (
  <>
    <FloatLine vertical sx={{ top: -64, left: 0, height: 'calc(100% + (64px * 2))' }} />
    <FloatLine vertical sx={{ top: -64, right: 0, height: 'calc(100% + (64px * 2))' }} />
    <FloatXIcon sx={{ top: -8, left: -8 }} />
    <FloatXIcon sx={{ top: -8, right: -8 }} />
    <FloatXIcon sx={{ bottom: -8, left: -8 }} />
    <FloatXIcon sx={{ bottom: -8, right: -8 }} />
  </>
);

function PlanCard({ option, sx, ...other }) {
  const technology = option.title === 'Technology Licensing';

  const coDevelopment = option.title === 'Co-Development Projects';

  return (
    <MotionViewport>
      <Box
        sx={[
          (theme) => ({
            px: 4,
            py: 4,
            gap: 5,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            border: `solid 1px ${theme.vars.palette.grey[300]}`,
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {/* {coDevelopment && renderLines()} */}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Box sx={{ gap: 2, display: 'flex', justifyContent: 'center' }}>
              <Box
                component={m.img}
                variants={varFade('in')}
                key={option.icons}
                alt={`${option.title} Icon`}
                src={option.icons}
                sx={{
                  width: 70,
                  height: 70,
                }}
              />
            </Box>
            <m.div variants={varFade('inLeft', { distance: 24 })}>
              <Typography variant="h4" component="h6">
                {option.title}
              </Typography>
            </m.div>
          </Box>
        </Box>

        <Stack spacing={2.5}>{option.description}</Stack>
      </Box>
    </MotionViewport>
  );
}

// ----------------------------------------------------------------------

const PLANS = Array.from({ length: 3 }, (_, index) => ({
  license: ['Standard', 'Plus', 'Extended'][index],
  price: [69, 129, 599][index],
  commons: [
    'One end products',
    '12 months updates',
    '6 months of support',
    'One-time payments',
    'Lifetime perpetual license.',
  ],
  options: [
    'JavaScript version',
    'TypeScript version',
    'Design resources (Figma)',
    'Commercial applications',
  ],
  icons: [
    `${CONFIG.assetsDir}/assets/icons/platforms/ic-js.svg`,
    `${CONFIG.assetsDir}/assets/icons/platforms/ic-ts.svg`,
    `${CONFIG.assetsDir}/assets/icons/platforms/ic-figma.svg`,
  ],
}));

const ENGAGEMENTS_DATA = Array.from({ length: 3 }, (_, index) => ({
  title: ['Technology Licensing', 'Co-Development Projects', 'Startup Collaborations'][index],
  description: [
    'Access ready to deploy innovations',
    'Partner in joint development',
    'Accelerate your growth',
  ][index],
  icons: [
    `${CONFIG.assetsDir}/assets/icons/platforms/technology-licensing.svg`,
    `${CONFIG.assetsDir}/assets/icons/platforms/development-projects.svg`,
    `${CONFIG.assetsDir}/assets/icons/platforms/startup-collaborations.svg`,
  ][index],
}));
