import * as z from 'zod';
import CryptoJS from 'crypto-js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';
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
  resendOtp,
  // completeLdapProfile,
  // ldapLogin,
} from '../../context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = z.object({
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  captchaText: z.string().min(1, 'Captcha is required'),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const navigate = useNavigate();
  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState(null);
  const [captcha, setCaptcha] = useState(null);
  // const [openDomainDialog, setOpenDomainDialog] = useState(false);
  // const [ldapData, setLdapData] = useState(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [loadingVerifyEmail, setLoadingVerifyEmail] = useState(false);

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
    setError,
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
      // console.error('===== LOGIN CATCH =====');
      console.error(error);

      // -------------------------------------------------------
      // 1. Field-specific backend validation errors
      // -------------------------------------------------------
      if (error?.errors && typeof error.errors === 'object' && !Array.isArray(error.errors)) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages.join(', ') : String(messages);

          setError(field, {
            type: 'server',
            message,
          });
        });

        setErrorMessage(null);
        setShowVerifyEmail(false);
      }

      // -------------------------------------------------------
      // 2. Email verification required
      // -------------------------------------------------------
      else if (error?.status === 403 && error?.message === 'Please verify OTP before login') {
        setPendingVerificationEmail(data.email);
        setShowVerifyEmail(true);
        setErrorMessage(error.message);
      }

      // -------------------------------------------------------
      // 3. Backend returned an array of general errors
      // -------------------------------------------------------
      else if (Array.isArray(error?.errors) && error.errors.length > 0) {
        setErrorMessage(error.errors.join(', '));
        setShowVerifyEmail(false);
      }

      // -------------------------------------------------------
      // 4. Normal/general backend error
      // -------------------------------------------------------
      else {
        setErrorMessage(error?.message || 'Sign in failed');
        setShowVerifyEmail(false);
      }

      // -------------------------------------------------------
      // 5. Reload captcha after every failed login
      // -------------------------------------------------------
      await loadCaptcha();
      setValue('captchaText', '');
    }
    // } catch (error) {
    //   console.error(error);
    //   const feedbackMessage = getErrorMessage(error);

    //   const shouldVerify =
    //     error.status === 403 && feedbackMessage === 'Please verify OTP before login';

    //   if (shouldVerify) {
    //     setPendingVerificationEmail(data.email);

    //     setShowVerifyEmail(true);

    //     setErrorMessage(feedbackMessage);

    //     return;
    //   }

    //   setShowVerifyEmail(false);
    //   setErrorMessage(feedbackMessage);

    //   loadCaptcha();
    //   setValue('captchaText', '');
    // }
  });
  // useEffect(() => {
  //   console.log('showVerifyEmail:', showVerifyEmail);
  // }, [showVerifyEmail]);

  const handleVerifyEmail = async () => {
    try {
      setLoadingVerifyEmail(true);

      await resendOtp(pendingVerificationEmail);

      router.push(`/auth/jwt/verify?email=${encodeURIComponent(pendingVerificationEmail)}`);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoadingVerifyEmail(false);
    }
  };

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
          <Stack spacing={2} flexDirection="column" justifyContent="space-between">
            <Typography variant="body2">{errorMessage}</Typography>

            {showVerifyEmail && (
              <>
                <Alert severity="warning" sx={{ mb: 1 }}>
                  Your email address has not been verified yet. Please verify your email to
                  continue.
                </Alert>

                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Iconify icon="solar:verified-check-bold" />}
                  loading={loadingVerifyEmail}
                  onClick={handleVerifyEmail}
                  sx={{
                    fontWeight: 700,
                    transition: 'all .3s',
                    '& .iconify': {
                      transition: '.3s',
                    },
                    '&:hover .iconify': {
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  Verify Email Address
                </Button>
              </>
            )}
          </Stack>
        </Alert>
      )}
      {/* {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )} */}

      {/* {showVerifyEmail && (
        <Button
          fullWidth
          variant="outlined"
          loading={loadingVerifyEmail}
          onClick={handleVerifyEmail}
          sx={{ mb: 3 }}
        >
          Verify Email
        </Button>
      )} */}
      {/* {showVerifyEmail && (
        <Box sx={{ bgcolor: 'red', p: 2, mb: 2 }}>
          <Button fullWidth variant="contained" onClick={handleVerifyEmail}>
            Verify Email
          </Button>
        </Box>
      )} */}

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
