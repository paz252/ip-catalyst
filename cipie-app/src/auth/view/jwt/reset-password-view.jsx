import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
// import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { resetPassword, resendOtpForgetPassword } from 'src/auth/context/jwt/action';

import { FormHead } from '../../components/form-head';
import { setFormServerErrors } from './form-server-error-helper';
import { FormResendCode } from '../../components/form-resend-code';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export const UpdatePasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, { error: 'Otp is required' })
      .min(6, { error: 'Otp must be at least 6 characters' }),
    email: schemaUtils.email(),
    password: z
      .string()
      .min(1, { error: 'Password is required' })
      .min(6, { error: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(1, { error: 'Confirm password is required' }),
  })
  .refine((val) => val.password === val.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function ResetPasswordView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState('');

  // ✅ resend state
  const [loadingResend, setLoadingResend] = useState(false);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }

    return undefined; // ✅ fix ESLint
  }, [seconds]);

  const defaultValues = {
    code: '',
    email: email,
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  // ✅ Reset Password Submit
  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage(null); // reset previous error
    try {
      const payload = {
        email: data.email,
        otp: data.code,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      };

      const res = await resetPassword(payload);

      // ✅ success
      router.push({
        pathname: paths.auth.jwt.signIn,
        query: { email: data.email },
      });
    } catch (error) {
      // if (Array.isArray(error.errors) && error.errors.length > 0) {
      //   setErrorMessage(error.errors); // array
      // } else {
      //   setErrorMessage(error.message); // string
      // }

      console.error(error);
      setFormServerErrors(error, setError, {
        newPassword: 'password',
        otp: 'code',
      });

      toast.error(error?.message || 'Reset password failed');
      setErrorMessage(null);
    }
  });

  // ✅ Resend OTP handler
  const handleResendOtp = async () => {
    if (seconds > 0) return; // prevent spam

    try {
      setLoadingResend(true);

      await resendOtpForgetPassword(email);

      toast.success('OTP resent successfully');

      setSeconds(30); // reset timer
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Failed to resend OTP');
    } finally {
      setLoadingResend(false);
    }
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        slotProps={{ inputLabel: { shrink: true } }}
        disabled
      />

      <Field.Code name="code" />

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
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirm new password"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Update password..."
      >
        Update password
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<SentIcon />}
        title="Request sent successfully"
        description={`We've sent a 6-digit confirmation email to your email. \nPlease enter the code in below box to verify your email.`}
      />

      {/* {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {Array.isArray(errorMessage) ? (
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {errorMessage.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          ) : (
            errorMessage
          )}
        </Alert>
      )} */}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {/* ✅ FIXED HERE */}
      <FormResendCode
        onResendCode={handleResendOtp}
        value={seconds}
        disabled={seconds > 0 || loadingResend}
      />

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
