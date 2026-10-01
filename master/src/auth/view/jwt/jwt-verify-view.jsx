import * as z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import EmailInboxIcon from 'src/assets/icons/email-inbox-icon';

import { Form, Field } from 'src/components/hook-form';

import { resendOtp } from 'src/auth/context/jwt/action';

// import { getErrorMessage } from '../../utils';
import { verifyUser } from '../../context/jwt';
import { FormHead } from '../../components/form-head';
import { setFormServerErrors } from './form-server-error-helper';
import { FormResendCode } from '../../components/form-resend-code';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export const VerifySchema = z.object({
  code: z
    .string()
    .min(1, { error: 'OTP is required' })
    .min(6, { error: 'OTP must be at least 6 characters' }),
});

// ----------------------------------------------------------------------

export function JwtVerifyView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  // this useeffect is to redirect the user to sign-in page if email is not present in the query params
  useEffect(() => {
    if (!email) {
      router.push(paths.auth.jwt.signIn);
    }
  }, [email, router]);

  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);

  // ✅ resend state
  const [loadingResend, setLoadingResend] = useState(false);
  const [seconds, setSeconds] = useState(180);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }

    return undefined; // ✅ fix ESLint
  }, [seconds]);

  const defaultValues = {
    code: '',
  };

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        email,
        otp: data.code,
      };

      const response = await verifyUser(payload);
      if (response.message) {
        setMessage(response.message);

        // Clear the code field
        reset({ code: '' });

        // Wait 3 seconds (3000ms) before navigating
        setTimeout(() => {
          router.push(`/auth/jwt/sign-in`);
        }, 1500);
      }
    } catch (error) {
      // console.error(error);
      // const feedbackMessage = getErrorMessage(error);
      // setErrorMessage(feedbackMessage);

      console.error(error);
      setFormServerErrors(error, setError, {
        otp: 'code',
      });

      toast.error(error?.message || 'OTP verification failed');
      setErrorMessage(null);
    }
  });

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (seconds > 0) return; // prevent spam

    try {
      setLoadingResend(true);

      await resendOtp(email);

      toast.success('OTP resent successfully');

      setSeconds(180); // reset timer
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Failed to resend OTP');
    } finally {
      setLoadingResend(false);
    }
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Code name="code" />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Verify..."
      >
        Verify
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Verify your email address!"
        description={`We've sent a verification code to ${email} \nPlease enter the code in the box below to verify your email.`}
      />

      {/* {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {!!errorMessage && (
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

      {!!message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormResendCode
        onResendCode={handleResendOtp}
        value={seconds}
        disabled={seconds > 0 || loadingResend}
      />

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
