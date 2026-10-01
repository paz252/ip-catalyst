import axios from 'axios';

import { CONFIG } from 'src/global-config';

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const responseData = error?.response?.data;

    const message =
      error?.response?.data?.Message ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong!';
    const errors = responseData?.Errors || null;
    if (error?.response?.status === 401) {
      // Handle Unauthorized access (token expired or invalid)
      console.error('Unauthorized access - Token may be expired');
      // Optionally, redirect the user to the login page
      // window.location.href = '/login';
    }
    console.error('Axios error:', message, errors);
    return Promise.reject({ message, errors, status });
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
// Check if we are in Development mode
// const isDev = import.meta.env.DEV;

// const AUTH_BASE = import.meta.env.VITE_AUTH_API;
// const APP_BASE = import.meta.env.VITE_APP_API;
// const DOC_BASE = import.meta.env.VITE_DOC_API;
// const MAIN_SERVER = import.meta.env.VITE_AUTH_API;
const MAIN_SERVER = CONFIG.mainServerUrl;

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    // me: '/api/auth/me',
    me: `${MAIN_SERVER}/api/auth/me`,
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    login: `${MAIN_SERVER}/api/auth/login`,
    register: `${MAIN_SERVER}/api/auth/register`,
    registrationData: `${MAIN_SERVER}/api/auth/registration-data`,
    verifyOtp: `${MAIN_SERVER}/api/auth/verify-otp`,
    forgotPassword: `${MAIN_SERVER}/api/auth/forgot-password`,
    resetPassword: `${MAIN_SERVER}/api/auth/forgot-password/reset`,
    changePassword: `${MAIN_SERVER}/api/auth/change-password`,
    captcha: `${MAIN_SERVER}/api/auth/captcha`,
    resendOtp: `${MAIN_SERVER}/api/auth/resend-otp`,
    resendOtpForgetPasswword: `${MAIN_SERVER}/api/auth/resend-forgot-password-otp`,
    refreshToken: `${MAIN_SERVER}/api/auth/refresh-token`,
    logout: `${MAIN_SERVER}/api/auth/logout`,
    ldapLogin: `${MAIN_SERVER}/api/auth/ldap-login`,
    completeLdapProfile: `${MAIN_SERVER}/api/auth/complete-ldap-profile`,
  },
  admin: {
    list: `${MAIN_SERVER}/api/admin/applications/submitted-applications`,
    details: (id) => `${MAIN_SERVER}/api/admin/applications/${id}`,
    summary: `${MAIN_SERVER}/api/admin/applications/dashboard/summary`,
    approve: (id) => `${MAIN_SERVER}/api/admin/applications/${id}/approve`,
    reject: (id) => `${MAIN_SERVER}/api/admin/applications/${id}/reject`,
    replyToQuery: (id) => `${MAIN_SERVER}/api/admin/applications/${id}/replyToQuery`,

    ipHosting: {
      allUserPatents: '/api/pool/patent-hosting/admin/all',
      details: (id) => `/api/pool/patent-hosting/${id}`,
      review: (id) => `/api/pool/patent-hosting/${id}/review`,
      activityLogs: (id) => `/api/pool/patent-hosting/${id}/activity-log`
    }
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  resource: {
    list: '/blogs',
    details: (id) => `/blogs/${id}`,
    // search: '/api/product/search',
  },
  priorArtSearch: {
    root: `${MAIN_SERVER}/api/prior-art`,
    my: `${MAIN_SERVER}/api/prior-art/my`,
    list: `${MAIN_SERVER}/api/prior-art/all`,
    details: (id) => `${MAIN_SERVER}/api/prior-art/${id}`,
    create: `${MAIN_SERVER}/api/prior-art`,
  },
  indianPatentfiling: {
    root: `${MAIN_SERVER}/api/indianPatentfiling`,
    my: `${MAIN_SERVER}/api/indianPatentfiling/my`,
    list: `${MAIN_SERVER}/api/indianPatentfiling/all`,
    details: (id) => `${MAIN_SERVER}/api/indianPatentfiling/${id}`,
    create: `${MAIN_SERVER}/api/indianPatentfiling`,
  },
  internationalPatentfiling: {
    root: `${MAIN_SERVER}/api/internationalPatentfiling`,
    my: `${MAIN_SERVER}/api/internationalPatentfiling/my`,
    list: `${MAIN_SERVER}/api/internationalPatentfiling/all`,
    details: (id) => `${MAIN_SERVER}/api/internationalPatentfiling/${id}`,
    create: `${MAIN_SERVER}/api/internationalPatentfiling`,
  },
  copyright: {
    root: `${MAIN_SERVER}/api/copyright`,
    my: `${MAIN_SERVER}/api/copyright/my`,
    list: `${MAIN_SERVER}/api/copyright/all`,
    details: (id) => `${MAIN_SERVER}/api/copyright/${id}`,
    create: `${MAIN_SERVER}/api/copyright`,
  },
  trademark: {
    root: `${MAIN_SERVER}/api/trademark`,
    my: `${MAIN_SERVER}/api/trademark/my`,
    list: `${MAIN_SERVER}/api/trademark/all`,
    details: (id) => `${MAIN_SERVER}/api/trademark/${id}`,
    create: `${MAIN_SERVER}/api/trademark`,
  },
  userQuery: {
    root: `${MAIN_SERVER}/api/user-query`,
    my: `${MAIN_SERVER}/api/user-query/my-queries`,
    list: `${MAIN_SERVER}/api/user-query/all`,
    details: (id) => `${MAIN_SERVER}/api/user-query/${id}`,
    create: `${MAIN_SERVER}/api/user-query`,
  },
  document: {
    root: `${MAIN_SERVER}/api/documents`,
    download: (id) => `${MAIN_SERVER}/api/documents/download-by-application/${id}`
  },
  event: {
    list: '/api/events',
    details: (id) => `/api/events/event-pages/${id}`,
    register: '/api/events/register'
  },
  patent: {
    byDomain: '/api/pool/by-domain',
    domainWisePatentCount: '/api/pool/domain-wise-count',
    allPatents: '/api/pool/all',
    details: (id) => `/api/pool/${id}`,
  },
  patentHosting: {
    getAll: '/api/pool/patent-hosting/all',
    createUserId: '/api/pool/patent-hosting/init',
    details: (id) => `/api/pool/patent-hosting/${id}`,
    header: (id) => `/api/pool/patent-hosting/${id}/header`,
    patentInformation: (id) =>
      `/api/pool/patent-hosting/${id}/patent-information`,
    media: (id) =>
      `/api/pool/patent-hosting/${id}/media`,
    document: (id) =>
      `/api/pool/patent-hosting/${id}/document`,
    submitForApproval: (id) => `/api/pool/patent-hosting/${id}/submit`
  },
  contact: {
    submit: '/api/contact',
  },
  patentsForCommercialization: {
    list: '/pool-api/api/pool'
  }
};
