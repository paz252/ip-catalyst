import * as z from 'zod';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState, useForm } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import {
  Tab,
  Tabs,
  Stack,
  Dialog,
  Button,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  Box,
} from '@mui/material';

import { PATENT_DOMAINS } from 'src/config/patent-domain';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { DiscardChangesDialog } from './patent-hosting-discard-changes-dialog';

export const PatentInformationSchema = z.object({
  recordNumber: z
    .string()
    .min(1, 'Patent/Application Number is required')
    .max(100, 'Maximum 100 characters'),

  // legalStatusCurrent: z.string().min(1, 'Status is required'),

  filingApplicationDate: z.any().refine((value) => !!value, {
    message: 'Filing Date is required',
  }),

  mainTechnologyDomain: z.string().min(1, 'Main Technology Domain is required'),

  techSubDomain: z.string().min(1, 'Technology Sub Domain is required'),

  assignee: z.string().min(1, 'Assignee is required').max(300, 'Maximum 300 characters'),

  inventors: z.string().min(1, 'Inventors are required').max(1000, 'Maximum 1000 characters'),

  abstract: z
    .string()
    .min(50, 'Abstract should contain at least 50 characters')
    .max(5000, 'Maximum 5000 characters'),

  claims: z
    .string()
    .min(20, 'Claims should contain at least 20 characters')
    .max(10000, 'Maximum 10000 characters'),
});

export function PatentInformationDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
  defaultValues,
}) {
  // console.log(`defaultValues`, defaultValues);

  const PATENT_INFORMATION_TABS = [
    {
      label: 'Information',
      icon: 'solar:document-text-bold',
    },
    {
      label: 'Assignee & Inventors',
      icon: 'solar:users-group-rounded-bold',
    },
    {
      label: 'Abstract',
      icon: 'solar:notebook-bold',
    },
    {
      label: 'Claims',
      icon: 'solar:shield-check-bold',
    },
  ];

  const initialValues = {
    recordNumber: '',
    // legalStatusCurrent: '',
    filingApplicationDate: null,
    mainTechnologyDomain: '',
    techSubDomain: '',
    assignee: '',
    inventors: '',
    abstract: '',
    claims: '',
  };

  const [tabValue, setTabValue] = useState(0);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [showTabErrors, setShowTabErrors] = useState(false);

  const methods = useForm({
    resolver: zodResolver(PatentInformationSchema),
    defaultValues: initialValues,
  });

  // console.log(methods.getValues());

  const { watch, setValue, reset, clearErrors } = methods;

  const { errors } = useFormState({
    control: methods.control,
  });

  const selectedDomain = watch('mainTechnologyDomain');

  const mainDomainOptions = Object.entries(PATENT_DOMAINS)
    .filter(([key]) => key !== 'heading')
    .map(([key, value]) => ({
      value: value.label,
      label: value.label,
    }));

  const selectedDomainKey = Object.entries(PATENT_DOMAINS).find(
    ([, value]) => value?.label === selectedDomain
  )?.[0];

  const subDomainOptions = selectedDomainKey
    ? Object.entries(PATENT_DOMAINS[selectedDomainKey]?.subDomains || {}).map(([key, label]) => ({
        value: label,
        label,
      }))
    : [];

  const previousDomainRef = useRef();

  const {
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = methods;

  useEffect(() => {
    if (!open) return;

    setTabValue(0);

    reset({
      ...initialValues,
      ...defaultValues,
      filingApplicationDate: defaultValues?.filingApplicationDate
        ? new Date(defaultValues.filingApplicationDate)
        : null,
    });

    clearErrors();

    setShowTabErrors(false);
  }, [open, defaultValues, reset, clearErrors]);

  useEffect(() => {
    if (previousDomainRef.current && previousDomainRef.current !== selectedDomain) {
      setValue('techSubDomain', '');
    }

    previousDomainRef.current = selectedDomain;
  }, [selectedDomain, setValue]);

  const getFirstErrorTab = (validationErrors) => {
    if (
      validationErrors.recordNumber ||
      // validationErrors.legalStatusCurrent ||
      validationErrors.filingApplicationDate ||
      validationErrors.mainTechnologyDomain ||
      validationErrors.techSubDomain
    ) {
      return 0;
    }

    if (validationErrors.assignee || validationErrors.inventors) {
      return 1;
    }

    if (validationErrors.abstract) {
      return 2;
    }

    if (validationErrors.claims) {
      return 3;
    }

    return 0;
  };

  const handleTabChange = async (event, newValue) => {
    await methods.trigger(); // revalidate all fields
    setTabValue(newValue);
  };

  const handleClose = () => {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }

    onClose();
  };

  const handleDiscard = () => {
    reset(defaultValues);

    setDiscardOpen(false);

    onClose();
  };

  const handleCancelDiscard = () => {
    setDiscardOpen(false);
  };

  const old_handleFormSubmit = handleSubmit(async (data) => {
    const payload = getDirtyValues(dirtyFields, data);

    await onSubmit?.(payload);

    reset(methods.getValues());

    onClose();
  });

  const handleFormSubmit = handleSubmit(
    async (data) => {
      try {
        const payload = getDirtyValues(dirtyFields, data);

        await onSubmit?.(payload);

        reset(methods.getValues());

        onClose();
      } catch (error) {
        console.error(error);
      }
    },

    (validationErrors) => {
      setShowTabErrors(true);

      const tab = getFirstErrorTab(validationErrors);

      setTabValue(tab);

      toast.error('Please complete all required fields before saving.', {
        duration: 6000,
      });
    }
  );

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <Form methods={methods} onSubmit={handleFormSubmit}>
          <DialogTitle>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* <Iconify icon="solar:info-circle-bold" width={24} sx={{ color: 'primary.main' }} /> */}
              <Typography variant="h6">Patent Information</Typography>
            </Stack>
          </DialogTitle>

          <DialogContent>
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Some required information is missing. Please complete all sections marked with a red
                indicator.
              </Alert>
            )}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3 }}
            >
              {PATENT_INFORMATION_TABS.map((tab, index) => (
                <Tab
                  key={tab.label}
                  icon={<Iconify icon={tab.icon} width={18} />}
                  iconPosition="start"
                  label={
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2">{tab.label}</Typography>

                      {((index === 0 &&
                        (errors.recordNumber ||
                          // errors.legalStatusCurrent ||
                          errors.filingApplicationDate ||
                          errors.mainTechnologyDomain ||
                          errors.techSubDomain)) ||
                        (index === 1 && (errors.assignee || errors.inventors)) ||
                        (index === 2 && errors.abstract) ||
                        (index === 3 && errors.claims)) && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: 'error.main',
                            borderRadius: '50%',
                          }}
                        />
                      )}
                    </Stack>
                  }
                />
              ))}
            </Tabs>

            {/* INFORMATION */}
            {tabValue === 0 && (
              <Stack spacing={3}>
                <Field.Text name="recordNumber" label="Patent / Application Number" />

                {/* <Field.Select name="legalStatusCurrent" label="Status">
                  <MenuItem value="Active - Granted">Active - Granted</MenuItem>

                  <MenuItem value="Active - Applied">Active - Applied</MenuItem>
                </Field.Select> */}

                <Field.DatePicker name="filingApplicationDate" label="Filing Date" disableFuture />

                <Field.Select name="mainTechnologyDomain" label="Main Technology Domain">
                  {mainDomainOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="techSubDomain" label="Technology Sub Domain">
                  {!selectedDomain && (
                    <MenuItem value="" disabled>
                      Select Main Technology Domain First
                    </MenuItem>
                  )}

                  {subDomainOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Stack>
            )}

            {/* ASSIGNEE & INVENTORS */}
            {tabValue === 1 && (
              <Stack spacing={3}>
                <Field.Text
                  name="assignee"
                  label="Assignee"
                  helperText="Organization, institution, or company owning the patent."
                  placeholder="Organization / Institution Name"
                />

                <Field.Text
                  name="inventors"
                  label="Inventors"
                  multiline
                  rows={5}
                  helperText="Separate inventor names using commas."
                  placeholder="Amit Kumar, Sneha Joshi"
                />
              </Stack>
            )}

            {/* ABSTRACT */}
            {tabValue === 2 && (
              <Field.Text
                name="abstract"
                label="Abstract"
                multiline
                rows={14}
                placeholder="Provide the patent abstract..."
              />
            )}

            {/* CLAIMS */}
            {tabValue === 3 && (
              <Field.Text
                name="claims"
                label="Claims"
                multiline
                rows={14}
                placeholder="Provide patent claims..."
              />
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>

            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save Information
            </LoadingButton>
          </DialogActions>
        </Form>
      </Dialog>

      <DiscardChangesDialog
        open={discardOpen}
        onCancel={handleCancelDiscard}
        onDiscard={handleDiscard}
      />
    </>
  );
}

export const getDirtyValues = (dirtyFields, values) =>
  Object.keys(dirtyFields).reduce((acc, key) => {
    acc[key] = values[key];
    return acc;
  }, {});
