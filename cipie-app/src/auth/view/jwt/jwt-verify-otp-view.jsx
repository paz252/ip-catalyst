import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import EmailInboxIcon from 'src/assets/icons/email-inbox-icon';

import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { verifyOtp } from '../../context/jwt';
import { FormHead } from '../../components/form-head';
import { FormResendCode } from '../../components/form-resend-code';
import { FormReturnLink } from '../../components/form-return-link';

// ----------------------------------------------------------------------

export const VerifySchema = z.object({
  code: z
    .string()
    .min(1, { error: 'Code is required' })
    .min(6, { error: 'Code must be at least 6 characters' }),
  email: schemaUtils.email(),
});

// ----------------------------------------------------------------------

export function JwtVerifyOtpView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const RESEND_SECONDS = 60;

  const [resendValue, setResendValue] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  const defaultValues = {
    code: '',
    email: email,
  };

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // ------------------ RESEND OTP ------------------

  const onResendCode = useCallback(async () => {
    if (!email) {
      methods.setError('email', {
        type: 'manual',
        message: 'Please enter your email first',
      });
      return;
    }

    try {
      // 🔥 call resend OTP API here
      // await resendOtp({ email });

      setResendValue(RESEND_SECONDS);
      setResendDisabled(true);
    } catch (error) {
      console.error(error);
    }
  }, [methods]);

  // countdown effect
  useEffect(() => {
    if (!resendDisabled || resendValue <= 0) {
      return undefined; // 👈 makes ESLint happy
    }

    const timer = setInterval(() => {
      setResendValue((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendDisabled, resendValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        email: data.email,
        otp: data.code,
      };

      // await new Promise((resolve) => setTimeout(resolve, 500));
      // console.info('DATA', data);
      await verifyOtp(payload);
      // console.log(payload)
      router.push({
        pathname: '/auth/jwt/reset-password',
        query: {
          email: data.email,
          otp: data.otp,
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

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
        title="Please check your email"
        description={`We've emailed a 6-digit confirmation code. \nPlease enter the code in the box below to verify your email.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {/* <FormResendCode onResendCode={() => { }} value={0} disabled={false} /> */}
      {/* <FormResendCode
                onResendCode={onResendCode}
                value={resendValue}
                disabled={resendDisabled}
            /> */}

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
