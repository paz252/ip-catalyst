import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createAndSubmitQuery } from 'src/actions/userQueries';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { useGlobalLoading } from "src/components/global-loading";

// ----------------------------------------------------------------------

const cleanTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;

export const IndianPatentCreateSchema = z.object({
  message: z.string()
    .min(1, { message: 'Query is required' })
    .min(50, { message: 'Query must be at least 50 characters' })
    .max(500, { message: 'Query cannot exceed 500 characters' })
    .refine((val) => cleanTextRegex.test(val), {
      message: 'Please enter valid query',
    }),
});

// ----------------------------------------------------------------------

export function QueryCreateForm() {

  const router = useRouter();
  const { showLoading, hideLoading } = useGlobalLoading();

  const openDetails = useBoolean(true);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [isDraftAction, setIsDraftAction] = useState(false);

  const defaultValues = {
    message: ""
  };

  const methods = useForm({
    resolver: zodResolver(IndianPatentCreateSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, formState: { isSubmitting } } = methods;

  const values = watch();

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  // ----------------------------------------------------------------------

  const onSubmit = handleSubmit(async (payload) => {

    try {

      showLoading("Submitting query…");

      const response = await createAndSubmitQuery(
        payload,
        isDraftAction,
        (msg) => setLoadingMsg(msg) // Callback to update UI text
      );
      if (response.success) {
        toast.success('Query submitted successfully!');
        router.push(paths.dashboard.userQuery.root);
      }

    } catch (error) {
      console.error(error);
      toast.error('Submission failed.');
    } finally {
      hideLoading();
    }

  });

  const onError = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorMessage = errors[firstErrorKey]?.message;

    toast.error(firstErrorMessage || "Please check the required details.");
  };

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Query Details"
        // subheader="Core information about the invention"
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>

          <Field.Text
            name="message"
            label="Query"
            multiline
            rows={3}
            required
          />

        </Stack>
      </Collapse>
    </Card>
  );

  // ----------------------------------------------------------------------

  const renderActions = () => (

    <Box
      sx={{
        gap: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >

      <Button
        type="submit"
        variant="soft"
        color="primary"
        size="small"
        loading={isSubmitting}
      >
        Submit
      </Button>

    </Box>

  );

  // ----------------------------------------------------------------------

  return (

    <Form methods={methods} onSubmit={handleSubmit(onSubmit, onError)}>

      <Stack
        spacing={{ xs: 3, md: 5 }}
        sx={{
          mx: "auto",
          maxWidth: { xs: 920, xl: 880 }
        }}
      >
        {renderDetails()}
        {renderActions()}

      </Stack>

    </Form>

  );

}