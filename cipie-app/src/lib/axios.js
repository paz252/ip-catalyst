import axios from 'axios';

// import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  // baseURL: CONFIG.serverUrl,
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  // Include cookies in requests
  // withCredentials: true,
});

// ---------------------------------------------------------------------------------

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// -----------------------------------------------------------------------------------

/**
 * Optional: Add token (if using auth)
 *
 * 
 * *
*/
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error?.response?.status;
//     const url = error?.config?.url || "";
//     const responseData = error?.response?.data;

//     const message =
//       error?.response?.data?.Message ||
//       error?.response?.data?.message ||
//       error?.message ||
//       'Something went wrong!';
//     const errors = responseData?.Errors || null;
//     if (error?.response?.status === 401) {
//       // Handle Unauthorized access (token expired or invalid)
//       console.error('Unauthorized access - Token may be expired');
//       // Optionally, redirect the user to the login page
//       // window.location.href = '/login';
//     }
//     console.error('Axios error:', message, errors);
//     return Promise.reject({ message, errors, status });
//   }
// );

// changed on 25 aug for displaying prior art error messages
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    const responseData = error?.response?.data;

    const message =
      responseData?.Message ||
      responseData?.message ||
      responseData?.title ||
      error?.message ||
      'Something went wrong!';

    const errors =
      responseData?.errors ||
      responseData?.Errors ||
      null;

    if (status === 401) {
      console.error('Unauthorized access - Token may be expired');
      // window.location.href = '/login';
    }

    console.error('Axios error:', message, errors);

    return Promise.reject({
      message,
      errors,
      status,
    });
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
const MAIN_BASE = import.meta.env.VITE_MAIN_SERVER_URL;

// Check if we are in Development mode
const isDev = import.meta.env.DEV;

const AUTH_BASE = isDev
  ? import.meta.env.VITE_AUTH_API
  : MAIN_BASE;

const APP_BASE = isDev
  ? import.meta.env.VITE_APP_API
  : MAIN_BASE;

const DOC_BASE = isDev
  ? import.meta.env.VITE_DOC_API
  : MAIN_BASE;

const POOL_HOSTING_BASE = isDev
  ? import.meta.env.VITE_POOL_HOSTING_API
  : MAIN_BASE;

const CHALLENGE_ROUND_BASE = isDev ? import.meta.env.VITE_CHALLENGE_ROUND_API
  : MAIN_BASE;

const BLOG_BASE = isDev
  ? import.meta.env.VITE_BLOG_API
  : MAIN_BASE;

const EVENT_BASE = isDev
  ? import.meta.env.VITE_EVENT_API
  : MAIN_BASE;

export const endpoints = {
  auth: {
    me: `${AUTH_BASE}/api/auth/me`,
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    login: `${AUTH_BASE}/api/auth/login`,
    register: `${AUTH_BASE}/api/auth/register`,
    registrationData: `${AUTH_BASE}/api/auth/registration-data`,
    verifyOtp: `${AUTH_BASE}/api/auth/verify-otp`,
    forgotPassword: `${AUTH_BASE}/api/auth/forgot-password`,
    resetPassword: `${AUTH_BASE}/api/auth/forgot-password/reset`,
    changePassword: `${AUTH_BASE}/api/auth/change-password`,
    captcha: `${AUTH_BASE}/api/auth/captcha`,
    resendOtp: `${AUTH_BASE}/api/auth/resend-otp`,
    resendOtpForgetPassword: `${AUTH_BASE}/api/auth/resend-forgot-password-otp`,
    refreshToken: `${AUTH_BASE}/api/auth/refresh-token`,
    logout: `${AUTH_BASE}/api/auth/logout`,
    // ldapLogin: `${AUTH_BASE}/api/auth/ldap-login`,
    // completeLdapProfile: `${AUTH_BASE}/api/auth/complete-ldap-profile`,
  },
  admin: {
    list: `${APP_BASE}/api/admin/applications/submitted-applications`,
    details: (id) => `${APP_BASE}/api/admin/applications/${id}`,
    summary: `${APP_BASE}/api/admin/applications/dashboard/summary`,
    approve: (id) => `${APP_BASE}/api/admin/applications/${id}/approve`,
    reject: (id) => `${APP_BASE}/api/admin/applications/${id}/reject`,
    replyToQuery: (id) => `${APP_BASE}/api/admin/applications/${id}/replyToQuery`,
    ipHosting: {
      allUserPatents: `${POOL_HOSTING_BASE}/api/pool/patent-hosting/admin/all`,
      details: (id) => `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}`,
      review: (id) => `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}/review`,
      activityLogs: (id) => `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}/activity-log`
    },
    challenge: {
      logo: {
        getAll: `${CHALLENGE_ROUND_BASE}/api/challenge/admin/all`,
        updateStatus: `${CHALLENGE_ROUND_BASE}/api/challenge/admin/update-status`,
      }
    },
  },
  priorArtSearch: {
    root: `${APP_BASE}/api/prior-art`,
    my: `${APP_BASE}/api/prior-art/my`,
    list: `${APP_BASE}/api/prior-art/all`,
    details: (id) => `${APP_BASE}/api/prior-art/${id}`,
    create: `${APP_BASE}/api/prior-art`,
  },
  indianPatentfiling: {
    root: `${APP_BASE}/api/indianPatentfiling`,
    my: `${APP_BASE}/api/indianPatentfiling/my`,
    list: `${APP_BASE}/api/indianPatentfiling/all`,
    details: (id) => `${APP_BASE}/api/indianPatentfiling/${id}`,
    create: `${APP_BASE}/api/indianPatentfiling`,
  },
  internationalPatentfiling: {
    root: `${APP_BASE}/api/internationalPatentfiling`,
    my: `${APP_BASE}/api/internationalPatentfiling/my`,
    list: `${APP_BASE}/api/internationalPatentfiling/all`,
    details: (id) => `${APP_BASE}/api/internationalPatentfiling/${id}`,
    create: `${APP_BASE}/api/internationalPatentfiling`,
  },
  copyright: {
    root: `${APP_BASE}/api/copyright`,
    my: `${APP_BASE}/api/copyright/my`,
    list: `${APP_BASE}/api/copyright/all`,
    details: (id) => `${APP_BASE}/api/copyright/${id}`,
    create: `${APP_BASE}/api/copyright`,
  },
  trademark: {
    root: `${APP_BASE}/api/trademark`,
    my: `${APP_BASE}/api/trademark/my`,
    list: `${APP_BASE}/api/trademark/all`,
    details: (id) => `${APP_BASE}/api/trademark/${id}`,
    create: `${APP_BASE}/api/trademark`,
  },
  userQuery: {
    root: `${APP_BASE}/api/user-query`,
    my: `${APP_BASE}/api/user-query/my-queries`,
    list: `${APP_BASE}/api/user-query/all`,
    details: (id) => `${APP_BASE}/api/user-query/${id}`,
    create: `${APP_BASE}/api/user-query`,
  },
  document: {
    root: `${DOC_BASE}/api/documents`,
    download: (id) => `${DOC_BASE}/api/documents/download-by-application/${id}`
  },
  resource: {
    list: `${BLOG_BASE}/blogs`,
    details: (id) => `${BLOG_BASE}/blogs/${id}`,
    // search: `${BLOG_BASE}/api/product/search`
  },
  event: {
    list: `${EVENT_BASE}/api/events`,
    details: (id) => `${EVENT_BASE}/api/events/event-pages/${id}`,
    register: `${EVENT_BASE}/api/events/register`,
  },
  patent: {
    byDomain: `${POOL_HOSTING_BASE}/api/pool/by-domain`,
    domainWisePatentCount: `${POOL_HOSTING_BASE}/api/pool/domain-wise-count`,
    allPatents: `${POOL_HOSTING_BASE}/api/pool/all`,
    details: (id) => `${POOL_HOSTING_BASE}/api/pool/${id}`,
  },
  patentHosting: {
    getAll: `${POOL_HOSTING_BASE}/api/pool/patent-hosting/all`,
    createUserId: `${POOL_HOSTING_BASE}/api/pool/patent-hosting/init`,
    details: (id) => `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}`,
    header: (id) => `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}/header`,
    patentInformation: (id) =>
      `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}/patent-information`,
    media: (id) =>
      `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}/media`,
    document: (id) =>
      `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}/document`,
    submitForApproval: (id) => `${POOL_HOSTING_BASE}/api/pool/patent-hosting/${id}/submit`
  },
  challenge: {
    logo: {
      create: `${CHALLENGE_ROUND_BASE}/api/challenge`,
      getAll: `${CHALLENGE_ROUND_BASE}/api/challenge/all`,
      details: (id) => `${CHALLENGE_ROUND_BASE}/api/challenge/${id}`,
    }
  },
  contact: {
    submit: `${BLOG_BASE}/api/contact`,
  },

  // chat: '/api/chat',
  // kanban: '/api/kanban',
  // calendar: '/api/calendar',
  // product: {
  //   list: '/api/product/list',
  //   details: '/api/product/details',
  //   search: '/api/product/search',
  // },
  // mail: {
  //   list: '/api/mail/list',
  //   details: '/api/mail/details',
  //   labels: '/api/mail/labels',
  // },
  // post: {
  //   list: '/api/post/list',
  //   details: '/api/post/details',
  //   latest: '/api/post/latest',
  //   search: '/api/post/search',
  // },
};
