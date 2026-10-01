import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { CONFIG } from 'src/global-config';

import { AnimateText } from 'src/components/animate';
import { varFade, MotionContainer, animateTextClasses } from 'src/components/animate';


// ----------------------------------------------------------------------

export function ImageHero({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)})`,
              `url(${CONFIG.assetsDir}/assets/images/faqs/hero.webp)`,
            ],
          }),
          height: { md: 350 },
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
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <AnimateText
            component="h2"
            variant="h2"
            textContent={['Meity Societies / R&D / Autonomous bodies(Domestic IP Filing Support)', 'IP Facilitation Program']}
            variants={varFade('inRight', { distance: 4 })}
            sx={{
              color: 'common.white',
              [`& .${animateTextClasses.line}[data-index="0"]`]: {
                [`& .${animateTextClasses.word}`]: { color: 'primary.main' },
                // [`& .${animateTextClasses.word}[data-index="5"]`]: { color: 'primary.main' },
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
