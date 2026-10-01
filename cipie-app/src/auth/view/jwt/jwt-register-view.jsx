import * as z from 'zod';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Link,
  Alert,
  Button,
  Checkbox,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
  FormControlLabel,
  Stack,
} from '@mui/material';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
// import { ConfirmDialog } from 'src/components/custom-dialog';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { NdaDialog } from './nda-dialog';
import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';
import { TermsConditionDialog } from './terms-condition-dialog';
// import { getErrorMessage } from '../../utils';
import { setFormServerErrors } from './form-server-error-helper';
import { register, registrationData, getCaptcha } from '../../context/jwt';

const cleanTextRegex = /^[a-zA-Z\s.,!?'"()\-_:;/&]+$/;

const cleanNumberTextRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()\-_:;/&]+$/;
// const cleanNumberTextRegex = /^(?=.\*[a-zA-Z])[a-zA-Z0-9\s.,!?'"()-\_:;/&]+$/;
const cleanTextMessage = 'Invalid characters. Please enter valid characters';
const nameRegex = /^[a-zA-Z][a-zA-Z\s.'-]*$/;

const optionalCleanText = (max = 100) =>
  z
    .string()
    .optional()
    .transform((val) => (val ?? '').trim()) // ✅ normalize first
    .refine((val) => val.length <= max, {
      message: `Cannot exceed ${max} characters`,
    })
    .refine((val) => !val || cleanNumberTextRegex.test(val), {
      message: cleanTextMessage,
    });

export const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: 'First name is required' })
      .max(100, 'First name cannot exceed 100 characters')
      .regex(nameRegex, {
        message: 'First name can contain alphabets, spaces, dots, hyphens and apostrophes only',
      }),
    lastName: z
      .string()
      .trim()
      .min(1, { message: 'Last name is required' })
      .max(100, 'Last name cannot exceed 100 characters')
      .regex(nameRegex, {
        message: 'Last name can contain alphabets, spaces, dots, hyphens and apostrophes only',
      }),
    email: schemaUtils.email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    userTypeCode: z.string().min(1, { message: 'User type is required' }),
    organizationId: z.string().optional(),
    newOrganizationName: optionalCleanText(100),
    domainCode: z.string().min(1, 'Domain is required'),
    captchaText: z.string().min(1, 'Captcha is required'),
    // terms: z.boolean().refine((val) => val === true, {
    //   message: 'You must accept the terms and conditions',
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password and confirm password must be the same',
  })
  // R&D → must pick existing org
  .refine((d) => d.userTypeCode !== 'R&D' || !!d.organizationId, {
    path: ['organizationId'],
    message: 'Organization is required for R&D users',
  })
  // Startup/MSME/Academia → must enter new org
  .refine(
    (d) => !['STARTUP', 'MSME', 'ACADEMIA'].includes(d.userTypeCode) || !!d.newOrganizationName,
    {
      path: ['newOrganizationName'],
      message: 'Organization name is required',
    }
  )
  .transform((data) => {
    const formattedData = { ...data };

    // If not R&D, remove organizationId
    if (formattedData.userTypeCode !== 'R&D') {
      delete formattedData.organizationId;
    }

    // If not a type that requires a NEW org, remove newOrganizationName
    if (!['STARTUP', 'MSME', 'ACADEMIA'].includes(formattedData.userTypeCode)) {
      delete formattedData.newOrganizationName;
    }

    return formattedData;
  });

// ----------------------------------------------------------------------

export function JwtRegisterView() {
  const router = useRouter();

  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();
  // const openTerms = useBoolean();
  const termsDialog = useBoolean();
  const ndaDialog = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [userTypes, setUserTypes] = useState([]);
  const [orgMap, setOrgMap] = useState({});
  const [domains, setDomains] = useState([]);
  const [captcha, setCaptcha] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userTypeCode: '',
    organizationId: '',
    newOrganizationName: '',
    domainCode: '',
    captchaText: '',
    // terms: false,
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    setError,
    formState: { isSubmitting },
  } = methods;

  const selectedUserType = watch('userTypeCode');
  const showExistingOrg = selectedUserType === 'R&D';

  const showNewOrg = ['STARTUP', 'MSME', 'ACADEMIA'].includes(selectedUserType);

  const organizations =
    selectedUserType && orgMap[selectedUserType] ? orgMap[selectedUserType] : [];

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

  // Fetch userTypes and orgs from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await registrationData();
        setUserTypes(data.userTypes || []);
        setOrgMap(data.organizations || {});
        setDomains(data.domains || []);
        // console.log(data)
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to load registration data');
      } finally {
        // setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Auto-switch organization type based on available orgs
  useEffect(() => {
    if (!selectedUserType) return;

    // Clear everything first
    setValue('organizationId', '');
    setValue('newOrganizationName', '');
  }, [selectedUserType, setValue, domains]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!captcha?.captchaId) {
        setErrorMessage('Captcha not loaded. Please refresh.');
        return;
      }

      if (!termsAccepted || !ndaAccepted) {
        setErrorMessage('Please accept the Terms and Conditions and NDA to continue.');
        return;
      }

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        userTypeCode: data.userTypeCode,
        domainCode: data.domainCode,
        captchaId: captcha.captchaId,
        captchaText: data.captchaText,
      };

      // 2. ONLY add organizationId if it's R&D
      if (data.userTypeCode === 'R&D' && data.organizationId) {
        payload.organizationId = data.organizationId;
      }

      // 3. ONLY add newOrganizationName if it's a type that requires it
      const needsNewOrg = ['STARTUP', 'MSME', 'ACADEMIA'].includes(data.userTypeCode);
      if (needsNewOrg && data.newOrganizationName) {
        payload.newOrganizationName = data.newOrganizationName;
      }

      // LOG THIS to verify the keys are gone before the API call
      const response = await register(payload);

      if (response.success) {
        toast.success(response?.message);
        // setMessage(response.message);
        // Wait 3 seconds (3000ms) before navigating
        setTimeout(() => {
          router.push(`/auth/jwt/verify?email=${encodeURIComponent(data.email)}`);
        }, 1000);
      }
    } catch (error) {
      // const hasFieldErrors = setFormServerErrors(error, setError);
      // if (!hasFieldErrors) {
      //   setErrorMessage(error?.message || 'Registration failed');
      // } else {
      //   setErrorMessage(null);
      // }

      console.error(error);
      setFormServerErrors(error, setError);
      toast.error(error?.message || 'Registration failed');
      setErrorMessage(null);

      loadCaptcha();
      setValue('captchaText', '');
    }
    // } catch (error) {
    //   if (Array.isArray(error.errors) && error.errors.length > 0) {
    //     setErrorMessage(error.errors); // array
    //   } else {
    //     setErrorMessage(error.message); // string
    //   }
    //   // console.error(error);
    //   // const feedbackMessage = getErrorMessage(error);
    //   // setErrorMessage(feedbackMessage);
    //   // calling function to load new captcha on login failure
    //   loadCaptcha();
    //   setValue('captchaText', '');
    // }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="firstName"
          label="First name"
          slotProps={{ inputLabel: { shrink: true } }}
          required
        />
        <Field.Text
          name="lastName"
          label="Last name"
          slotProps={{ inputLabel: { shrink: true } }}
          required
        />
      </Box>

      <Field.Text
        name="email"
        label="Email address"
        slotProps={{ inputLabel: { shrink: true } }}
        required
      />

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
        required
      />

      <Field.Text
        name="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword.value ? 'text' : 'password'}
        placeholder="Repeat your password"
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showConfirmPassword.onToggle} edge="end">
                  <Iconify
                    icon={showConfirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        required
      />

      {/* User Type Dropdown */}
      <Controller
        name="userTypeCode"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            select
            label="User Type"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
            required
          >
            {userTypes.map((type) => (
              <MenuItem key={type.code} value={type.code}>
                {type.displayName}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Box
        sx={{
          p: 1.25,
          borderRadius: 1.5,
          bgcolor: 'info.lighter',
          color: 'info.darker',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="solar:info-circle-bold" width={18} />

          <Typography variant="body2">
            <strong>For Logo Competition participants:</strong> Please select{' '}
            <strong>Any Natural User</strong> under the User Type dropdown.
          </Typography>
        </Stack>
      </Box>

      {showExistingOrg && (
        <Controller
          name="organizationId"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              label="Organization"
              fullWidth
              error={!!error}
              helperText={error?.message}
            >
              {/* Added a fallback check to prevent mapping undefined */}
              {(orgMap['R&D'] || []).map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      )}

      {/* New Organization Name */}
      {showNewOrg && (
        <Controller
          name="newOrganizationName"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Organization Name"
              fullWidth
              placeholder={`Enter ${selectedUserType} organization name`}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}

      <Controller
        name="domainCode"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            fullWidth
            label="Domain"
            margin="normal"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            required
          >
            {domains.map((domain) => (
              <MenuItem key={domain.code} value={domain.code}>
                {domain.displayName}
              </MenuItem>
            ))}
          </TextField>
        )}
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

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Stack flexDirection="column">
          <FormControlLabel
            // control={<Checkbox {...field} checked={field.value} />}
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                I have read and agree to the{' '}
                <Link
                  component="span"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    termsDialog.onTrue();
                  }}
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                  }}
                >
                  Terms and Conditions
                </Link>
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={ndaAccepted}
                onChange={(event) => setNdaAccepted(event.target.checked)}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                I have read and agree to the{' '}
                <Link
                  component="span"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    ndaDialog.onTrue();
                  }}
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                  }}
                >
                  Non-Disclosure Agreement
                </Link>
              </Typography>
            }
          />
        </Stack>
      </Box>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={isSubmitting || !termsAccepted || !ndaAccepted || !captcha?.captchaId}
        loadingIndicator="Create account..."
      >
        Create account
      </Button>

      {/* --- Terms and conditions dialog--- */}
      <TermsConditionDialog
        open={termsDialog.value}
        onClose={termsDialog.onFalse}
        onAgree={() => {
          setTermsAccepted(true);
          termsDialog.onFalse();
        }}
      />

      {/* --- Non disclosure agreement dialog--- */}
      <NdaDialog
        open={ndaDialog.value}
        onClose={ndaDialog.onFalse}
        onAgree={() => {
          setNdaAccepted(true);
          ndaDialog.onFalse();
        }}
      />
    </Box>
  );

  return (
    <>
      <FormHead
        title="Sign up to your account"
        description={
          <>
            {`Already have an account? `}
            {/* <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              Get started
            </Link> */}
            <Link
              component={RouterLink}
              to="/auth/jwt/sign-in"
              variant="subtitle2"
              sx={{
                display: 'block',
                textAlign: { xs: 'center', md: 'left' },
                // mt: 2,
              }}
            >
              Get started
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

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
      )}

      {!!message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}
