import { mutate } from "swr";

import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await axios.post(endpoints.auth.logout, {},
      { withCredentials: true }
    );

  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    setSession(null);
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
  }
};

/** **************************************
 * Login
 *************************************** */
export const login = async ({ email, password, captchaId, captchaText }) => {
  try {
    const params = { email, password, captchaId, captchaText };

    const res = await axios.post(endpoints.auth.login, params);

    const { success, message, data } = res.data

    const { accessToken } = data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/** **************************************
 * Register
 *************************************** */
export const registrationData = async () => {

  try {
    const res = await axios.get(endpoints.auth.registrationData);

    const { userTypes, organizations, domains } = res.data;

    if (!userTypes || !organizations) {
      throw new Error('Data not found in response');
    }
    return {
      userTypes,
      organizations,
      domains
    }
  } catch (error) {
    console.error('Error during registration data:', error);
    throw error;
  }
};

/** **************************************
 * Register
 *************************************** */
export const registerOld = async ({ firstName, lastName, email, password, confirmPassword, userTypeCode, organizationId, domainCode }) => {
  const params = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    userTypeCode,
    organizationId,
    domainCode
  };

  try {
    const res = await axios.post(endpoints.auth.register, params);

    const { success, message } = res.data;

    if (!message) {
      throw new Error('User not registered');
    }
    return {
      success,
      message
    }
  } catch (error) {
    console.error('Error during register:', error);
    throw error;
  }
};

export const register = async ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  userTypeCode,
  organizationId,
  newOrganizationName,
  domainCode,
  captchaId,
  captchaText
}) => {
  const params = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    userTypeCode,
    domainCode,
    captchaId,
    captchaText,
  };

  // For R&D users
  if (userTypeCode === 'R&D' && organizationId) {
    params.organizationId = organizationId;
  }

  // For STARTUP, MSME, ACADEMIA: send user input
  if (['STARTUP', 'MSME', 'ACADEMIA'].includes(userTypeCode) && newOrganizationName) {
    params.newOrganizationName = newOrganizationName;
  }

  // For ANYNATURALUSER: send default
  // if (userTypeCode === 'ANYNATURALUSER') {
  //   params.newOrganizationName = "N/A";
  // }

  // console.log("REGISTER REQUEST PAYLOAD:");
  // console.log(JSON.stringify(params, null, 2));

  try {
    const res = await axios.post(endpoints.auth.register, params, { withCredentials: true });
    // console.log("REGISTER SUCCESS:", res.data);
    return res.data;
  } catch (error) {
    // if (error.response) {
    //   console.log("SERVER STATUS:", error.response.status);
    //   console.log("SERVER DATA:", error.response.data);
    //   console.log("SERVER HEADERS:", error.response.headers);
    // } else if (error.request) {
    //   console.log("NO RESPONSE RECEIVED:", error.request);
    // } else {
    //   console.log("AXIOS SETUP ERROR:", error.message);
    // }
    // throw error;
    const message =
      error?.Message ||
      error?.message ||
      'Something went wrong';

    const errors = error?.Errors ||
      error?.errors || [];

    // Always throw a real Error, attaching errors array as property
    const err = new Error(message);
    err.errors = errors;
    throw err;
  }
};

/** **************************************
 * Verify User
 *************************************** */
export const verifyUser = async ({ email, otp }) => {
  const params = {
    email,
    otp
  };

  try {
    const res = await axios.post(endpoints.auth.verifyOtp, params);

    const { success, message } = res.data;

    if (!message) {
      throw new Error('User not verified');
    }
    return {
      success,
      message
    }

  } catch (error) {
    console.error('Error during verify otp:', error);
    throw error;
  }
};

/** **************************************
 * Forgot Password
 *************************************** */
export const forgotPassword = async ({ email, captchaId, captchaText }) => {
  try {
    const res = await axios.post(endpoints.auth.forgotPassword, {
      email,
      captchaId,
      captchaText,
    });

    // ✅ just return backend response directly
    return res.data;

  } catch (error) {
    console.error('Error during Forgot Password:', error);

    // ✅ DO NOT override error
    throw error;
  }
};

/** **************************************
 * Change Password
 *************************************** */
export const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  try {
    const res = await axios.post(endpoints.auth.changePassword, {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    const { success, message } = res.data;

    if (!message) {
      throw new Error('Something went wrong!');
    }

    return { success, message };

  } catch (error) {
    console.error('Change Password Error:', error);
    throw error;
  }
};

/** **************************************
 * Verify Otp
 *************************************** */
export const verifyOtp = async ({ email, otp }) => {
  const params = {
    email,
    otp
  };

  try {
    const res = await axios.post(endpoints.auth.verifyOtp, params);

    const { success, message } = res.data;

    if (!message) {
      throw new Error('User not verified');
    }

    return {
      success,
      message
    }

  } catch (error) {
    console.error('Error during verify otp:', error);
    throw error;
  }
};

/** **************************************
 * Resend Otp
 *************************************** */
export const resendOtpOld = async ({ email }) => {
  const params = {
    email
  };

  try {
    const res = await axios.post(endpoints.auth.resendOtp, params);

    const { success, message, errors } = res.data;

    if (!message) {
      throw new Error('User not verified');
    }

    return {
      success,
      message,
      errors
    }

  } catch (error) {
    console.error('Error during verify otp:', error);
    throw error;
  }
};

export const resendOtp = async (email) => {
  try {
    const res = await axios.post(
      endpoints.auth.resendOtp,   // 👈 define this
      { email },                  // 👈 body
      {
        withCredentials: true     // 👈 keep same as captcha (important if cookies/session used)
      }
    );

    const { message, Errors } = res.data;

    return {
      message,
      Errors
    };

  } catch (error) {
    console.error('Error resending OTP:', error);

    throw error?.response?.data || { message: 'Resend OTP failed' };
  }
};

/** **************************************
 * Reset Password
 *************************************** */
export const resetPassword = async ({
  email,
  otp,
  newPassword,
  confirmPassword,
}) => {
  const params = { email, otp, newPassword, confirmPassword };

  try {
    const res = await axios.post(endpoints.auth.resetPassword, params);

    const { Success, Message, Errors } = res.data;

    return {
      success: Success,
      message: Message || 'Something went wrong',
      errors: Errors || [],
    };
  } catch (error) {
    const message =
      error?.Message ||
      error?.message ||
      'Something went wrong';

    const errors = error?.Errors ||
      error?.errors || [];

    // Always throw a real Error, attaching errors array as property
    const err = new Error(message);
    err.errors = errors;
    throw err;
  }
};
/** **************************************
 * Get Profile
 *************************************** */
export const getMyProfile = async () => {
  try {
    const res = await axios.get(endpoints.auth.me);
    return res.data

  } catch (error) {
    console.error('Error during Get Profile:', error);
    throw error;
  }
};

export const resendOtpForgetPassword = async (email) => {
  try {
    const res = await axios.post(
      endpoints.auth.resendOtpForgetPassword,   // 👈 define this
      { email },                  // 👈 body
      {
        withCredentials: true     // 👈 keep same as captcha (important if cookies/session used)
      }
    );

    const { message, Errors } = res.data;

    return {
      message,
      Errors
    };

  } catch (error) {
    console.error('Error resending OTP:', error);

    throw error?.response?.data || { message: 'Resend OTP failed' };
  }
};

export const getCaptcha = async () => {
  try {
    const res = await axios.get(
      endpoints.auth.captcha,
      {
        withCredentials: true
      }
    );

    const { captchaId, image } = res.data;

    // console.log(res);

    return {
      captchaId,
      image
    };

  } catch (error) {
    console.error('Error fetching captcha:', error);
    throw error;
  }
};

export const getRefreshToken = async () => {
  try {
    // console.log("Calling refresh...");
    const res = await axios.post(endpoints.auth.refreshToken, {},
      {
        withCredentials: true
      }
    );
    const { data } = res.data
    // console.log("New token received:", res.data);

    const { accessToken } = data;
    setSession(accessToken);
    mutate(
      key => typeof key === "string",
      undefined,
      { revalidate: true }
    );

    return accessToken;

  } catch (error) {
    console.error('Error during refresh token:', error);
    throw error;
  }
}

/** **************************************
 * LDAP Login
 *************************************** */
// export const ldapLogin = async ({ email, password, captchaId, captchaText }) => {
//   try {
//     const params = {
//       email,
//       password,
//       captchaId,
//       captchaText
//     };

//     const res = await axios.post(endpoints.auth.ldapLogin, params);

//     const { success, message, data } = res.data;

//     if (!success) {
//       throw new Error(message);
//     }

//     // Existing LDAP user
//     if (!data.requiresProfileCompletion) {
//       if (!data.accessToken) {
//         throw new Error('Access token not found in response');
//       }

//       setSession(data.accessToken);
//     }

//     // Return data for both existing and first-time users
//     return data;
//   } catch (error) {
//     console.error('Error during LDAP login:', error);
//     throw error;
//   }
// };

/** **************************************
 * Complete LDAP Profile
 *************************************** */
// export const completeLdapProfile = async ({
//   onboardingToken,
//   domainCode,
// }) => {
//   try {
//     const params = {
//       OnboardingToken: onboardingToken, // Use the key expected by your API
//       domainCode,
//     };

//     const res = await axios.post(
//       endpoints.auth.completeLdapProfile,
//       params
//     );

//     const { success, message, data } = res.data;

//     if (!success) {
//       throw new Error(message);
//     }

//     if (!data.accessToken) {
//       throw new Error('Access token not found in response');
//     }

//     setSession(data.accessToken);

//     return data;
//   } catch (error) {
//     console.error('Error completing LDAP profile:', error);
//     throw error;
//   }
// };


