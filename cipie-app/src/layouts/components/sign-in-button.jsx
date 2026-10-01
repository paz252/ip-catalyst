import { Box } from '@mui/material';
import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }) {
  return (
    <Button
      component={RouterLink}
      href={CONFIG.auth.redirectPath}
      variant="outlined"
      sx={sx}
      startIcon={
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/assets/images/home/icons/signin-icon.svg`}
          alt="Sign Icon"
          sx={{
            width: 18,
            height: 18,
            objectFit: 'contain',
          }}
        />
      }
      {...other}
    >
      Sign in
    </Button>
  );
}
