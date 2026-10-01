import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

const APPLY_DATA = [
  {
    title: 'Startups',
    desc: '(DPIIT Recognized)',
    icon: 'solar:buildings-bold',
    color: 'primary',
  },
  {
    title: 'MSMEs',
    desc: '(Udyam Registered)',
    icon: 'solar:factory-bold',
    color: 'success',
  },
  {
    title: 'MeitY Societies /',
    desc: 'Autonomous Bodies',
    icon: 'solar:users-group-rounded-bold',
    color: 'warning',
  },
  {
    title: 'MeitY Grantee',
    desc: 'Institutions',
    icon: 'solar:graduation-cap-bold',
    color: 'secondary',
  },
];

export function WhoCanApply() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container>
        <Typography variant="h5" align="center" fontWeight={700} sx={{ mb: 5 }}>
          Who Can Apply?
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {APPLY_DATA.map((item, index) => (
            <Grid key={index} item xs={6} md={3}>
              <Card
                sx={(theme) => ({
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s',

                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6],
                  },
                })}
              >
                {/* Icon */}
                <Box
                  sx={(theme) => ({
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    mb: 2,
                    borderRadius: '50%',
                    bgcolor: theme.palette[item.color].lighter,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <Iconify
                    icon={item.icon}
                    width={30}
                    sx={(theme) => ({
                      color: theme.palette[item.color].main,
                    })}
                  />
                </Box>

                {/* Title */}
                <Typography variant="subtitle1" fontWeight={700}>
                  {item.title}
                </Typography>

                {/* Description */}
                <Typography variant="caption" color="text.secondary">
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
