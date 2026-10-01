import { keyframes } from '@mui/system';
import { Box, Card, Typography, Stack, Button, Divider, Grid } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify'; // adjust path

const OLD_PROGRAMS = [
  {
    id: 1,
    title: 'International Patent Filing Support (IPFS)',
    color: 'primary',
    description:
      'Patent filing support to help startups, MSMEs and MeitY institutions secure global patent protection.',
    points: [
      'Support up to ₹20 lakh per invention',
      'Covers PCT, Paris Convention & Direct Filing',
      'Applicable for ICT domain inventions',
      'Filed under enterprise name',
    ],
    image: '/assets/illustrations/globe.png', // replace with your asset
  },
  {
    id: 2,
    title: 'IP Facilitation for Domestic Filings',
    color: 'success',
    description: 'End-to-end support for protecting intellectual property within India.',
    points: [
      'Covers Patents, Trademarks, Designs, Copyrights & SICLD',
      'Support for filing, prosecution & maintenance',
    ],
    image: '/assets/illustrations/india-map.png',
  },
  {
    id: 3,
    title: 'Innovation Promotion Activities',
    color: 'warning',
    description: 'Programs designed to foster awareness, collaboration and innovation.',
    points: [
      'Training & workshops',
      'Challenge rounds',
      'Industry networking',
      'IP awareness initiatives',
    ],
    image: '/assets/illustrations/rocket.png',
  },
];

const floatY = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.3; }
  70% { transform: scale(1.4); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
`;
const PROGRAMS = [
  {
    id: 1,
    title: 'International Patent Filing Support (IPFS)',
    color: 'primary',
    description:
      'Patent filing support to help startups, MSMEs, MeitY societies / autonomous bodies and grantee institutions (MeitY supported project specific only) secure patent protection in foreign jurisdictions',
    points: [
      'It provides comprehensive patent filing support in the form of services, with total expenditure limited to ₹20 lakh per invention',
      'Support through PCT, Paris Convention and Direct Filing routes',
      //   'The invention must be in the ICT domain',
      //   'The patent application must be filed in the name of enterprise',
    ],
    section: 'services',
    domain: 'ipfs-services',
    subDomain: 'startup-msme',
    image: '/assets/illustrations/globe.png',
    icon: 'mdi:web',
  },
  {
    id: 2,
    title: 'IP Facilitation for Domestic IP Filing',
    color: 'info',
    description:
      'Patent filing support to help MeitY societies, MeitY autonomous bodies and MeitY grantee institutions (MeitY supported project specific only) secure patent protection in Indian jurisdiction',
    points: [
      'It provides various IP filing support including Patents, Trademarks, Designs, Copyrights and Semiconductor Integrated Circuits Layout Desig (SICLD)',
      'Support in the form of services for filing, prosecution and maintenance of domestic IP',
    ],
    section: 'services',
    domain: 'ip-facilitation-services',
    subDomain: 'domestic-patent-filing-maintaining',
    image: '/assets/illustrations/india-map.png',
    icon: 'solar:document-text-bold',
  },
  {
    id: 3,
    title: 'Innovation Promotion Activities',
    color: 'error',
    description:
      'Initiatives designed to foster awareness, collaboration, innovation driven growth and to access available technologies developed by MeitY for facilitating collaboration and licensing / technology transfer to industry partner',
    points: [
      'Training programs and capacity-building workshops',
      'Challenge rounds to encourage breakthrough ideas',
      'Industry meets and networking platforms',
      'Awareness initiatives on IP management and commercialization',
    ],
    section: '',
    domain: 'innovation',
    subDomain: 'all-technologies',
    image: '/assets/illustrations/rocket.png',
    icon: 'solar:rocket-bold',
  },
];
export function ProgramsSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: 5,
        background: 'linear-gradient(180deg, #FFF 50%, hsl(210, 100%, 96%) 100%);',
      }}
    >
      {/* Heading */}
      <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 6 }}>
        IP Catalyst Programs
      </Typography>

      {/* Cards */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {PROGRAMS.map((item) => (
          <ProgramCard key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  );
}

function ProgramCard({ item }) {
  return (
    <Card
      sx={(theme) => ({
        p: 3,
        borderRadius: 4,
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',

        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: theme.shadows[8],
        },
      })}
    >
      {/* 🔹 TEXT + FLOATING ICON */}
      <Box>
        {/* ICON (floated right) */}
        <Box
          sx={(theme) => ({
            float: { xs: 'none', sm: 'right' }, // responsive
            width: 80,
            height: 78,
            ml: { sm: 2 },
            mb: 1,

            bgcolor: theme.palette[item.color].lighter,
            borderRadius: 3,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            animation: `${floatY} 4s ease-in-out infinite`,
          })}
        >
          <Iconify
            icon={item.icon}
            width={50}
            sx={(theme) => ({
              color: theme.palette[item.color].main,
            })}
          />
        </Box>

        {/* TITLE */}
        <Typography
          variant="h6"
          sx={(theme) => ({
            fontWeight: 700,
            color: theme.palette[item.color].main,
            mb: 1,
          })}
        >
          {item.title}
        </Typography>

        {/* DESCRIPTION (wraps around icon) */}
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>

        {/* 🔥 IMPORTANT: clear float */}
        <Box sx={{ clear: 'both' }} />
      </Box>

      {/* DIVIDER */}
      <Divider sx={(theme) => ({ my: 3, borderColor: theme.palette[item.color].lighter })} />

      {/* POINTS */}
      <Stack spacing={1.2}>
        {item.points.map((point, index) => (
          <Stack key={index} direction="row" spacing={1.2}>
            <Iconify
              icon="solar:check-circle-bold"
              width={18}
              sx={(theme) => ({
                color: theme.palette[item.color].main,
                mt: '2px',
              })}
            />
            <Typography variant="body2">{point}</Typography>
          </Stack>
        ))}
      </Stack>

      {/* CTA */}
      <Button
        component={RouterLink}
        to={`/${item.section}/${item.domain}/${item.subDomain}`}
        // endIcon={<Iconify icon="solar:arrow-right-bold" />}
        sx={(theme) => ({
          mt: 3,
          alignSelf: 'flex-start',
          fontWeight: 600,
          color: theme.palette[item.color].main,
        })}
      >
        Know More
      </Button>
    </Card>
  );
}
