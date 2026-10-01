import { useNavigate } from 'react-router';

import { useTheme } from '@mui/material';
import { Box, Card, Stack, Typography, Skeleton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { useGetPatentDomainsCount } from 'src/actions/patent';

import { Iconify } from 'src/components/iconify';

const DOMAIN_KEY_MAP = {
  'Information & Communication Technology': 'ict',
  'Mechanical & Industrial Engineering': 'mech',
  'Materials, Chemical & Nano Sciences': 'mat',
  'Medical & Life Sciences': 'med',
  'Electrical & Electronics Engineering': 'elec',
  'Measurement & Optical Technologies': 'opt',
  'Other Technologies': 'other',
};

const FALLBACK_DATA = [
  {
    mainTechnologyDomain: 'Mechanical & Industrial Engineering',
    total: 24,
  },
  {
    mainTechnologyDomain: 'Electrical & Electronics Engineering',
    total: 21,
  },
  {
    mainTechnologyDomain: 'Measurement & Optical Technologies',
    total: 20,
  },
  {
    mainTechnologyDomain: 'Medical & Life Sciences',
    total: 35,
  },
  {
    mainTechnologyDomain: 'Materials, Chemical & Nano Sciences',
    total: 37,
  },
  {
    mainTechnologyDomain: 'Information & Communication Technology',
    total: 52,
  },
  {
    mainTechnologyDomain: 'Other Technologies',
    total: 64,
  },
  {
    mainTechnologyDomain: 'All Technologies',
    total: 253,
  },
];

const getColor = (key) => {
  const map = {
    // mech: '#1948d2',
    mech: '#0049FF',
    med: '#f56b4a',
    // mat: '#3cc943',
    mat: '#22C55E',
    // ict: '#ffb03c',
    ict: '#F9C817',
    elec: '#00B8D9',
    // opt: '#a524bb',
    opt: '#A855F7',
    // other: '#77e14d',
    other: '#8BA00C',
    'all-technologies': '#1d4776',
  };
  return map[key] || '#1976d2';
};

export function HomeBrowsePatentsTechnologySection() {
  const navigate = useNavigate();
  const theme = useTheme();

  const { domains, total, domainsLoading } = useGetPatentDomainsCount();
  const isError = !domainsLoading && (!domains || domains.length === 0);

  let data = [];

  if (domainsLoading) {
    data = Array.from({ length: 8 }); // skeletons
  } else if (isError) {
    data = FALLBACK_DATA; // dummy data
  } else {
    data = [...domains, { mainTechnologyDomain: 'All Technologies', total }];
  }

  const renderCard = (item, index) => {
    if (domainsLoading) {
      return (
        <Skeleton
          variant="rounded"
          sx={{
            width: '100%',
            aspectRatio: '1 / 0.85',
            borderRadius: 3,
          }}
        />
      );
    }

    const label = item.mainTechnologyDomain;
    const count = item.total;

    const key = label === 'All Technologies' ? 'all-technologies' : DOMAIN_KEY_MAP[label];

    const color = getColor(key);
    // console.log(key);

    return (
      <Card
        onClick={() => navigate(paths.innovationApplication.domain(key))}
        sx={{
          width: '100%',
          aspectRatio: '1 / 0.9', // shorter height
          py: { xs: 1, md: 1 },
          px: { xs: 1, md: 2 },
          borderRadius: 2,
          // height: 160,
          cursor: 'pointer',

          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',

          border: '1px solid rgba(0,0,0,0.08)',
          background: '#fff',

          transition: 'all 0.25s ease',

          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 20px ${color}20`,
          },
        }}
      >
        <Stack sx={{ height: '100%', justifyContent: 'space-evenly' }}>
          {/* Label */}
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              color: '#000',
              lineHeight: 1.3,
              fontSize: { xs: 14, md: theme.typography.h5.fontSize },
              fontWeight: 650,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {label}
          </Typography>

          {/* Count */}
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: 14, md: theme.typography.h4.fontSize },
              // fontSize: 20,
              fontWeight: 600,
              color,
            }}
          >
            {count} Patents
          </Typography>

          {/* Bottom Row */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {/* SVG Icon (replace later) */}
            <Box
              component="img"
              src={`${CONFIG.assetsDir}/assets/images/home/browse-patents/icons/${key}.svg`}
              alt={key}
              sx={{ width: { xs: 22, md: 65 }, height: { xs: 22, md: 65 } }}
            />

            {/* Arrow */}
            <Iconify icon="flowbite:arrow-right-outline" width={35} sx={{ color: '#2085e8' }} />
          </Stack>
        </Stack>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 5 },
        // px: { xs: 2, md: 10 },

        backgroundImage: `url(${CONFIG.assetsDir}/assets/images/home/browse-patents/BG_Browse-Patents-by-Technology.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          px: {
            xs: 2,
            sm: 4,
            md: 6,
            lg: 8,
            xl: 12, // 👈 expands nicely on big screens
          },
        }}
      >
        <Typography
          variant="h3"
          sx={{ textAlign: 'center', fontWeight: 700, mb: 3, color: 'white' }}
        >
          Browse Patents by Technology
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)', // mobile
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)', // desktop
            },
            gap: { xs: 1.5, md: 2 },
          }}
        >
          {data.map((item, i) => (
            <Box key={i}>{renderCard(item, i)}</Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
