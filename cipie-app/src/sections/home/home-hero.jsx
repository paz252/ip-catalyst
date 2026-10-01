import { useRef, useState } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';

import AvatarGroup from '@mui/material/AvatarGroup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar, { avatarClasses } from '@mui/material/Avatar';
import { Box, Grid, Stack, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _mock } from 'src/_mock';
import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { varFade, AnimateBorder, MotionContainer } from 'src/components/animate';

// import bannerImgUrl from '../../../public/banner/7.jpg';
import { HeroBackground } from './components/hero-background';

// ----------------------------------------------------------------------

const smKey = 'sm';
const mdKey = 'md';
const lgKey = 'lg';

const motionProps = {
  variants: varFade('inUp', { distance: 24 }),
};

export function HomeHero({ sx, ...other }) {
  const scrollProgress = useScrollPercent();

  const mdUp = useMediaQuery((theme) => theme.breakpoints.up(mdKey));

  const distance = mdUp ? scrollProgress.percent : 0;

  const y1 = useTransformY(scrollProgress.scrollY, distance * -7);
  const y2 = useTransformY(scrollProgress.scrollY, distance * -6);
  const y3 = useTransformY(scrollProgress.scrollY, distance * -5);
  const y4 = useTransformY(scrollProgress.scrollY, distance * -4);
  const y5 = useTransformY(scrollProgress.scrollY, distance * -3);

  const opacity = useTransform(
    scrollProgress.scrollY,
    [0, 1],
    [1, mdUp ? Number((1 - scrollProgress.percent / 100).toFixed(1)) : 1]
  );

  const renderHeading = () => (
    <m.div {...motionProps}>
      <Box
        className="home-1"
        component="h1"
        sx={[
          (theme) => ({
            my: 0,
            mx: 'auto',
            maxWidth: 680,
            display: 'flex',
            flexWrap: 'wrap',
            typography: 'h2',
            justifyContent: 'flex-start',
            fontFamily: theme.typography.fontSecondaryFamily,
            [theme.breakpoints.up(lgKey)]: {
              fontSize: theme.typography.pxToRem(55),
              lineHeight: '90px',
            },
          }),
        ]}
      >
        {/* <Box component="span" sx={{ width: 1, opacity: 0.24 }}>
          Online platform for
        </Box> */}
        <Box
          className="home-2"
          component={m.span}
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          sx={[
            (theme) => ({
              ...theme.mixins.textGradient(
                `300deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.warning.main} 25%, ${theme.vars.palette.primary.main} 50%, ${theme.vars.palette.warning.main} 75%, ${theme.vars.palette.primary.main} 100%`
              ),
              backgroundSize: '400%',
              ml: { xs: 0.75, md: 1, xl: 1.5 },
            }),
          ]}
        >
          Intellectual Property Catalyst
        </Box>
        {/* <Box component="span">Catalyst</Box> */}
      </Box>
    </m.div>
  );

  const renderText = () => (
    <m.div {...motionProps}>
      <Typography
        variant="body2"
        sx={[
          (theme) => ({
            mx: 'auto',
            [theme.breakpoints.up(smKey)]: { whiteSpace: 'pre' },
            [theme.breakpoints.up(lgKey)]: { fontSize: 18, lineHeight: '36px' },
          }),
        ]}
      >
        {/* {`The starting point for your next project is based on MUI. \nEasy customization helps you build apps faster and better.`} */}

        {`Secure online platform for filing, tracking, and managing Patents, \nTrademarks, Designs and other IP rights for innovators and businesses.`}
      </Typography>
    </m.div>
  );

  const renderRatings = () => (
    <m.div {...motionProps}>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          typography: 'subtitle2',
          justifyContent: { xs: 'center', sm: 'flex-start' },
        }}
      >
        <AvatarGroup
          sx={{
            [`& .${avatarClasses.root}`]: {
              width: 32,
              height: 32,
            },
          }}
        >
          {Array.from({ length: 3 }, (_, index) => (
            <Avatar
              key={_mock.fullName(index + 1)}
              alt={_mock.fullName(index + 1)}
              src={_mock.image.avatar(index + 1)}
            />
          ))}
        </AvatarGroup>
        160+ Happy innovators
      </Box>
    </m.div>
  );

  const renderActionButton = () => (
    <AnimateBorder
      sx={{ borderRadius: 1.25 }}
      duration={12}
      slotProps={{
        outlineColor: (theme) =>
          `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0.04)}, ${varAlpha(theme.vars.palette.warning.mainChannel, 0.04)})`,
        primaryBorder: {
          size: 50,
          width: '1.5px',
          sx: (theme) => ({
            color: theme.vars.palette.primary.main,
          }),
        },
        secondaryBorder: {
          sx: (theme) => ({
            color: theme.vars.palette.warning.main,
          }),
        },
      }}
    >
      <Button
        size="large"
        color="primary"
        variant="text"
        target="_blank"
        rel="noopener noreferrer"
        href={paths.figmaUrl}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ px: 2, borderRadius: 'inherit' }}
      >
        Dummy
      </Button>
    </AnimateBorder>
  );

  const renderButtons = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        // justifyContent: { xs: 'center', sm: 'center' },
        gap: { xs: 1, sm: 1 },
      }}
    >
      {/* <m.div {...motionProps}>
        <Button
          component={RouterLink}
          href={paths.dashboard.root}
          color="primary"
          size="large"
          variant="contained"
          startIcon={<Iconify width={24} icon="custom:flash-outline" />}
          sx={{ height: 52 }}
        >
          <span>Industry</span>
        </Button>
      </m.div>

      <m.div {...motionProps}>
        <Button
          component={RouterLink}
          href={paths.dashboard.root}
          color="primary"
          size="large"
          variant="contained"
          startIcon={<Iconify width={24} icon="custom:flash-outline" />}
          sx={{ height: 52 }}
        >
          <span>R&D Institutions</span>
        </Button>
      </m.div>

      <m.div {...motionProps}>
        <Button
          component={RouterLink}
          href={paths.dashboard.root}
          color="primary"
          size="large"
          variant="contained"
          startIcon={<Iconify width={24} icon="custom:flash-outline" />}
          sx={{ height: 52 }}
        >
          <span>Startups & MSMEs</span>
        </Button>
      </m.div> */}

      <m.div {...motionProps}>
        <Button
          component={RouterLink}
          color="primary"
          size="large"
          variant="outlined"
          target="_blank"
          // rel="noopener noreferrer"
          href={paths.dashboard.root}
          startIcon={<Iconify width={24} icon="solar:figma-outline" />}
          sx={{ height: 52, borderColor: 'currentColor' }}
        >
          For Industry
        </Button>
      </m.div>

      <m.div {...motionProps}>
        <Button
          component={RouterLink}
          color="primary"
          size="large"
          variant="outlined"
          target="_blank"
          // rel="noopener noreferrer"
          href={paths.dashboard.root}
          startIcon={<Iconify width={24} icon="solar:figma-outline" />}
          sx={{ height: 52, borderColor: 'currentColor' }}
        >
          For Startups & MSMEs
        </Button>
      </m.div>

      <m.div {...motionProps}>
        <Button
          component={RouterLink}
          color="primary"
          size="large"
          variant="outlined"
          target="_blank"
          // rel="noopener noreferrer"
          href={paths.dashboard.root}
          startIcon={<Iconify width={24} icon="solar:figma-outline" />}
          sx={{ height: 52, borderColor: 'currentColor' }}
        >
          For R&D Institutions
        </Button>
      </m.div>
    </Box>
  );

  const old_renderImage = () => (
    <Stack
      component={m.div}
      sx={{
        height: 1,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        alt="Home Banner"
        src={`${CONFIG.assetsDir}/assets/images/home/banner/7.png`}
        // sx={{ width: 720 }}
      />
    </Stack>
  );

  const renderImage = () => (
    <Stack
      component={m.div}
      sx={{
        height: 1,
        alignItems: 'center',
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <Box
        component={m.img}
        alt="Home Banner"
        src={`${CONFIG.assetsDir}/assets/images/home/banner/image-1.png`}
        sx={{
          position: 'absolute',
          height: 500,
          zIndex: 1,
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
          // rotate:360,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <Box
        component={m.img}
        alt="Home Banner"
        src={`${CONFIG.assetsDir}/assets/images/home/banner/image-2.png`}
        sx={{
          position: 'relative',
          height: 450,
          zIndex: 2,
        }}
        animate={{
          y: [0, -20, 0],
        }}
        whileHover={{
          scale: 1.08,
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Box
        component={m.img}
        alt="Home Banner"
        src={`${CONFIG.assetsDir}/assets/images/home/banner/image-3.png`}
        sx={{
          position: 'absolute',
          height: 150, 
          zIndex: 3, 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', 
        }}
      />
    </Stack>
  );
  const renderIcons = () => (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
      <m.div {...motionProps}>
        <Typography variant="overline" sx={{ opacity: 0.4 }}>
          Available For
        </Typography>
      </m.div>

      <Box sx={{ gap: 2.5, display: 'flex' }}>
        {['js', 'ts', 'nextjs', 'vite', 'figma'].map((platform) => (
          <m.div {...motionProps} key={platform}>
            <Box
              component="img"
              alt={platform}
              src={`${CONFIG.assetsDir}/assets/icons/platforms/ic-${platform}.svg`}
              sx={[
                (theme) => ({
                  width: 24,
                  height: 24,
                  ...theme.applyStyles('dark', {
                    ...(platform === 'nextjs' && { filter: 'invert(1)' }),
                  }),
                }),
              ]}
            />
          </m.div>
        ))}
      </Box>
    </Stack>
  );

  return (
    <Box
      className="home-11"
      ref={scrollProgress.elementRef}
      component="section"
      sx={[
        (theme) => ({
          overflow: 'hidden',
          position: 'relative',
          [theme.breakpoints.up(mdKey)]: {
            minHeight: 760,
            height: '100vh',
            maxHeight: 1440,
            display: 'block',
            willChange: 'opacity',
            mt: 'calc(var(--layout-header-desktop-height) * -1)',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        className="home-22"
        component={m.div}
        style={{ opacity }}
        sx={[
          (theme) => ({
            width: 1,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            transition: theme.transitions.create(['opacity']),
            [theme.breakpoints.up(mdKey)]: {
              height: 1,
              position: 'fixed',
              maxHeight: 'inherit',
            },
          }),
        ]}
      >
        <Container
          className="home-33"
          component={MotionContainer}
          sx={[
            (theme) => ({
              py: 3,
              gap: 5,
              zIndex: 9,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              maxWidth: 'unset !important',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              // backgroundImage: `url(${bannerImgUrl})`,

              // ...theme.mixins.bgGradient({
              //   images: [
              //     `url(${CONFIG.assetsDir}/assets/background/overlay.svg)`,
              //     // `url(${CONFIG.assetsDir}/assets/images/about/hero.webp)`,
              //     `url(${bannerImgUrl})`,
              //   ],
              // }),

              // height: 300,
              // borderRadius: 2,
              // overflow: 'hidden',
              //     backgroundImage: `
              //   linear-gradient(to right, rgb(255 255 255 / 70%) 0%,
              //   rgb(216 221 241 / 40%) 40%,
              //   rgb(255 240 240 / 0%) 60%),
              //   url(${bannerImgUrl})
              // `,
              //     backgroundSize: 'cover',
              //     backgroundPosition: 'right center',
              //     display: 'flex',
              // alignItems: 'center',
              // px: 4,

              [theme.breakpoints.up(mdKey)]: {
                flex: '1 1 auto',
                justifyContent: 'center',
                py: 'var(--layout-header-desktop-height)',
              },
            }),
          ]}
        >
          <Grid
            container
            columnSpacing={{ xs: 5, md: 12 }}
            sx={{ position: 'relative', alignItems: 'center' }}
            className="grid-44"
          >
            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
              <Stack
                spacing={3}
                sx={{ textAlign: { xs: 'center', md: 'left', lg: 'left' } }}
                className="home-4"
              >
                <m.div style={{ y: y1 }}>{renderHeading()}</m.div>
                <m.div style={{ y: y2 }}>{renderText()}</m.div>

                {/* <m.div style={{ y: y3 }}>{renderRatings()}</m.div> */}
                <m.div style={{ y: y3 }}>{renderButtons()}</m.div>
                {/* <m.div style={{ y: y5 }}>{renderActionButton()}</m.div> */}
                {/* <m.div style={{ y: y5 }}>{renderIcons()}</m.div> */}
              </Stack>
            </Grid>

            <Grid sx={{ display: { xs: 'none', md: 'block' } }} size={{ md: 6, lg: 6 }}>
              <m.div style={{ y: y1 }}>{renderImage()}</m.div>
            </Grid>
          </Grid>
        </Container>

        <HeroBackground />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function useTransformY(value, distance) {
  const physics = {
    mass: 0.1,
    damping: 20,
    stiffness: 300,
    restDelta: 0.001,
  };

  return useSpring(useTransform(value, [0, 1], [0, distance]), physics);
}

function useScrollPercent() {
  const elementRef = useRef(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollY, 'change', (scrollHeight) => {
    let heroHeight = 0;

    if (elementRef.current) {
      heroHeight = elementRef.current.offsetHeight;
    }

    const scrollPercent = Math.floor((scrollHeight / heroHeight) * 100);

    if (scrollPercent >= 100) {
      setPercent(100);
    } else {
      setPercent(Math.floor(scrollPercent));
    }
  });

  return { elementRef, percent, scrollY };
}
