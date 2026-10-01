import { ROLES } from "./roles";

export const SERVICES = {
  S01: {
    name: "IPR Queries / Advisory",
    code: "USER_QUERY",
    allowed: [
      ROLES.ANY,
      ROLES.STARTUP,
      ROLES.MSME,
      ROLES.ACADEMIA,
      ROLES.RND,
    ],
  },
  S02: {
    name: "Prior Art Search",
    code: "PRIOR_ART",
    allowed: [
      ROLES.ANY,
      ROLES.STARTUP,
      ROLES.MSME,
      ROLES.ACADEMIA,
      ROLES.RND,
    ],
  },
  S03: {
    name: "Indian Patent Filing",
    code: "INDIAN_PATENT_FILING",
    allowed: [
      ROLES.ACADEMIA,
      ROLES.RND,
    ],
  },
  S04: {
    name: "International Patent Filing",
    code: "INTERNATIONAL_PATENT_FILING",
    allowed: [ROLES.STARTUP, ROLES.MSME, ROLES.ACADEMIA, ROLES.RND],
  },
  S05: {
    name: "Patent Landscape Report",
    code: "PATENT_LANDSCAPE",
    allowed: [ROLES.ACADEMIA, ROLES.RND],
  },
  S06: {
    name: "Trademark Services",
    code: "TRADEMARK",
    allowed: [ROLES.ACADEMIA, ROLES.RND],
  },
  S07: {
    name: "Copyright Services",
    code: "COPYRIGHT",
    allowed: [ROLES.ACADEMIA, ROLES.RND],
  },
  S08: {
    name: "Design Registration",
    code: "DESIGN_FILE",
    allowed: [ROLES.ACADEMIA, ROLES.RND],
  },
  S09: {
    name: "Industrial Circuits",
    code: "INDUSTRIAL_CIRCUITS",
    allowed: [ROLES.ACADEMIA, ROLES.RND],
  },
  S10: {
    name: "Semiconductor IP",
    code: "SEMI_IP",
    allowed: [ROLES.ACADEMIA, ROLES.RND],
  },
  S11: {
    name: "IP Marketplace",
    code: "IP_MARKET",
    allowed: [ROLES.STARTUP, ROLES.MSME, ROLES.ACADEMIA, ROLES.RND],
  },
  S12: {
    name: "IPR General Knowledge",
    code: "IP_GK",
    allowed: [
      ROLES.ANY,
      ROLES.STARTUP,
      ROLES.MSME,
      ROLES.ACADEMIA,
      ROLES.RND,
    ],
  },
  S13: {
    name: "IPR Awareness Programs",
    code: "IP_AWARENESS",
    allowed: [
      ROLES.ANY,
      ROLES.STARTUP,
      ROLES.MSME,
      ROLES.ACADEMIA,
      ROLES.RND,
    ],
  },
  S14: {
    name: "Patent Hosting",
    code: "PATENT_HOSTING",
    allowed: [
      ROLES.ANY,
      ROLES.STARTUP,
      ROLES.MSME,
      ROLES.ACADEMIA,
      ROLES.RND,
    ],
  },
  S15: {
    name: "Logo Challenge",
    code: "LOGO_CHALLENGE",
    allowed: [
      ROLES.ANY,
    ],
  },
  S16: {
    name: "Indian Industrial Design",
    code: "INDIAN_INDUSTRIAL_DESIGN",
    allowed: [ROLES.ACADEMIA, ROLES.RND, ROLES.STARTUP, ROLES.MSME],
  },
  ADMIN: {
    allowed: [
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN,
      ROLES.PATENT_ENGINEER,
      ROLES.ATTORNEY,
    ],
  },
};

export const hasAccess = (role, serviceKey) =>
  SERVICES[serviceKey]?.allowed.includes(role);