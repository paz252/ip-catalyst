// import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { varFade, AnimateText, MotionContainer, animateTextClasses } from 'src/components/animate';

// ----------------------------------------------------------------------

export function PatentListHero({ domainName, domain, sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              // `url(${CONFIG.assetsDir}/assets/background/overlay.svg)`,
              `url(${CONFIG.assetsDir}/assets/images/patents/${domain}.jpg)`,
            ],
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
      <Container component={MotionContainer} sx={{ mx: 2 }}>
        <Box
          sx={{
            bottom: { md: 40 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <AnimateText
            key={domainName}
            component="h2"
            variant="h2"
            textContent={[domainName || 'Innovation', '']}
            variants={varFade('inRight', { distance: 24 })}
            sx={{
              fontSize: {
                xs: '24px',
                sm: '32px',
                md: '38px',
                lg: '44px',
              },
              color: 'common.white',
              [`& .${animateTextClasses.line}[data-index="0"]`]: {
                [`& .${animateTextClasses.word}[data-index="0"]`]: { color: 'primary.main' },
              },
            }}
          />

          {/* <m.div variants={varFade('inUp', { distance: 24 })}>
            <Typography
              variant="h4"
              sx={{ color: 'common.white', fontWeight: 'fontWeightSemiBold' }}
            >
              Explore patents in Information & Communication Technology
            </Typography>
          </m.div> */}
        </Box>
      </Container>
    </Box>
  );
}
