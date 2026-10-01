import { Typography, Stack, Box } from '@mui/material';

import { CONFIG } from 'src/global-config';

// import { Iconify } from 'src/components/iconify';

export function PatentChartHeader({ header, description, domain }) {
  // console.log(header);
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {/* <Iconify icon={header.icon} width={34} sx={{ color: 'primary.main' }} /> */}

        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/images/home/browse-patents/icons/${domain}.svg`}
          alt={header.icon}
          sx={{ width: 35, height: 35 }}
        />

        <Typography
          variant="h4"
          component="h1"
          fontWeight={700}
          sx={{ color: 'text.primary', textTransform: 'uppercase' }}
        >
          {header.title}
        </Typography>
      </Stack>

      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>

      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Total Patents: {header.total}
      </Typography>
    </Stack>
  );
}
