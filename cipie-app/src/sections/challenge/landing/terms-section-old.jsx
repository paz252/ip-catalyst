import { Alert, Avatar, Box, Card, Container, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function TermsSectionOld() {
  return (
    <Container
      id="terms-section"
      sx={{
        py: { xs: 2, md: 4 },
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="overline" color="primary.main" fontWeight={700}>
          TERMS & CONDITIONS
        </Typography>

        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>
          Competition Rules
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 720, textAlign: 'center' }}
        >
          Please read the following terms carefully before submitting your logo design.
        </Typography>
      </Stack>
      <Card
        sx={{
          mt: 2,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: (theme) => theme.customShadows.z12,
          overflow: 'hidden',
        }}
      >
        <Stack spacing={0}>
          {[
            {
              icon: 'solar:shield-check-bold',
              title: 'Original Design',
              desc: 'Only original and self-created logo designs are allowed. Copied or AI-generated copyrighted designs may be rejected.',
            },
            {
              icon: 'solar:gallery-bold',
              title: 'Single Submission',
              desc: 'Each participant may submit only one logo entry for the competition.',
            },
            {
              icon: 'solar:document-text-bold',
              title: 'Logo Description',
              desc: 'Provide a brief explanation describing the concept and inspiration behind your logo.',
            },
            {
              icon: 'solar:verified-check-bold',
              title: 'Review Process',
              desc: 'All submissions will be reviewed by the CIPIE evaluation committee. The committee’s decision will be final.',
            },
            {
              icon: 'solar:medal-star-bold',
              title: 'Winner Announcement',
              desc: 'Selected participants will be informed through their registered email address.',
            },
            {
              icon: 'solar:copyright-bold',
              title: 'Usage Rights',
              desc: 'The winning logo may be adopted as the official CIPIE logo. By participating, you grant CIPIE permission to use the selected design.',
            },
          ].map((item, index) => (
            <Stack
              key={item.title}
              direction="row"
              spacing={2}
              alignItems="flex-start"
              sx={{
                px: 4,
                py: 3,
                transition: '0.25s',
                borderBottom: index !== 5 ? '1px solid rgba(145,158,171,0.12)' : 'none',

                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  width: 48,
                  height: 48,
                }}
              >
                <Iconify icon={item.icon} width={24} />
              </Avatar>

              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {item.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.desc}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Card>
      <Alert
        severity="warning"
        variant="outlined"
        sx={{
          mt: 4,
          borderRadius: 3,
        }}
        icon={<Iconify icon="solar:danger-triangle-bold" />}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          Important Notice
        </Typography>

        <Typography variant="body2">
          CIPIE reserves the right to disqualify any submission that violates the competition rules
          or contains inappropriate, misleading, or copyrighted content.
        </Typography>
      </Alert>
    </Container>
  );
}
