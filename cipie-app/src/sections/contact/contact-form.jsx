import * as z from 'zod';
import { useState } from 'react';
import { useForm, Watch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Button, Typography, Alert } from '@mui/material';

import { sendContactForm } from 'src/actions/contact';

import { Form, Field } from 'src/components/hook-form';

// import { getErrorMessage } from 'src/auth/utils';

export const ContactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required!' }),
  email: z.string().email({ message: 'Enter a valid email!' }),
  subject: z
    .string()
    .min(1, { message: 'Subject is required!' })
    .max(100, { message: 'Subject must be less than 100 characters!' }),
  message: z
    .string()
    .min(20, { message: 'Message must be at least 20 characters!' })
    .max(1000, { message: 'Message must be less than 1000 characters!' }),
});

export function ContactForm({ sx, ...other }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const defaultValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  const methods = useForm({
    resolver: zodResolver(ContactSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const response = await sendContactForm(data);

      if (response?.success) {
        setSuccessMessage(
          response.message ||
            "Your message has been sent successfully. We'll get back to you shortly."
        );
        reset();
        setTimeout(() => {
          setSuccessMessage('');
        }, 6000);
      } else {
        setErrorMessage(response?.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong. Please try again later.'
      );
    }
  });

  return (
    <Box sx={sx} {...other}>
      <Typography variant="h3">
        Feel free to contact us. <br />
        We&apos;ll be glad to hear from you.
      </Typography>

      {!!errorMessage && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {!!successMessage && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            my: 5,
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Field.Text name="name" label="Name" />
          <Field.Text name="email" label="Email" />
          <Field.Text name="subject" label="Subject" />
          <Field.Text
            name="message"
            label="Enter your message here."
            multiline
            rows={4}
            inputProps={{ maxLength: 1000 }}
          />
        </Box>

        <Button size="large" type="submit" variant="contained" loading={isSubmitting}>
          Submit
        </Button>
      </Form>
    </Box>
  );
}
