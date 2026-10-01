import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------
const isDev = import.meta.env.DEV;

const MAIN_BASE = import.meta.env.VITE_MAIN_SERVER_URL;

export const CONFIG = {
  appName: 'IP Catalyst',
  appVersion: packageJson.version,
  // mainServerUrl: import.meta.env.VITE_MAIN_SERVER_URL ?? '',
  event: isDev
    ? import.meta.env.VITE_EVENT_API
    : MAIN_BASE,

  blog: isDev
    ? import.meta.env.VITE_BLOG_API
    : MAIN_BASE,

  poolHosting: isDev
    ? import.meta.env.VITE_POOL_HOSTING_API
    : MAIN_BASE,

  challenge: {
    logo: isDev
      ? import.meta.env.VITE_CHALLENGE_ROUND_API
      : MAIN_BASE
  },

  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',

  // authServerUrl: isDev
  //   ? import.meta.env.VITE_AUTH_API
  //   : MAIN_BASE,

  // appServerUrl: isDev
  //   ? import.meta.env.VITE_APP_API
  //   : MAIN_BASE,

  // documentServerUrl: isDev
  //   ? import.meta.env.VITE_DOC_API
  //   : MAIN_BASE,

  /**
   * Auth
   * @method jwt 
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
};
