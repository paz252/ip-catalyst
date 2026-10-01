import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fPercent } from 'src/utils/format-number';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutWhat({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {/* py: { xs: 10, md: 8 }, */}
      <Container
        component={MotionViewport}
        sx={{ pt: 2, textAlign: { xs: 'center', md: 'unset' } }}
      >
        {/* <Grid container columnSpacing={{ md: 3 }} sx={{ alignItems: 'flex-start' }}> */}

        <Grid container size={{ xs: 12, md: 12, lg: 12 }} sx={{ mb: 1, mt: 5 }} spacing={2}>
          <Typography component={m.h2} variants={varFade('inRight')} variant="h3" sx={{ mb: 3 }}>
            Centre for Intellectual Property & Innovation Exchange (CIPIE)
          </Typography>

          <Typography
            component={m.p}
            variants={varFade('inRight')}
            sx={[
              (theme) => ({
                color: 'text.secondary',
                ...theme.applyStyles('dark', {
                  color: 'common.white',
                }),
                textAlign: 'justify',
              }),
            ]}
          >
            <strong>Centre for Intellectual Property & Innovation Exchange (CIPIE)</strong>{' '}
            is a strategic initiative established to strengthen India’s innovation,
            intellectual property, and technology commercialization ecosystem in the
            domains of Electronics, Information Technology, Digital Technologies, and
            emerging deep-tech sectors. CIPIE functions as an integrated platform that
            connects innovators, startups, MSMEs, academia, R&D institutions, industry,
            investors, and government stakeholders to support the complete innovation
            lifecycle — from idea generation and IP creation to technology transfer and
            commercialization.
            <br />
            <br />
            Developed under the broader vision of{' '}
            <strong>“Patent to Product to Profit”</strong>, CIPIE aims to bridge the
            long-standing gap between research outcomes and market deployment by creating
            a structured ecosystem for intellectual property management, technology
            readiness assessment, innovation visibility, and commercialization support.
          </Typography>
        </Grid>

        {/* <Grid container size={{ xs: 12, md: 12, lg: 12 }} sx={{ mb: 1, mt: 5 }} spacing={2}>
            <Typography component={m.h2} variants={varFade('inRight')} variant="h4" sx={{ mb: 2 }}>
              About IP Catalyst: Support for IP Management
            </Typography>
            <Typography
              component={m.p}
              variants={varFade('inRight')}
              sx={[
                (theme) => ({
                  color: 'text.secondary',
                  ...theme.applyStyles('dark', {
                    color: 'common.white',
                  }),
                  //textAlign: 'justify',
                }),
              ]}
            >
              The rapid growth of innovation driven technologies, particularly in the field of
              Electronics and Information Technology (E&IT), has necessitated the creation of a
              robust Intellectual Property (IP) ecosystem to protect, manage and commercialize
              innovative ideas. Intellectual Property Rights (IPRs) play a crucial role in fostering
              innovation, enhancing competitiveness and enabling economic growth by safeguarding the
              rights of inventors and organizations.
            </Typography>
            <Typography
              component={m.p}
              variants={varFade('inRight')}
              sx={[
                (theme) => ({
                  color: 'text.secondary',
                  ...theme.applyStyles('dark', {
                    color: 'common.white',
                  }),
                  //textAlign: 'justify',
                }),
              ]}
            >
              Recognizing the importance of strengthening the IP ecosystem in India, the Ministry of
              Electronics and Information Technology (MeitY) has initiated the “IP Catalyst: Support
              for IP Management” program. This initiative is designed to provide structured support
              for the protection of intellectual property generated by startups, MSMEs and MeitY
              Societies, MeitY autonomous bodies and MeitY grantee institute (project specific
              only).
            </Typography>
            <Typography
              component={m.p}
              variants={varFade('inRight')}
              sx={[
                (theme) => ({
                  color: 'text.secondary',
                  ...theme.applyStyles('dark', {
                    color: 'common.white',
                  }),
                  //  textAlign: 'justify',
                }),
              ]}
            >
              The scheme aims to bridge the gap between innovation and commercialization by offering
              comprehensive assistance across the entire IP protection lifecycle from ideation and
              prior art search to filing, prosecution, grant and post-grant management. By
              facilitating both domestic and international IP filings the program empowers
              innovators to secure legal protection for their inventions and expand their reach in
              global markets.
            </Typography>
            <Typography
              component={m.p}
              variants={varFade('inRight')}
              sx={[
                (theme) => ({
                  color: 'text.secondary',
                  ...theme.applyStyles('dark', {
                    color: 'common.white',
                  }),
                  // textAlign: 'justify',
                }),
              ]}
            >
              A key focus of the scheme is to support innovations in the Information and
              Communication Technology (ICT) domain, ensuring that Indian innovators remain
              competitive in the global technology landscape.
            </Typography>
            <Typography
              component={m.p}
              variants={varFade('inRight')}
              sx={[
                (theme) => ({
                  color: 'text.secondary',
                  ...theme.applyStyles('dark', {
                    color: 'common.white',
                  }),
                  //  textAlign: 'justify',
                }),
              ]}
            >
              The program is implemented by Centre for Development of Advanced Computing (C-DAC)
              Pune, which acts as the nodal agency for execution, coordination and monitoring of all
              activities under the scheme. The implementation framework includes expert committee
              evaluation, empanelled IP attorneys and a dedicated IP management support team to
              ensure efficient and transparent processing of applications.
            </Typography>
            <Typography
              component={m.p}
              variants={varFade('inRight')}
              sx={[
                (theme) => ({
                  color: 'text.secondary',
                  ...theme.applyStyles('dark', {
                    color: 'common.white',
                  }),
                  // textAlign: 'justify',
                }),
              ]}
            >
              The scheme operates through three integrated components: International Patent Filing
              Support (IPFS), IP Facilitation for domestic IP filings and Innovation Promotion
              Activities such as training, challenge rounds and industry meets. Together, these
              components create a holistic ecosystem that not only supports IP generation but also
              promotes its effective utilization and commercialization.
            </Typography>
            <Typography
              component={m.p}
              variants={varFade('inRight')}
              sx={[
                (theme) => ({
                  color: 'text.secondary',
                  ...theme.applyStyles('dark', {
                    color: 'common.white',
                  }),
                  // textAlign: 'justify',
                }),
              ]}
            >
              Overall, the IP Catalyst program is envisioned as a strategic initiative to transform
              innovative ideas into valuable intellectual assets, strengthen India’s position in the
              global IP landscape and contribute to the development of a knowledge driven economy.
            </Typography>
          </Grid> */}
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

const SKILLS = Array.from({ length: 3 }, (_, index) => ({
  value: [20, 40, 60][index],
  label: ['Patents', 'Copyright', 'Trademarks'][index],
}));
