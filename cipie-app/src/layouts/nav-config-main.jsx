import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { TECHNOLOGY_PDFS } from './simple/technologies';

// ----------------------------------------------------------------------

export const navData = [
  { title: 'Home', path: '/', icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" /> },
  {
    title: 'Innovation',
    // path: paths.innovationApplication.root,
    icon: <Iconify width={22} icon="solar:lightbulb-bold-duotone" />,
    children: [
      {
        subheader: 'Information & Communication Technology',
        path: paths.innovationApplication.domain('ict'),
        items: [
          {
            title: 'Computer Technology',
            path: paths.innovationApplication.category('ict', 'computer-technology'),
          },
          {
            title: 'Digital Communication',
            path: paths.innovationApplication.category('ict', 'digital-communication'),
          },
          {
            title: 'Telecommunications',
            path: paths.innovationApplication.category('ict', 'telecommunications'),
          },
          {
            title: 'Basic Communication Processes',
            path: paths.innovationApplication.category('ict', 'basic-communication-processes'),
          },
          {
            title: 'IT Methods for Management',
            path: paths.innovationApplication.category('ict', 'it-methods-for-management'),
          },
          {
            title: 'Audio-Visual Technology',
            path: paths.innovationApplication.category('ict', 'audio-visual-technology'),
          },
        ],
      },
      {
        subheader: 'Mechanical & Industrial Engineering',
        path: paths.innovationApplication.domain('mech'),
        items: [
          {
            title: 'Machine Tools',
            path: paths.innovationApplication.category('mech', 'machine-tools'),
          },
          {
            title: 'Engines, Pumps, Turbines',
            path: paths.innovationApplication.category('mech', 'engines-pumps-turbines'),
          },
          {
            title: 'Other Special Machines',
            path: paths.innovationApplication.category('mech', 'other-special-machines'),
          },
          { title: 'Control', path: paths.innovationApplication.category('mech', 'control') },
          {
            title: 'Textile and Paper Machines',
            path: paths.innovationApplication.category('mech', 'textile-paper-machines'),
          },
          {
            title: 'Mechanical Elements',
            path: paths.innovationApplication.category('mech', 'mechanical-elements'),
          },
          // {
          //   title: 'Thermal Processes and Apparatus',
          //   path: paths.innovationApplication.category('mech', 'thermal-processes-apparatus'),
          // },
          { title: 'Transport', path: paths.innovationApplication.category('mech', 'transport') },
        ],
      },
      {
        subheader: 'Materials, Chemical & Nano Sciences',
        path: paths.innovationApplication.domain('mat'),
        items: [
          {
            title: 'Materials, Metallurgy',
            path: paths.innovationApplication.category('mat', 'materials-metallurgy'),
          },
          {
            title: 'Macromolecular Chemistry, Polymers',
            path: paths.innovationApplication.category('mat', 'macromolecular-chemistry-polymers'),
          },
          {
            title: 'Surface Technology, Coating',
            path: paths.innovationApplication.category('mat', 'surface-technology-coating'),
          },
          {
            title: 'Chemical Engineering',
            path: paths.innovationApplication.category('mat', 'chemical-engineering'),
          },
          {
            title: 'Micro-Structural and Nano-Technology',
            path: paths.innovationApplication.category('mat', 'micro-structural-nano-technology'),
          },
          {
            title: 'Basic Materials Chemistry',
            path: paths.innovationApplication.category('mat', 'basic-materials-chemistry'),
          },
          {
            title: 'Environmental Technology',
            path: paths.innovationApplication.category('mat', 'environmental-technology'),
          },
        ],
      },
      {
        subheader: 'Medical & Life Sciences',
        path: paths.innovationApplication.domain('med'),
        items: [
          {
            title: 'Medical Technology',
            path: paths.innovationApplication.category('med', 'medical-technology'),
          },
          {
            title: 'Biotechnology',
            path: paths.innovationApplication.category('med', 'biotechnology'),
          },
          {
            title: 'Analysis of Biological Materials',
            path: paths.innovationApplication.category('med', 'analysis-of-biological-materials'),
          },
        ],
      },
      {
        subheader: 'Electrical & Electronics Engineering',
        path: paths.innovationApplication.domain('elec'),
        items: [
          {
            title: 'Electrical Machinery, Apparatus, Energy',
            path: paths.innovationApplication.category(
              'elec',
              'electrical-machinery-apparatus-energy'
            ),
          },
          {
            title: 'Semiconductors',
            path: paths.innovationApplication.category('elec', 'semiconductors'),
          },
        ],
      },
      {
        subheader: 'Measurement & Optical Technologies',
        path: paths.innovationApplication.domain('opt'),
        items: [
          {
            title: 'Measurement',
            path: paths.innovationApplication.category('opt', 'measurement'),
          },
          { title: 'Optics', path: paths.innovationApplication.category('opt', 'optics') },
        ],
      },
      {
        subheader: 'Other Technologies',
        path: paths.innovationApplication.domain('other'),
        items: [{ title: 'Other', path: paths.innovationApplication.category('other', 'none') }],
      },
      // {
      //   subheader: 'All Technologies',
      //   path: paths.innovationApplication.domain('all-technologies'), // optional
      //   items: [
      //     {
      //       title: 'All Patents',
      //       path: `${paths.innovationApplication.root}/all-patents`,
      //     },
      //   ],
      // },
      {
        subheader: 'All Technologies',
        path: paths.innovationApplication.domain('all-technologies'),
        items: [
          { title: 'All Patents', path: paths.innovationApplication.category('all', 'patents') },
        ],
      },
    ],
  },
  {
    title: 'Technologies',
    path: paths.technologies.root,
    icon: <Iconify width={22} icon="solar:cpu-bold" />,
    children: TECHNOLOGY_PDFS,
  },
  {
    title: 'Services',
    path: paths.services.root,
    icon: <Iconify width={22} icon="solar:services-bold-duotone" />,
    children: [
      {
        subheader: 'International Patent Filing Support (IPFS) Program',
        items: [
          { title: 'Startup / MSME', path: paths.services.ipfsServices.startup },
          {
            title: 'Meity Societies / R&D / Autonomous bodies',
            path: paths.services.ipfsServices.meity,
          },
        ],
      },
      {
        subheader: 'IP Facilitation Program',
        items: [
          {
            title: 'Meity Societies / R&D / Autonomous bodies (Domestic IP Filing Support)',
            path: paths.services.ipFacilitationServices.domestic,
          },
          // {
          //   title: 'Domestic Patent Filing & Maintaining',
          //   path: paths.services.ipFacilitationServices.domestic,
          // },
          // {
          //   title: 'Trademark Filing & Maintaining',
          //   path: paths.services.ipFacilitationServices.trademark,
          // },
          // {
          //   title: 'Industrial Design Filing & Maintaining',
          //   path: paths.services.ipFacilitationServices.industrial,
          // },
          // {
          //   title: 'Copyright Filing & Maintaining',
          //   path: paths.services.ipFacilitationServices.copyright,
          // },
          // { title: 'SICLD Filing', path: paths.services.ipFacilitationServices.sicld },
        ],
      },
      // {
      //   subheader: 'Talent Training',
      //   items: [
      //     { title: 'Service 1', path: paths.services.talentTraining.service1 },
      //     { title: 'Service 2', path: paths.services.talentTraining.service2 },
      //   ],
      // },
    ],
  },
  {
    title: 'Patent Hosting',
    path: paths.patentHosting.root,
    icon: <Iconify width={22} icon="solar:share-bold" />,
  },
  {
    title: 'Resources',
    path: paths.resources.root,
    icon: <Iconify width={22} icon="solar:resources-bold-duotone" />,
  },
  {
    title: 'Events',
    path: paths.events.root,
    icon: <Iconify width={22} icon="solar:events-bold-duotone" />,
  },
  {
    title: 'Wall of fame',
    path: paths.wallOfFame,
    icon: <Iconify width={22} icon="solar:wall-of-fame-bold-duotone" />,
  },
  {
    title: 'About us',
    path: paths.about,
    icon: <Iconify width={22} icon="solar:about-bold-duotone" />,
  },
  // {
  //   title: 'Contact us',
  //   path: paths.contact,
  //   icon: <Iconify width={22} icon="solar:contact-bold-duotone" />,
  // },
  // { title: 'FAQs', path: paths.faqs },
  // {
  //   title: 'Pages',
  //   path: '/pages',
  //   icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
  //   children: [
  //     {
  //       subheader: 'Other',
  //       items: [
  //         { title: 'About us', path: paths.about },
  //         { title: 'Contact us', path: paths.contact },
  //         { title: 'FAQs', path: paths.faqs },
  //         { title: 'Pricing', path: paths.pricing },
  //         { title: 'Payment', path: paths.payment },
  //         { title: 'Maintenance', path: paths.maintenance },
  //         { title: 'Coming soon', path: paths.comingSoon },
  //       ],
  //     },
  //     {
  //       subheader: 'Concepts',
  //       items: [
  //         { title: 'Shop', path: paths.product.root },
  //         { title: 'Product', path: paths.product.demo.details },
  //         { title: 'Checkout', path: paths.product.checkout },
  //         { title: 'Posts', path: paths.post.root },
  //         { title: 'Post', path: paths.post.demo.details },
  //       ],
  //     },
  //     {
  //       subheader: 'Auth Demo',
  //       items: [
  //         { title: 'Sign in', path: paths.authDemo.split.signIn },
  //         { title: 'Sign up', path: paths.authDemo.split.signUp },
  //         { title: 'Reset password', path: paths.authDemo.split.resetPassword },
  //         { title: 'Update password', path: paths.authDemo.split.updatePassword },
  //         { title: 'Verify', path: paths.authDemo.split.verify },
  //         { title: 'Sign in (centered)', path: paths.authDemo.centered.signIn },
  //         { title: 'Sign up (centered)', path: paths.authDemo.centered.signUp },
  //         { title: 'Reset password (centered)', path: paths.authDemo.centered.resetPassword },
  //         { title: 'Update password (centered)', path: paths.authDemo.centered.updatePassword },
  //         { title: 'Verify (centered)', path: paths.authDemo.centered.verify },
  //       ],
  //     },
  //     {
  //       subheader: 'Error',
  //       items: [
  //         { title: 'Page 403', path: paths.page403 },
  //         { title: 'Page 404', path: paths.page404 },
  //         { title: 'Page 500', path: paths.page500 },
  //       ],
  //     },
  //     { subheader: 'Dashboard', items: [{ title: 'Dashboard', path: CONFIG.auth.redirectPath }] },
  //   ],
  // },
  // {
  //   title: 'Components',
  //   path: paths.components,
  //   icon: <Iconify width={22} icon="solar:atom-bold-duotone" />,
  // },
  // {
  //   title: 'Docs',
  //   icon: <Iconify width={22} icon="solar:notebook-bold-duotone" />,
  //   path: paths.docs,
  // },
];
