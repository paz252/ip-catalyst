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

export function AboutMission({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...other}
        >
            {/* py: { xs: 10, md: 8 }, */}
            <Container
                component={MotionViewport}
                sx={{ pt: 0, textAlign: { xs: 'center', md: 'unset' } }}
            >
                <Grid container size={{ xs: 12, md: 12, lg: 12 }} sx={{ mb: 1, mt: 5 }} spacing={2}>
                    <Typography component={m.h2} variants={varFade('inRight')} variant="h4" sx={{ mb: 2 }}>
                        Our Mission
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
                        • To strengthen India’s innovation and intellectual property ecosystem across
                        Electronics, Information Technology, Artificial Intelligence, Semiconductors,
                        High-Performance Computing (HPC), Cybersecurity, Language Technologies, and
                        Digital Infrastructure.
                        <br />
                        • To support innovators, startups, MSMEs, academic institutions, and R&D
                        organizations in protecting, managing, and commercializing intellectual
                        property assets.
                        <br />
                        • To create a connected platform for collaboration among academia, startups,
                        MSMEs, industry, investors, and government stakeholders.
                        <br />
                        • To promote technology transfer, licensing, and indigenous product
                          development through TRL-oriented innovation support mechanisms.
                        <br />
                        • To improve the visibility, accessibility, and utilization of publicly
                        funded research and innovation assets.
                        <br />
                        • To enable the complete innovation journey — from research to intellectual
                        property, intellectual property to product, and product to national and
                        global market impact.
                    </Typography>

                </Grid>
            </Container>
        </Box >
    );
}


