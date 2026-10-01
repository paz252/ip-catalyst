import * as z from 'zod';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { getMyProfile } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export const UpdateUserSchema = z.object({
  displayName: z.string().min(1, { error: 'Name is required!' }),
  email: schemaUtils.email(),
  role: z.string().min(1, { error: 'Role is required!' }),
  organizationName: z.string().min(1, { error: 'Organization is required!' }),
  domainName: z.string().min(1, { error: 'Domain is required!' }),
  isPublic: z.boolean(),
  // Optional avatar
  photoURL: schemaUtils.file({ required: false }),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  // const { user } = useAuthContext();

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      displayName: '',
      email: '',
      role: '',
      organizationName: '',
      domainName: '',
      isPublic: false,
      photoURL: null,
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Call your update API here
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      // console.info('Form Data:', data);
    } catch (error) {
      console.error(error);
      toast.error('Update failed!');
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const profile = await getMyProfile();
        // console.log('Profile fetched:', profile);

        // Populate form with API response
        reset({
          displayName: `${profile.firstName} ${profile.lastName}`,
          email: profile.email,
          role: profile.userTypeCode,
          organizationName: profile.organizationName,
          domainName: profile.domainName,
          isPublic: true, // default or from profile if available
          photoURL: null, // set avatar if your API provides a URL
        });
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    })();
  }, [reset]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 10, px: 3, textAlign: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: 'grey.main' }}>
              <Icon icon="mdi:account-circle" width={60} height={60} />
            </Avatar>
            {/* <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{ mt: 3, mx: 'auto', display: 'block', textAlign: 'center', color: 'text.disabled' }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            /> */}

            {/* <Field.Switch
              name="isPublic"
              labelPlacement="start"
              label="Public profile"
              sx={{ mt: 5 }}
            /> */}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            {/* <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="displayName" label="Name" disabled/>
              <Field.Text name="email" label="Email address" disabled/>
              <Field.Text name="role" label="Role" disabled/>
              <Field.Text name="domainName" label="Domain" disabled/>
            </Box> */}

            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {[
                { label: 'Name', value: values.displayName },
                { label: 'Email address', value: values.email },
                { label: 'Role', value: values.role },
                { label: 'Domain', value: values.domainName },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: 'grey.100',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Field.Text name="organizationName" label="Organization" disabled />
            </Stack> */}
            <Box
              sx={{
                width: '100%',
                p: 2,
                borderRadius: 2,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Organization
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  // color: '#003399',
                }}
              >
                {values.organizationName || '-'}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
