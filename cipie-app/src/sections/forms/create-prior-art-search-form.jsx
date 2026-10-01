import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

const createDescriptionSchema = (fieldName) =>
  z
    .string()
    .min(10, { message: `${fieldName} must be at least 10 characters` })
    .max(500, { message: `${fieldName} must be less than 500 characters` })
    .nonempty({ message: `${fieldName} is required` });

export const PriorArtCreateSchema = z.object({
  name: z.string().min(1, { error: 'Title is required!' }),
  description1: createDescriptionSchema('Invention  Description'),
  description2: createDescriptionSchema('Problem statement'),
  description3: createDescriptionSchema('Proposed solution '),
  description4: createDescriptionSchema('Detailed invention description'),
  description5: createDescriptionSchema('Novelty'),
  description6: createDescriptionSchema('Apparatus description'),
  description7: createDescriptionSchema('Key components'),
  description8: createDescriptionSchema('Technical advantages'),
  description9: createDescriptionSchema('Prior disclosure history'),
  description10: createDescriptionSchema('Related publications'),
});

export function CreatePriorArtSearchForm({ currentStatus }) {
  const router = useRouter();

  const openInventionDetails = useBoolean(true);
  const openTechnicalDetails = useBoolean(true);

  const defaultValues = {
    name: '',
    description: '',
    description1: '',
    description2: '',
    description3: '',
    images: [],
  };

  const methods = useForm({
    resolver: zodResolver(PriorArtCreateSchema),
    defaultValues,
    values: currentStatus,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      // taxes: includeTaxes ? defaultValues.taxes : data.taxes,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentStatus ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
      // console.info('DATA', updatedData);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', [], { shouldValidate: true });
  }, [setValue]);

  const renderCollapseButton = (value, onToggle) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const renderInventionDetails = () => (
    <Card>
      <CardHeader
        title="Details of the Invention"
        subheader="Primary details of the invention"
        action={renderCollapseButton(openInventionDetails.value, openInventionDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openInventionDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="name" label="Invention Name" />

          <Field.Text name="description" label="Problem Overview" multiline rows={4} />

          <Field.Text name="description" label="Proposed Approach" multiline rows={4} />

          <Field.Text name="description" label="Invention description" multiline rows={4} />

          <Field.Text name="description" label="Unique accepts" multiline rows={4} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Images</Typography>
            <Field.Upload
              multiple
              name="images"
              maxSize={3145728}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.info('ON UPLOAD')}
            />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderTechnicalDetails = () => (
    <Card>
      <CardHeader
        title="Technical details"
        subheader="Extra technical details"
        action={renderCollapseButton(openTechnicalDetails.value, openTechnicalDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openTechnicalDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text name="description" label="Description of Apparatus" multiline rows={4} />

          <Field.Text name="description" label="Primary components" multiline rows={4} />
          <Field.Text name="description" label="Innovative advantages" multiline rows={4} />
          <Field.Text name="description" label="Previous disclosures" multiline rows={4} />

          <Field.Text name="description" label="Relevant publications" multiline rows={4} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Images</Typography>
            <Field.Upload
              multiple
              name="images"
              maxSize={3145728}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.info('ON UPLOAD')}
            />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <FormControlLabel
        label="Publish"
        control={<Switch defaultChecked slotProps={{ input: { id: 'publish-switch' } }} />}
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentStatus ? 'Create product' : 'Save changes'}
      </Button>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderInventionDetails()}
        {renderTechnicalDetails()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
