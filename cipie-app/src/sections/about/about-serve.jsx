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

export function AboutServe({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...other}
        >
            <Container
                component={MotionViewport}
                sx={{
                    pt: 0,
                    textAlign: 'left',
                }}
            >
                <Grid
                    container
                    size={{ xs: 12, md: 12, lg: 12 }}
                    sx={{ mb: 1, mt: 5 }}
                    spacing={4}
                >
                    {/* Heading */}
                    <Grid size={{ xs: 12 }}>
                        <Typography
                            component={m.h2}
                            variants={varFade('inRight')}
                            variant="h4"
                            sx={{
                                mb: 2,
                                fontWeight: 700,
                                textAlign: 'left',
                            }}
                        >
                            Who We Serve
                        </Typography>

                        <Typography
                            component={m.p}
                            variants={varFade('inRight')}
                            sx={[
                                (theme) => ({
                                    color: 'text.secondary',
                                    // lineHeight: 1.9,
                                    textAlign: 'justify',
                                    ...theme.applyStyles('dark', {
                                        color: 'common.white',
                                    }),
                                }),
                            ]}
                        >
                            CIPIE is designed to support the innovation ecosystem specifically within
                            <strong>Information Technology (IT), Electronics, Digital Technologies, Artificial
                                Intelligence (AI), Semiconductors, High-Performance Computing (HPC),
                                Cybersecurity, Language Technologies, and emerging deep-tech domains.</strong>
                            <br />
                            <br />
                            The platform primarily focuses on stakeholders associated with the <strong>Ministry
                                of Electronics and Information Technology (MeitY)</strong> ecosystem, including MeitY
                            societies, supported institutions, grantee organizations, startups, and
                            technology innovators.
                        </Typography>
                    </Grid>

                    {/* Startups & MSMEs */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            component={m.h3}
                            variants={varFade('inUp')}
                            variant="h5"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                textAlign: 'left',
                            }}
                        >
                            Startups & MSMEs
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
                            sx={[
                                (theme) => ({
                                    color: 'text.secondary',
                                    // lineHeight: 1.9,
                                    textAlign: 'justify',
                                    ...theme.applyStyles('dark', {
                                        color: 'common.white',
                                    }),
                                }),
                            ]}
                        >
                            Supporting startups and MSMEs working in IT and Electronics domains through IP protection,
                            technology validation, commercialization readiness,
                            product development support, and industry engagement opportunities.
                        </Typography>
                    </Grid>

                    {/* MeitY R&D Organizations & Societies */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            component={m.h3}
                            variants={varFade('inUp')}
                            variant="h5"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                textAlign: 'left',
                            }}
                        >
                            MeitY R&D Organizations & Societies
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
                            sx={[
                                (theme) => ({
                                    color: 'text.secondary',
                                    // lineHeight: 1.9,
                                    textAlign: 'justify',
                                    ...theme.applyStyles('dark', {
                                        color: 'common.white',
                                    }),
                                }),
                            ]}
                        >
                            Supporting MeitY societies and government R&D organizations in managing
                            intellectual property assets, strengthening innovation ecosystems,
                            improving technology visibility, and enabling commercialization and technology transfer pathways.
                        </Typography>
                    </Grid>

                    {/* Commercialization */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            component={m.h3}
                            variants={varFade('inUp')}
                            variant="h5"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                textAlign: 'left',
                            }}
                        >
                            Academia & Grantee Institutions Supported by MeitY
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
                            sx={[
                                (theme) => ({
                                    color: 'text.secondary',
                                    // lineHeight: 1.9,
                                    textAlign: 'justify',
                                    ...theme.applyStyles('dark', {
                                        color: 'common.white',
                                    }),
                                }),
                            ]}
                        >
                            Enabling universities, academic institutions, Centres of Excellence (CoEs),
                            incubators, and research organizations that are supported under various MeitY programmes
                            and grants to access structured support for patent filing, technology landscaping,
                            IP management, and commercialization facilitation.
                        </Typography>
                    </Grid>

                    {/* Industry & Corporates */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            component={m.h3}
                            variants={varFade('inUp')}
                            variant="h5"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                textAlign: 'left',
                            }}
                        >
                            Industry & Corporates
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
                            sx={[
                                (theme) => ({
                                    color: 'text.secondary',
                                    // lineHeight: 1.9,
                                    textAlign: 'justify',
                                    ...theme.applyStyles('dark', {
                                        color: 'common.white',
                                    }),
                                }),
                            ]}
                        >
                            Providing industries and corporates access to emerging indigenous technologies, licensing opportunities,
                            collaborative research initiatives, and technology partnerships in IT and Electronics sectors.
                        </Typography>
                    </Grid>

                    {/* Capacity Building */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            component={m.h3}
                            variants={varFade('inUp')}
                            variant="h5"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                textAlign: 'left',
                            }}
                        >
                            Innovators, Researchers & Technology Developers
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
                            sx={[
                                (theme) => ({
                                    color: 'text.secondary',
                                    // lineHeight: 1.9,
                                    textAlign: 'justify',
                                    ...theme.applyStyles('dark', {
                                        color: 'common.white',
                                    }),
                                }),
                            ]}
                        >
                            Supporting researchers, inventors, faculty members, engineers,
                            and technology developers working within the MeitY innovation ecosystem
                            across the complete lifecycle of innovation  from ideation and IP generation
                            to deployment and market impact.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}


