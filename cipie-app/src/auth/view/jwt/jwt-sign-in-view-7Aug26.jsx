import * as z from 'zod';
import CryptoJS from 'crypto-js';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
// import DomainSelectionDialog from './DomainSelectionDialog';
import {
  login,
  getCaptcha,
  // completeLdapProfile,
  // ldapLogin,
} from '../../context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = z.object({
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
  captchaText: z.string().min(1, 'Captcha is required'),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState(null);
  const [captcha, setCaptcha] = useState(null);
  // const [openDomainDialog, setOpenDomainDialog] = useState(false);
  // const [ldapData, setLdapData] = useState(null);

  const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16 chars for AES-128
  const iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16 chars

  const defaultValues = {
    email: '',
    password: '',
    captchaText: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
    // mode: 'onBlur',
    // reValidateMode: 'onChange'
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const loadCaptcha = async () => {
    try {
      const res = await getCaptcha();
      setCaptcha(res);
      setValue('captchaText', '');
    } catch (err) {
      console.error('Captcha load failed', err);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(data.password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      if (!captcha?.captchaId) {
        setErrorMessage('Captcha not loaded. Please refresh.');
        return;
      }

      // ====================================================================
      // Only for non ldap login

      await login({
        email: data.email,
        password: encrypted,
        captchaId: captcha.captchaId,
        captchaText: data.captchaText,
      });
      await checkUserSession?.();

      // ===============================================================

      // Ldap login

      // const isLdap = data.email.toLowerCase().endsWith('@cdac.in');
      // if (!isLdap) {
      //   await login({
      //     email: data.email,
      //     password: encrypted,
      //     captchaId: captcha.captchaId,
      //     captchaText: data.captchaText,
      //   });
      //   await checkUserSession?.();
      //   return;
      // }

      // const ldapResponse = await ldapLogin({
      //   email: data.email,
      //   password: encrypted,
      //   captchaId: captcha.captchaId,
      //   captchaText: data.captchaText,
      // });

      // if (ldapResponse.requiresProfileCompletion) {
      //   setLdapData(ldapResponse);
      //   setOpenDomainDialog(true);
      //   return;
      // } else {
      //   await checkUserSession?.();
      //   return;
      // }
      // ==============================================================

      // router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
      // calling function to load new captcha on login failure
      loadCaptcha();
      setValue('captchaText', '');
    }
  });

  // const handleDomainSubmit = async (domain) => {
  //   try {
  //     await completeLdapProfile({
  //       onboardingToken: ldapData.onboardingToken,
  //       domainCode: domain.code,
  //     });

  //     setOpenDomainDialog(false);
  //     await checkUserSession?.();
  //     return;
  //   } catch (err) {
  //     // toast.error(err.message);
  //   }
  // };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="Email address"
        placeholder="Enter email"
        slotProps={{ inputLabel: { shrink: true } }}
        required
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Link
          component={RouterLink}
          href="/auth/jwt/forgot-password"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>

        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          required
        />

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'center' },
          }}
        >
          <Field.Text
            name="captchaText"
            label="Captcha"
            placeholder="Enter captcha"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ flex: 1 }}
            required
          />

          {captcha && (
            <Box
              className="captcha-container"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'space-evenly', md: 'flex-start' },
                height: 56,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                gap: 1,
              }}
            >
              <Box
                component="img"
                src={`data:image/png;base64,${captcha.image}`}
                alt="Captcha"
                sx={{
                  height: '100%',
                  maxWidth: 120,
                  objectFit: 'contain',
                }}
              />

              <IconButton
                size="small"
                onClick={loadCaptcha}
                sx={{
                  bgcolor: 'gray',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                <Iconify
                  width={20}
                  icon="tabler:refresh"
                  sx={{ color: 'white', '&:hover': { color: 'black' } }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      <Button
        disabled={!captcha}
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Sign in to your account"
        description={
          <>
            {`Don’t have an account? `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              Get started
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {/* <DomainSelectionDialog
        open={openDomainDialog}
        domains={ldapData?.domains ?? []}
        // loading={loading}
        onSubmit={handleDomainSubmit}
      /> */}
    </>
  );
}
