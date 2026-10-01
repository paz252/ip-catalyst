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

export function AboutInnovation({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...other}
        >
            {/* py: { xs: 10, md: 8 }, */}
            <Container
                component={MotionViewport}
                sx={{ pt: 0, pb: 2, textAlign: { xs: 'center', md: 'unset' } }}
            >
                <Grid container size={{ xs: 12, md: 12, lg: 12 }} sx={{ mb: 1, mt: 5 }} spacing={2}>
                    <Typography component={m.h2} variants={varFade('inRight')} variant="h4" sx={{ mb: 2 }}>
                        Driving Innovation Beyond Patents
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
                        At CIPIE, we believe that innovation should not remain confined to laboratories,
                        publications, or patent documents. The true value of innovation is realized
                        when technologies are translated into products, adopted by industry,
                        deployed for society, and scaled for national impact.
                        <br />
                        <br />
                        By combining innovation support, IP management, technology visibility,
                        and commercialization facilitation within a unified ecosystem, CIPIE
                        aims to become a national platform enabling India’s transition toward
                        a stronger knowledge-driven and technology-led economy.
                    </Typography>
                </Grid>
            </Container>
        </Box>
    );
}
