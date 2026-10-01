import { kebabCase } from 'es-toolkit';

// import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

// const MOCK_ID = _id[1];
// const MOCK_TITLE = _postTitles[2];

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
  // comingSoon: '/coming-soon',
  // maintenance: '/maintenance',
  // pricing: '/pricing',

  about: '/about-us',
  contact: '/contact-us',
  // faqs: '/faqs',
  wallOfFame: '/wall-of-fame',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  catalyst: '/catalyst',
  challenge: {
    logo: `${ROOTS.CHALLENGE}/logo`,
  },
  tcore: '/tcore',
  // other
  // components: '/components',
  // docs: 'https://docs.minimals.cc/',
  // changelog: 'https://docs.minimals.cc/changelog/',
  // zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  // minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  // figmaUrl: 'https://www.figma.com/design/WadcoP3CSejUDj7YZc87xj/%5BPreview%5D-Minimal-Web.v7.3.0',
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
  // product: {
  //   root: `/product`,
  //   checkout: `/product/checkout`,
  //   details: (id) => `/product/${id}`,
  //   demo: { details: `/product/${MOCK_ID}` },
  // },
  // post: {
  //   root: `/post`,
  //   details: (title) => `/post/${kebabCase(title)}`,
  //   demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  // },
  // AUTH
  auth: {
    // amplify: {
    //   signIn: `${ROOTS.AUTH}/amplify/sign-in`,
    //   verify: `${ROOTS.AUTH}/amplify/verify`,
    //   signUp: `${ROOTS.AUTH}/amplify/sign-up`,
    //   updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
    //   resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    // },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      verify: `${ROOTS.AUTH}/jwt/verify`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      resetPassword: `${ROOTS.AUTH}/jwt/forgot-password/reset`,
      verifyOtp: `${ROOTS.AUTH}/jwt/forgot-password/verify-otp`
    },
    // firebase: {
    //   signIn: `${ROOTS.AUTH}/firebase/sign-in`,
    //   verify: `${ROOTS.AUTH}/firebase/verify`,
    //   signUp: `${ROOTS.AUTH}/firebase/sign-up`,
    //   resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    // },
    // auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
    // supabase: {
    //   signIn: `${ROOTS.AUTH}/supabase/sign-in`,
    //   verify: `${ROOTS.AUTH}/supabase/verify`,
    //   signUp: `${ROOTS.AUTH}/supabase/sign-up`,
    //   updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
    //   resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    // },
  },
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
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    admin: `${ROOTS.DASHBOARD}/admin`,
    // mail: `${ROOTS.DASHBOARD}/mail`,
    // chat: `${ROOTS.DASHBOARD}/chat`,
    // blank: `${ROOTS.DASHBOARD}/blank`,
    // kanban: `${ROOTS.DASHBOARD}/kanban`,
    // calendar: `${ROOTS.DASHBOARD}/calendar`,
    // fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    // permission: `${ROOTS.DASHBOARD}/permission`,
    // general: {
    //   app: `${ROOTS.DASHBOARD}/app`,
    //   ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
    //   analytics: `${ROOTS.DASHBOARD}/analytics`,
    //   banking: `${ROOTS.DASHBOARD}/banking`,
    //   booking: `${ROOTS.DASHBOARD}/booking`,
    //   file: `${ROOTS.DASHBOARD}/file`,
    //   course: `${ROOTS.DASHBOARD}/course`,
    // },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      // new: `${ROOTS.DASHBOARD}/user/new`,
      // list: `${ROOTS.DASHBOARD}/user/list`,
      // cards: `${ROOTS.DASHBOARD}/user/cards`,
      // profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      // edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      // demo: { edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit` },
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
    },
    indianPatentFiling: {
      root: `${ROOTS.DASHBOARD}/indianPatentFiling`,
      new: `${ROOTS.DASHBOARD}/indianPatentFiling/new`,
      details: (id) => `${ROOTS.DASHBOARD}/indianPatentFiling/${id}`,
    },
    internationalPatentFiling: {
      root: `${ROOTS.DASHBOARD}/internationalPatentFiling`,
      new: `${ROOTS.DASHBOARD}/internationalPatentFiling/new`,
      details: (id) => `${ROOTS.DASHBOARD}/internationalPatentFiling/${id}`,
    },
    copyright: {
      root: `${ROOTS.DASHBOARD}/copyright`,
      new: `${ROOTS.DASHBOARD}/copyright/new`,
      details: (id) => `${ROOTS.DASHBOARD}/copyright/${id}`,
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




    // product: {
    //   root: `${ROOTS.DASHBOARD}/product`,
    //   new: `${ROOTS.DASHBOARD}/product/new`,
    //   details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
    //   edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
    //   demo: {
    //     details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
    //     edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
    //   },
    // },
    // invoice: {
    //   root: `${ROOTS.DASHBOARD}/invoice`,
    //   new: `${ROOTS.DASHBOARD}/invoice/new`,
    //   details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
    //   edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
    //   demo: {
    //     details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
    //     edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
    //   },
    // },
    // post: {
    //   root: `${ROOTS.DASHBOARD}/post`,
    //   new: `${ROOTS.DASHBOARD}/post/new`,
    //   details: (title) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}`,
    //   edit: (title) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}/edit`,
    //   demo: {
    //     details: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}`,
    //     edit: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}/edit`,
    //   },
    // },
    // order: {
    //   root: `${ROOTS.DASHBOARD}/order`,
    //   details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
    //   demo: { details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}` },
    // },
    // job: {
    //   root: `${ROOTS.DASHBOARD}/job`,
    //   new: `${ROOTS.DASHBOARD}/job/new`,
    //   details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
    //   edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
    //   demo: {
    //     details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
    //     edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
    //   },
    // },
    // tour: {
    //   root: `${ROOTS.DASHBOARD}/tour`,
    //   new: `${ROOTS.DASHBOARD}/tour/new`,
    //   details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
    //   edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
    //   demo: {
    //     details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
    //     edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
    //   },
    // },
  },
};
