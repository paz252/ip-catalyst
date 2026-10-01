import { Box, Button, Stack } from '@mui/material';

import { useConfirmNavigate } from 'src/hooks/useConfirmNavigateCustom';

import { CONFIG } from 'src/global-config';

import { ConfirmDialog } from 'src/components/custom-dialog';

const renderConfirmDialog = (confirmDialog, confirmAndNavigate) => (
  <ConfirmDialog
    open={confirmDialog.value}
    onClose={confirmDialog.onFalse}
    title="Confirm"
    content="This link will take you to external website."
    action={
      <Button variant="contained" color="primary" onClick={() => confirmAndNavigate()}>
        Confirm
      </Button>
    }
  />
);
export function HeaderTopLogos() {
  const { confirmDialog, openConfirm, confirmAndNavigate } = useConfirmNavigate();

  return (
    <Stack direction="row" alignItems="center">
      <Box
        component="div"
        href="#"
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          pr: 2,
          mr: 2,
          height: 50,
          borderRight: (theme) => `1px solid ${theme.palette.grey[400]}`,
        }}
      >
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/logo/meity.png`}
          alt="MeitY"
          sx={{
            height: { xs: 40, sm: 40, md: 60 },
            // width: { xs: 100, sm: 100, md: 160 },
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* <Box
        component="img"
        src={`${CONFIG.assetsDir}/logo/cdac-logo.png`}
        alt="CDAC"
        sx={{
          height: { xs: 45, sm: 45, md: 50 },
          // width: { xs: 45, sm: 45, md: 60 },
          objectFit: 'contain',
        }}
      /> */}

      <Box
        component="div"
        // href="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src={`${CONFIG.assetsDir}/logo/cdac-logo.png`}
          alt="CDAC"
          sx={{
            height: { xs: 45, sm: 45, md: 50 },
            // width: { xs: 45, sm: 45, md: 60 },
            objectFit: 'contain',
          }}
        />
      </Box>
      {renderConfirmDialog(confirmDialog, confirmAndNavigate)}
    </Stack>
  );
}
