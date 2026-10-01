import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SvgIcon from '@mui/material/SvgIcon';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutEvolution({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...other}
        >
            {/* py: { xs: 10, md: 8 }, */}
            <Container
                component={MotionViewport}
                sx={{  pt: 0, textAlign: { xs: 'center', md: 'unset' } }}
            >
                <Grid container size={{ xs: 12, md: 12, lg: 12 }} sx={{ mb: 1, mt: 5 }} spacing={2}>
                    <Typography component={m.h2} variants={varFade('inRight')} variant="h4" sx={{ mb: 2 }}>
                        Our Evolution
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
                        CIPIE evolved from years of experience in supporting innovation and
                        intellectual property activities across the MeitY ecosystem through
                        initiatives led by the IP Cell at C-DAC. Over time, it became evident that
                        innovation support could not remain limited only to patent filing assistance.
                        Researchers, startups, and R&D organizations required a much broader
                        ecosystem that could support:
                        <br />
                        <br />
                        • Technology landscaping,
                        <br />
                        • Patent analytics,
                        <br />
                        • Commercialization readiness,
                        <br />
                        • Industry engagement,
                        <br />
                        • Licensing support,
                        <br />
                        • Technology transfer facilitation,
                        <br />
                        • Innovation visibility.
                        <br />
                        <br />
                        This realization led to the evolution of <strong>CIPIE</strong> as a unified
                        innovation and IP ecosystem platform designed to support not only IP
                        protection, but also innovation utilization and national technology impact.
                        <br />
                        <br />
                        Today, CIPIE supports multiple strategic initiatives including:
                        <br />
                        <br />
                        • <strong>IP Catalyst Programme</strong>
                        <br />
                        • Technology commercialization and transfer initiatives
                        <br />
                        • Innovation showcase and IP pooling activities
                        <br />
                        • Patent analytics and technology landscaping
                        <br />
                        • TRL-based innovation assessment
                        <br />
                        • Industry and startup engagement mechanisms
                        <br />
                        • Capacity building and IP awareness programmes
                    </Typography>

                </Grid>
            </Container>
        </Box >
    );
}

// ----------------------------------------------------------------------

