import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { varFade, AnimateText, MotionContainer, animateTextClasses } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutHero({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `url(${CONFIG.assetsDir}/assets/background/overlay.svg)`,
              `url(${CONFIG.assetsDir}/assets/images/about/about-us.jpg)`,
            ],
            // images: [
            //   `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)})`,
            //   `url(${CONFIG.assetsDir}/assets/images/about/hero.jpg)`,
            // ],

            // images: [
            //   `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.5)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.6)})`,
            //   `url(${CONFIG.assetsDir}/assets/images/about/hero.jpg)`,
            // ],
          }),
          height: { md: 240 },
          py: { xs: 10, md: 0 },
          overflow: 'hidden',
          position: 'relative',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container component={MotionContainer}>
        <Box
          sx={{
            // bottom: { md: 80 },
            top: { md: 80 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <AnimateText
            component="h2"
            variant="h2"
            textContent={[
              'About Us',
              // 'A centralized platform to manage, track, and streamline the entire patent lifecycle',
            ]}
            //  textContent={['Who', 'we are?']}
            variants={varFade('inRight', { distance: 24 })}
            sx={{
              color: 'common.white',
              [`& .${animateTextClasses.line}[data-index="0"]`]: {
                [`& .${animateTextClasses.word}`]: { color: 'primary.main' },
              },
            }}
          />

          {/* <m.div variants={varFade('inUp', { distance: 24 })}>
            <Typography
              variant="h4"
              sx={{ mt: 3, color: 'common.white', fontWeight: 'fontWeightSemiBold' }}
            >
              A centralized platform to manage, track, and streamline the entire patent lifecycle
              Let&apos;s work together and
              <br /> make awesome site easily
            </Typography>
          </m.div> */}
        </Box>
      </Container>
    </Box>
  );
}
