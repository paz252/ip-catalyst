import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ApplicationDetailsApplicant({ customer }) {
  const userType = customer?.userTypeCode;
  return (
    <>
      <CardHeader
        title="Applicant Information"
        action={
          // <IconButton>
          //   <Iconify icon="solar:pen-bold" />
          // </IconButton>
          <Label
            variant="soft"
            // color={
            //   (userType === 'R&D' && 'success') ||
            //   (userType === 'pending' && 'warning') ||
            //   (userType === 'Rejected' && 'error') ||
            //   (userType === 'Submitted' && 'info') ||
            //   'default'
            // }
            color='success'
          >
            {userType}
          </Label>
        }
      />
      <Box sx={{ p: 3, display: 'flex' }}>
        <Avatar
          alt={customer?.fullName}
          src={customer?.avatarUrl}
          sx={{ width: 48, height: 48, mr: 2 }}
        />

        <Stack spacing={0.5} sx={{ typography: 'body2', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2">{customer?.fullName}</Typography>
          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>

          <div>
            Organization:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.organizationName}
            </Box>
          </div>

          <div>
            Domain:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {customer?.domainName}
            </Box>
          </div>

          {/* <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 1 }}
          >
            Add to blacklist
          </Button> */}
        </Stack>
      </Box>
    </>
  );
}
