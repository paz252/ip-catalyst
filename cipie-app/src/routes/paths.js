import { kebabCase } from 'es-toolkit';

const ROOTS = {
  AUTH: '/auth',
  ADMIN: '/dashboard/admin',
  DASHBOARD: '/dashboard',
  INNOVATION: '/innovation',
  SERVICES: '/services',
  RESOURCES: '/resources',
  TECHNOLOGIES: '/technologies',
  CHALLENGE: '/challenge',
};

// ----------------------------------------------------------------------

export const paths = {
  about: '/about-us',
  contact: '/contact-us',
  wallOfFame: '/wall-of-fame',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  catalyst: '/catalyst',
  // challenge: {
  //   logo: `${ROOTS.CHALLENGE}/logo`,
  // },
  tcore: '/tcore',
  innovationApplication: {
    root: ROOTS.INNOVATION,
    domain: (domain) => `${ROOTS.INNOVATION}/${domain}`,
    category: (domain, category) => `${ROOTS.INNOVATION}/${domain}/${category}`,
    details: (domain, category, title) => `${ROOTS.INNOVATION}/${domain}/${category}/${kebabCase(title)}`,
    details1: (domain, category, id) => `${ROOTS.INNOVATION}/${domain}/${category}/${id}`,
  },
  technologies: {
    root: ROOTS.TECHNOLOGIES,
    domain: (domain) => `${ROOTS.TECHNOLOGIES}/${domain}`,
    details: (domain, slug) =>
      `${ROOTS.TECHNOLOGIES}/${domain}/${slug}.pdf`,
  },
  services: {
    root: ROOTS.SERVICES,
    ipfsServices: {
      startup: `${ROOTS.SERVICES}/ipfs-services/startup-msme`,
      meity: `${ROOTS.SERVICES}/ipfs-services/meity_societies-rnd-autonomous_bodies`,
    },
    ipFacilitationServices: {
      domestic: `${ROOTS.SERVICES}/ip-facilitation-services/domestic-patent-filing-maintaining`,
      // trademark: `${ROOTS.SERVICES}/ip-facilitation-services/trademark-filing-maintaining`,
      // industrial: `${ROOTS.SERVICES}/ip-facilitation-services/industrial-design-filing-maintaining`,
      // copyright: `${ROOTS.SERVICES}/ip-facilitation-services/copyright-filing-maintaining`,
      // sicld: `${ROOTS.SERVICES}/ip-facilitation-services/sicld-filing`,
    },
    // talentTraining: {
    //   service1: `${ROOTS.SERVICES}/talent-training/service1`,
    //   service2: `${ROOTS.SERVICES}/talent-training/service2`,
    // },
  },
  patentHosting: {
    root: `/patent-hosting`,
  },
  resources: {
    root: `/resources`,
    details: (id) => `/resources/${id}`,
  },
  events: {
    root: `/events`,
    details: (id) => `/event/${id}`,
  },

  auth: {

    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      verify: `${ROOTS.AUTH}/jwt/verify`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      resetPassword: `${ROOTS.AUTH}/jwt/forgot-password/reset`,
      verifyOtp: `${ROOTS.AUTH}/jwt/forgot-password/verify-otp`
    },

  },
  // ADMIN DASHBOARD
  admin: {
    dashboard: `${ROOTS.ADMIN}`,
    list: `${ROOTS.ADMIN}/applications`,
    details: (id) => `${ROOTS.ADMIN}/applications/${id}`,
    resources: {
      root: `${ROOTS.ADMIN}/resources`,
      new: `${ROOTS.ADMIN}/resources/new`,
      details: (id) => `/admin/resources/${id}`,
      edit: (id) => `/admin/resources/${id}`,
      delete: (id) => `/admin/resources/${id}`,
    },
    ipHosting: {
      root: `${ROOTS.ADMIN}/ip-hosting`,
      list: `${ROOTS.ADMIN}/ip-hosting`,
      details: (id) => `${ROOTS.ADMIN}/ip-hosting/${id}`,
    },
    challenge: {
      logo: {
        root: `${ROOTS.ADMIN}/challenge/logo`,
        list: `${ROOTS.ADMIN}/challenge/logo`,
        details: (id) => `${ROOTS.ADMIN}/challenge/logo/${id}`,
      }
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    admin: `${ROOTS.DASHBOARD}/admin`,
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      account: `${ROOTS.DASHBOARD}/user/account`,
    },
    priorArtSearch: {
      root: `${ROOTS.DASHBOARD}/priorArtSearch`,
      new: `${ROOTS.DASHBOARD}/priorArtSearch/new`,
      details: (id) => `${ROOTS.DASHBOARD}/priorArtSearch/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/priorArtSearch/${id}/edit`
    },
    trademark: {
      root: `${ROOTS.DASHBOARD}/trademark`,
      new: `${ROOTS.DASHBOARD}/trademark/new`,
      details: (id) => `${ROOTS.DASHBOARD}/trademark/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/trademark/${id}/edit`
    },
    indianPatentFiling: {
      root: `${ROOTS.DASHBOARD}/indianPatentFiling`,
      new: `${ROOTS.DASHBOARD}/indianPatentFiling/new`,
      details: (id) => `${ROOTS.DASHBOARD}/indianPatentFiling/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/indianPatentFiling/${id}/edit`
    },
    internationalPatentFiling: {
      root: `${ROOTS.DASHBOARD}/internationalPatentFiling`,
      new: `${ROOTS.DASHBOARD}/internationalPatentFiling/new`,
      details: (id) => `${ROOTS.DASHBOARD}/internationalPatentFiling/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/internationalPatentFiling/${id}/edit`
    },
    indianIndustrialDesign: {
      root: `${ROOTS.DASHBOARD}/indianIndustrialDesign`,
      new: `${ROOTS.DASHBOARD}/indianIndustrialDesign/new`,
      details: (id) => `${ROOTS.DASHBOARD}/indianIndustrialDesign/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/indianIndustrialDesign/${id}/edit`
    },
    copyright: {
      root: `${ROOTS.DASHBOARD}/copyright`,
      new: `${ROOTS.DASHBOARD}/copyright/new`,
      details: (id) => `${ROOTS.DASHBOARD}/copyright/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/copyright/${id}/edit`
    },
    userQuery: {
      root: `${ROOTS.DASHBOARD}/user-query`,
      new: `${ROOTS.DASHBOARD}/user-query/new`,
      details: (id) => `${ROOTS.DASHBOARD}/user-query/${id}`,
    },
    patentHosting: {
      root: `${ROOTS.DASHBOARD}/patent-hosting`,
      list: `${ROOTS.DASHBOARD}/patent-hosting/list`,
      new: `${ROOTS.DASHBOARD}/patent-hosting/new`,
      view: (id) => `${ROOTS.DASHBOARD}/patent-hosting/view/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/patent-hosting/${id}`,
    },
    challenge: {
      logo: {
        root: `${ROOTS.DASHBOARD}/challenge/logo`,
        new: `${ROOTS.DASHBOARD}/challenge/logo/new`,
        details: (id) => `${ROOTS.DASHBOARD}/challenge/logo/${id}`,
      }
    },
  },
};
