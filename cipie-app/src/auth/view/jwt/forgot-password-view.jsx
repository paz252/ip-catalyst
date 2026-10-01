import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PasswordIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

// import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { forgotPassword, getCaptcha } from '../../context/jwt';
import { setFormServerErrors } from './form-server-error-helper';
// import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = z.object({
  email: schemaUtils.email(),
  captchaText: z.string().min(1, 'Captcha is required'),
});

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const router = useRouter();

  const [captcha, setCaptcha] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState('');

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
      captchaText: '',
    },
  });

  const {
    handleSubmit,
    setError,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // ---------------- CAPTCHA ----------------
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

  // ---------------- COOLDOWN TIMER ----------------
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timer);
  }, [cooldown]);

  const Old_onSubmit = handleSubmit(async (data) => {
    try {
      if (isSubmitting || cooldown > 0) return;

      const payload = {
        email: data.email,
        captchaId: captcha?.captchaId,
        captchaText: data.captchaText,
      };

      // console.log("FORGOT PAYLOAD 👉", payload);

      if (!payload.captchaId) {
        setErrorMessage('Captcha not loaded. Please refresh.');
        return;
      }

      const response = await forgotPassword(payload);

      // ✅ HANDLE BASED ON RESPONSE
      if (response?.success) {
        setCooldown(30);
        setErrorMessage(null);

        setMessage(response.message || 'Reset link sent successfully');

        router.push(`/auth/jwt/reset-password?email=${encodeURIComponent(data.email)}`);
      } else {
        // ❌ API returned success = false
        setMessage('');
        setErrorMessage(response?.message || 'Invalid email or request failed');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);

      let msg = 'Something went wrong';

      const responseData = error?.response?.data;

      if (responseData) {
        // ✅ Handle ASP.NET style Errors array
        if (Array.isArray(responseData.Errors) && responseData.Errors.length > 0) {
          msg = responseData.Errors.join(', ');
        }
        // ✅ fallback to Message
        else if (responseData.Message) {
          msg = responseData.Message;
        }
        // ✅ fallback to title
        else if (responseData.title) {
          msg = responseData.title;
        }
      } else if (error?.message) {
        msg = error.message;
      }

      setErrorMessage(msg);
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isSubmitting || cooldown > 0) return;

      const payload = {
        email: data.email,
        captchaId: captcha?.captchaId,
        captchaText: data.captchaText,
      };

      // console.log("FORGOT PAYLOAD 👉", payload);

      if (!payload.captchaId) {
        toast.error('Captcha not loaded. Please refresh.');
        return;
      }

      const response = await forgotPassword(payload);

      // ✅ HANDLE BASED ON RESPONSE
      if (response?.success) {
        setCooldown(30);

        toast.success(response.message || 'Reset link sent successfully');
        router.push(`/auth/jwt/reset-password?email=${encodeURIComponent(data.email)}`);
      } else {
        // ❌ API returned success = false
        setMessage('');
        toast.error(response?.message || 'Invalid email or request failed');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);

      setFormServerErrors(error, setError);

      toast.error(error?.message || 'Something went wrong');

      await loadCaptcha();
      setValue('captchaText', '');
    }
  });
  // ---------------- UI ----------------
  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* EMAIL */}
      <Field.Text
        autoFocus
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {/* CAPTCHA */}
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
        />

        {captcha && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
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

            <IconButton size="small" onClick={loadCaptcha}>
              <Iconify icon="tabler:refresh" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* MESSAGE */}
      {!!message && <Alert severity="info">{message}</Alert>}

      {/* SUBMIT */}
      <Button
        disabled={isSubmitting || cooldown > 0 || !captcha}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sending..."
      >
        {cooldown > 0 ? `Wait ${cooldown}s` : 'Send request'}
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Forgot your password?"
        description={`Please enter the email address associated with your account and we'll email you a link to reset your password.`}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {/* <FormReturnLink href={paths.auth.signIn} />  */}
      <Link
        component={RouterLink}
        to="/auth/jwt/sign-in"
        variant="body2"
        color="inherit"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: 2,
        }}
      >
        Back to sign in
      </Link>
      {/* <Button onClick={() => router.push('/auth/jwt/sign-in')}>
  Back to Sign in
</Button> */}
    </>
  );
}
