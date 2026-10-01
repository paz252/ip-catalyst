import { Link } from 'react-router-dom';
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
import { SeoIllustration } from 'src/assets/illustrations';

import { Iconify } from 'src/components/iconify';
import { varFade, varScale, MotionViewport } from 'src/components/animate';

import { HomeCategory } from './home-category';
import { SectionTitle } from './components/section-title';
import { FloatLine, FloatXIcon } from './components/svg-elements';

// ----------------------------------------------------------------------

export function HomePricing({ sx, ...other }) {
  const tabs = useTabs('IP Catalyst');

  const renderDescription = () => (
    <SectionTitle
      // caption="dummy"
      title="Flagship"
      txtGradient="Initiatives"
      description="Two complementary programmers designed to take Indian innovations from lab to market"
      sx={{ mb: 8, textAlign: 'center' }}
      // sx={{ textAlign: 'center' }}
    />
  );

  const renderContentDesktop = () => (
    <Box gridTemplateColumns="repeat(2, 1fr)" sx={{ display: { xs: 'none', md: 'grid' }, gap: 4 }}>
      {PLAN.map((plan) => (
        <HomeCategory
          key={plan.title}
          title={plan.title}
          description={plan.description}
          category={plan.category}
          img={<SeoIllustration hideBackground />}
          action={
            <Button variant="contained" color="primary" component={Link} to={plan.path}>
              {plan.button}
            </Button>
          }
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
        {PLAN.map((tab) => (
          <Tab key={tab.title} value={tab.title} label={tab.title} />
        ))}
      </Tabs>

      <Box
        sx={[
          (theme) => ({
            width: 1,
            borderRadius: 2,
            border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          }),
        ]}
      >
        {PLAN.map(
          (plan) =>
            plan.title === tabs.value && (
              <HomeCategory
                key={plan.title}
                title={plan.title}
                description={plan.description}
                category={plan.category}
                img={<SeoIllustration hideBackground />}
                action={
                  <Button variant="contained" color="primary" component={Link} to={plan.path}>
                    {plan.button}
                  </Button>
                }
              />
            )
        )}
      </Box>
    </Stack>
  );

  return (
    <Box
      component="section"
      sx={[{ py: 5, position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>
        <FloatLine vertical sx={{ top: 0, left: 80 }} />

        <Box
          sx={(theme) => ({
            p: 6,
            position: 'relative',
            '&::before, &::after': {
              width: 64,
              height: 64,
              content: "''",
              [theme.breakpoints.up(1440)]: { display: 'block' },
            },
          })}
        >
          <Container>{renderDescription()}</Container>
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

function PlanCard({ plan, sx, ...other }) {
  const standardLicense = plan.license === 'Standard';

  const plusLicense = plan.license === 'Plus';

  return (
    <MotionViewport>
      <Box
        sx={[
          () => ({
            px: 2,
            py: 4,
            gap: 5,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {plusLicense && renderLines()}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Box sx={{ flex: '1 1 auto' }}></Box> */}
        </Box>
      </Box>
    </MotionViewport>
  );
}

// ----------------------------------------------------------------------

const PLAN = Array.from({ length: 2 }, (_, index) => ({
  title: ['IP Catalyst', 'T-Core'][index],
  price: [69, 129, 599][index],
  description: [
    'Building & protecting intellectual assets',
    'Accelerating technology commercialization',
  ][index],
  category: [
    ['Patent filling & maintenance', 'IPR training & awareness'],
    ['TRL-based licensing', 'Industry collaboration'],
  ][index],
  button: ['Learn more', 'Explore T-Core'][index],
  path: [paths.catalyst, paths.tcore][index],
  icons: [
    `${CONFIG.assetsDir}/assets/icons/platforms/ic-js.svg`,
    `${CONFIG.assetsDir}/assets/icons/platforms/ic-ts.svg`,
    `${CONFIG.assetsDir}/assets/icons/platforms/ic-figma.svg`,
  ],
}));

const PLANS = Array.from({ length: 2 }, (_, index) => ({
  license: ['Standard', 'Plus', 'Extended', 'Standard1', 'Plus1', 'Extended1'][index],
  price: [69, 129, 599, 69, 129, 599][index],
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
