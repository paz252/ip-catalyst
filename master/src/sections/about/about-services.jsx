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

export function AboutServices({ sx, ...other }) {
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
                            Services Offered Through the Portal
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
                            The CIPIE portal is designed as a comprehensive innovation and IP
                            facilitation platform offering services across the complete
                            technology and commercialization lifecycle.
                        </Typography>
                    </Grid>

                    {/* Intellectual Property Support */}
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
                            Intellectual Property Support
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
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
                            • Patent filing and prosecution support
                            <br />
                            • Copyright, trademark, and design facilitation
                            <br />
                            • IP maintenance and annuity support
                            <br />
                            • Patent analytics and IP portfolio management
                        </Typography>
                    </Grid>

                    {/* Technology Landscaping */}
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
                            Technology Landscaping & Prior-Art Analysis
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
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
                            • Technology landscape reports
                            <br />
                            • Patentability assessment
                            <br />
                            • Competitor and market intelligence
                            <br />
                            • Prior-art and novelty analysis
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
                            Technology Commercialization Support
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
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
                            • Technology transfer facilitation
                            <br />
                            • Licensing and co-development support
                            <br />
                            • Commercialization readiness assessment
                            <br />
                            • Industry matchmaking and outreach
                        </Typography>
                    </Grid>

                    {/* Showcase */}
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
                            Innovation Showcase & IP Pooling
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
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
                            • Unified IP showcase platform
                            <br />
                            • Technology discovery interface
                            <br />
                            • TRL-based technology categorization
                            <br />
                            • Industry-accessible innovation database
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
                            Capacity Building & Ecosystem Development
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
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
                            • Workshops and training programmes
                            <br />
                            • Startup and MSME mentoring
                            <br />
                            • IP awareness and sensitization sessions
                            <br />
                            • Institutional IP ecosystem development
                        </Typography>
                    </Grid>

                    {/* Research Support */}
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
                            Research & Strategic Support
                        </Typography>

                        <Typography
                            component={m.div}
                            variants={varFade('inUp')}
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
                            • Policy support and advisory
                            <br />
                            • Innovation ecosystem studies
                            <br />
                            • TRL and commercialization frameworks
                            <br />
                            • Strategic technology insights
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}


