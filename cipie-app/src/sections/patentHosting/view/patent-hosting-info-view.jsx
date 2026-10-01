import { useNavigate } from 'react-router';

import { Avatar, Box, Button, Card, Container, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

export function IPHostingInfoView() {
  const { authenticated } = useAuthContext();
  const navigate = useNavigate();

  // console.log(authenticated);

  const handleHostIP = () => {
    if (authenticated) {
      navigate(paths.dashboard.patentHosting.new);
    } else {
      navigate(paths.auth.jwt.signIn);
    }
  };

  const categories = [
    {
      title: 'Patents',
      icon: 'solar:document-text-bold',
      color: 'primary.main',
    },
    {
      title: 'Copyrights',
      icon: 'solar:copyright-bold',
      color: 'success.main',
    },
    {
      title: 'Trademarks',
      icon: 'solar:tag-price-bold',
      color: 'warning.main',
    },
    {
      title: 'Technology Transfer',
      icon: 'solar:rocket-bold',
      color: 'info.main',
    },
  ];

  const hosting = [
    'Increase innovation visibility',
    'Connect with industry partners',
    'Enable licensing opportunities',
    'Attract investors and collaborators',
    'Commercialize research outcomes',
  ];

  const benefits = [
    {
      title: 'Industry Exposure',
      description: 'Increase visibility among industry stakeholders.',
      icon: 'solar:global-bold',
      color: 'info.main',
    },
    {
      title: 'Licensing Opportunities',
      description: 'Connect with potential licensing partners.',
      icon: 'solar:hand-money-bold',
      color: 'success.main',
    },
    {
      title: 'Commercialization',
      description: 'Transform innovation into business value.',
      icon: 'solar:rocket-bold',
      color: 'warning.main',
    },
    {
      title: 'Collaboration',
      description: 'Build partnerships with researchers and industry.',
      icon: 'solar:users-group-rounded-bold',
      color: 'secondary.main',
    },
  ];

  const steps = [
    {
      title: 'Create Profile',
      icon: 'solar:add-circle-bold',
    },
    {
      title: 'Upload Documents',
      icon: 'solar:document-bold',
    },
    {
      title: 'Add Details',
      icon: 'solar:cpu-bold',
    },
    {
      title: 'Publish',
      icon: 'solar:global-bold',
    },
  ];

  const steps2 = [
    {
      title: 'Create IP Profile',
      description: 'Start by creating a new intellectual property record.',
      icon: 'solar:add-circle-bold',
      color: 'primary',
    },
    {
      title: 'Upload Media & Documents',
      description: 'Add images, videos, supporting documents and patent files.',
      icon: 'solar:gallery-wide-bold',
      color: 'info',
    },
    {
      title: 'Provide IP Details',
      description: 'Enter inventors, assignees, abstract, claims and technical information.',
      icon: 'solar:document-text-bold',
      color: 'warning',
    },
    {
      title: 'Submit for Review',
      description: 'Submit your intellectual property for verification and approval.',
      icon: 'solar:shield-check-bold',
      color: 'secondary',
    },
    {
      title: 'Admin Approval',
      description: 'Our team reviews the information and validates the submission.',
      icon: 'solar:user-check-bold',
      color: 'success',
    },
    {
      title: 'Published on CIPIE Portal',
      description: 'Approved intellectual properties are showcased to industry and collaborators.',
      icon: 'solar:global-bold',
      color: 'error',
    },
  ];
  return (
    <Container
      maxWidth={false}
      sx={[
        (theme) => ({
          // px: 15,
          py: 3,
          // mb: 5,
          borderBottom: `solid 1px ${theme.vars.palette.divider}`,
        }),
      ]}
    >
      {/* <CustomBreadcrumbs
        heading="Intellectual Property Hosting"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Intellectual Property Hosting' },
        ]}
        sx={{ mb: 5 }}
      /> */}

      {/* HERO */}
      <Card
        sx={{
          mb: 5,
          overflow: 'hidden',
          position: 'relative',
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          background: (theme) =>
            `linear-gradient(135deg,
              ${theme.palette.primary.main} 0%,
              ${theme.palette.info.main} 100%)`,
          // background: `linear-gradient(13deg, #3572b1 0%, #bbe0e7 100%)`,
          // background: `linear-gradient(175deg, #3572b1 0%, #bbe0e7 100%)`,
          color: 'common.white',
        }}
      >
        <Iconify
          icon="solar:folder-with-files-bold"
          width={180}
          sx={{
            position: 'absolute',
            right: 32,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.12,
            display: { xs: 'none', md: 'block' },
          }}
        />

        <Stack spacing={3} maxWidth={650}>
          <Typography variant="overline">IP Hosting Marketplace</Typography>

          <Typography variant="h2">Host & Commercialize Your Intellectual Property</Typography>

          <Typography
            sx={{
              opacity: 0.9,
            }}
          >
            Showcase patents, copyrights, trademarks and technology innovations to researchers,
            industry leaders, investors and licensing partners worldwide.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              size="large"
              color="inherit"
              variant="contained"
              startIcon={<Iconify icon="solar:add-circle-bold" />}
              onClick={handleHostIP}
              sx={{
                // background: 'aliceblue',
                borderRadius: 50,
                // color: '#d95626',
              }}
            >
              Host Patent
            </Button>
          </Stack>
        </Stack>
      </Card>

      {/* CATEGORIES */}
      {/* <Box
        sx={{
          gap: 3,
          mb: 5,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {categories.map((item) => (
          <Card key={item.title}>
            <Stack
              spacing={2}
              alignItems="center"
              sx={{
                py: 4,
                px: 3,
                textAlign: 'center',
              }}
            >
              <Iconify icon={item.icon} width={42} sx={{ color: item.color }} />

              <Typography variant="h6">{item.title}</Typography>

              <Typography variant="body2" color="text.secondary">
                Host and promote your {item.title.toLowerCase()}.
              </Typography>
            </Stack>
          </Card>
        ))}
      </Box> */}

      {/* BENEFITS */}
      <Box
        sx={{
          gap: 3,
          mb: 5,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1fr',
          },
        }}
      >
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Why Host Your IP?
          </Typography>

          <Stack spacing={2}>
            {hosting.map((item) => (
              <Stack key={item} direction="row" spacing={2} alignItems="center">
                <Iconify icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />

                <Typography>{item}</Typography>
              </Stack>
            ))}
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Hosting Benefits
          </Typography>

          <Stack spacing={3}>
            {benefits.map((item) => (
              <Stack key={item.title} direction="row" spacing={2} alignItems="center">
                <Iconify icon={item.icon} sx={{ color: item.color }} />
                <Box>
                  <Typography variant="subtitle2">{item.title}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Card>
      </Box>

      {/* PROCESS */}
      <Card sx={{ p: 4, mb: 5 }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4">How Intellectual Property Hosting Works</Typography>
          {/* 
          <Typography color="text.secondary">
            Follow a simple process to showcase your intellectual property and connect with
            industry, investors, researchers and licensing partners.
          </Typography> */}
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
          }}
        >
          {steps2.map((step, index) => (
            <Card
              key={step.title}
              variant="outlined"
              sx={{
                p: 3,
                height: 1,
                position: 'relative',
                transition: (theme) => theme.transitions.create(['transform', 'box-shadow']),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.customShadows.z24,
                },
              }}
            >
              <Stack spacing={2}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    // bgcolor: `${step.color}.lighter`,
                    // color: `${step.color}.main`,
                    bgcolor: 'error.lighter',
                    color: 'error.main',
                  }}
                >
                  <Iconify icon={step.icon} width={28} />
                </Avatar>

                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  STEP {index + 1}
                </Typography>

                <Typography variant="h6">{step.title}</Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    minHeight: 60,
                  }}
                >
                  {step.description}
                </Typography>
              </Stack>
            </Card>
          ))}
        </Box>
      </Card>

      {/* CTA */}
      <Card
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          background: (theme) =>
            `linear-gradient(135deg,
              ${theme.palette.warning.light} 0%,
              ${theme.palette.error.light} 100%)`,
          // background: `linear-gradient(135deg, #d9edff 0%, #d9edff 100%)`,
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4">Ready to Showcase Your Innovation?</Typography>

          <Typography color="text.secondary" maxWidth={700}>
            Create a professional intellectual property profile and connect with organizations
            looking for innovative solutions.
          </Typography>

          <Button
            size="large"
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" />}
            onClick={handleHostIP}
            sx={{ borderRadius: 50 }}
          >
            Host Patent
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
