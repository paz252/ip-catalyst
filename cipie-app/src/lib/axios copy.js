import axios from 'axios';
// import { refreshToken } from 'src/auth/context/jwt';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  // baseURL: CONFIG.serverUrl,
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

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


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.response?.data?.Message || error?.message || 'Something went wrong!';
    if (error?.response?.status === 401) {
      // Handle Unauthorized access (token expired or invalid)
      console.error('Unauthorized access - Token may be expired');
      // Optionally, redirect the user to the login page
      // window.location.href = '/login';
    }

    console.error('Axios error:', message);
    return Promise.reject(new Error(message));
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

// If Dev: Use the proxy prefix (e.g., /auth-api)
// If Prod: Use the IP from .env (e.g., http://10.208.10.83)
// const AUTH_BASE = '/auth-api';
// const POOL_BASE = '/pool-api';
// const APP_BASE  = '/application-api';
// const DOC_BASE  = '/document-api';

const AUTH_BASE = import.meta.env.VITE_AUTH_API;
const POOL_BASE = import.meta.env.VITE_POOL_API;
const APP_BASE = import.meta.env.VITE_APP_API;
const DOC_BASE = import.meta.env.VITE_DOC_API;

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    // me: '/api/auth/me',
    me: `${AUTH_BASE}/Authentication/api/auth/me`,
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    login: `${AUTH_BASE}/Authentication/api/auth/login`,
    // refreshToken: `${AUTH_BASE}/Authentication/api/auth/refresh-token`,
    register: `${AUTH_BASE}/Authentication/api/auth/register`,
    registrationData: `${AUTH_BASE}/Authentication/api/auth/registration-data`,
    verifyOtp: `${AUTH_BASE}/Authentication/api/auth/verify-otp`,
    forgotPassword: `${AUTH_BASE}/Authentication/api/auth/forgot-password`,
    resetPassword: `${AUTH_BASE}/Authentication/api/auth/forgot-password/reset`,
    changePassword: `${AUTH_BASE}/Authentication/api/auth/change-password`,
    captcha: `${AUTH_BASE}/Authentication/api/auth/captcha`,

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
  event: {
    list: '/api/event/list',
    details: '/api/event/details',
  },
  patent: {
    byDomain: '/api/pool/by-domain',
    domainWisePatentCount: '/api/pool/domain-wise-count'
  },
    contact: {
    submit: '/api/contact',
  },
  patentsForCommercialization: {
    list: '/pool-api/api/pool'
  }
};
