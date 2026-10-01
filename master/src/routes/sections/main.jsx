import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';
// import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';

import { paths } from '../paths';

// ----------------------------------------------------------------------

// const ServicesPage = lazy(() => import('src/pages/services'));
const ResourcesListPage = lazy(() => import('src/pages/resources/list'));
const ResourceDetailPage = lazy(() => import('src/pages/resources/details'));
// const EventsPage = lazy(() => import('src/pages/events/list'));
const AboutPage = lazy(() => import('src/pages/about-us'));
const ContactPage = lazy(() => import('src/pages/contact-us'));
// const FaqsPage = lazy(() => import('src/pages/faqs'));
const WallOfFamePage = lazy(() => import('src/pages/wall-of-fame'));
// const PricingPage = lazy(() => import('src/pages/pricing'));
// const PaymentPage = lazy(() => import('src/pages/payment'));
// const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
// const MaintenancePage = lazy(() => import('src/pages/maintenance'));
const CatalystPage = lazy(() => import('src/pages/catalyst'));
const TCorePage = lazy(() => import('src/pages/tcore'));

//News
const NewsListPage = lazy(() => import('src/pages/news/news-list'));
const NewsDetailsPage = lazy(() => import('src/pages/news/news-details'));

// Challenge
const LogoCompetition = lazy(() => import('src/pages/challenge/logo-competition'));

// Innovation and Application
const PatentHome = lazy(() => import('src/pages/innovation-application/home'));
// const AllPatentsPage = lazy(() => import('src/pages/innovation-application/all-patents-list'));
const PatentListPage = lazy(() => import('src/pages/innovation-application/list'));
const PatentDetailsPage = lazy(() => import('src/pages/innovation-application/details'));

// Technologies
const TechnologiesPdfPage = lazy(() => import('src/pages/technologies/technologies-pdf-page.jsx'));

// Services
const StartupPage = lazy(() => import('src/pages/services/ipfs-services/startup'));
const MeityPage = lazy(() => import('src/pages/services/ipfs-services/meity'));

// Patent Hosting
const PatentHostingView = lazy(() => import('src/pages/patentHosting/landing'));

const DomesticPage = lazy(() => import('src/pages/services/ip-facilitation-services/domestic'));
// const TrademarkPage = lazy(() => import('src/pages/services/ip-facilitation-services/trademark'));
// const IndustrialPage = lazy(() => import('src/pages/services/ip-facilitation-services/trademark'));
// const CopyrightPage = lazy(() => import('src/pages/services/ip-facilitation-services/copyright'));
// const SicldPage = lazy(() => import('src/pages/services/ip-facilitation-services/sicld'));

// const Service1Page = lazy(() => import('src/pages/services/talent-training/service1'));
// const Service2Page = lazy(() => import('src/pages/services/talent-training/service2'));

// Product
// const ProductListPage = lazy(() => import('src/pages/product/list'));
// const ProductDetailsPage = lazy(() => import('src/pages/product/details'));
// const ProductCheckoutPage = lazy(() => import('src/pages/product/checkout'));
// // Blog
// const PostListPage = lazy(() => import('src/pages/post/list'));
// const PostDetailsPage = lazy(() => import('src/pages/post/details'));
// //events
const EventListPage = lazy(() => import('src/pages/events/list'));
const EventDetailsPage = lazy(() => import('src/pages/events/details'));
// Error
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));
// Blank
// const BlankPage = lazy(() => import('src/pages/blank'));
// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          // { path: 'events', element: <EventsPage /> },
          { path: 'about-us', element: <AboutPage /> },
          { path: 'contact-us', element: <ContactPage /> },
          // { path: 'faqs', element: <FaqsPage /> },
          // { path: 'blank', element: <BlankPage /> },
          { path: 'catalyst', element: <CatalystPage /> },
          { path: 'tcore', element: <TCorePage /> },
          { path: 'wall-of-fame', element: <WallOfFamePage /> },
          { path: paths.challenge.logo, element: <LogoCompetition /> },
          {
            title: 'innovation',
            path: 'innovation',
            children: [
              { index: true, element: <PatentHome /> },
              // { path: 'all/patents', element: <AllPatentsPage /> },
              { path: ':domain', element: <PatentHome /> },
              { path: ':domain/:category', element: <PatentListPage /> },
              // { path: ':domain/:category/:title', element: <PatentDetailsPage /> },
              { path: ':domain/:category/:id', element: <PatentDetailsPage /> },
              // { path: ':domain/:category/news/:slug', element: <NewsDetailsPage /> },
            ],
          },
          {
            title: 'technologies',
            path: 'technologies',
            children: [
              { path: ':domain', element: <TechnologiesPdfPage /> },
              {
                path: ':domain/:slug',
                element: <TechnologiesPdfPage />,
              },
            ],
          },
          {
            title: 'Services',
            path: 'services',
            children: [
              {
                title: 'IPFS Services',
                path: 'ipfs-services',
                children: [
                  { path: 'startup-msme', element: <StartupPage /> },
                  { path: 'meity_societies-rnd-autonomous_bodies', element: <MeityPage /> },
                ],
              },
              {
                title: 'IP Facilitation Services',
                path: 'ip-facilitation-services',
                children: [
                  { path: 'domestic-patent-filing-maintaining', element: <DomesticPage /> },
                ],
              },
            ],
          },
          {
            title: 'Patent Hosting',
            path: 'patent-hosting',
            children: [{ index: true, element: <PatentHostingView /> }],
          },
          {
            path: 'resources',
            children: [
              { index: true, element: <ResourcesListPage /> },
              { path: 'list', element: <ResourcesListPage /> },
              { path: ':id', element: <ResourceDetailPage /> },
            ],
          },
          {
            path: 'events',
            children: [
              { index: true, element: <EventListPage /> },
              { path: 'list', element: <EventListPage /> },
              { path: ':id', element: <EventDetailsPage /> },
            ],
          },
          {
            title: 'News',
            path: 'news',
            children: [
              { index: true, element: <NewsListPage /> },
              { path: 'list', element: <NewsListPage /> },
              { path: ':slug', element: <NewsDetailsPage /> },
            ],
          },
          // {
          //   path: 'product',
          //   children: [
          //     { index: true, element: <ProductListPage /> },
          //     { path: 'list', element: <ProductListPage /> },
          //     { path: ':id', element: <ProductDetailsPage /> },
          //     { path: 'checkout', element: <ProductCheckoutPage /> },
          //   ],
          // },
          // {
          //   path: 'post',
          //   children: [
          //     { index: true, element: <PostListPage /> },
          //     { path: 'list', element: <PostListPage /> },
          //     { path: ':title', element: <PostDetailsPage /> },
          //   ],
          // },
        ],
      },
      // {
      //   path: 'pricing',
      //   element: (
      //     <SimpleLayout>
      //       <PricingPage />
      //     </SimpleLayout>
      //   ),
      // },
      // {
      //   path: 'payment',
      //   element: (
      //     <SimpleLayout>
      //       <PaymentPage />
      //     </SimpleLayout>
      //   ),
      // },
      // {
      //   path: 'coming-soon',
      //   element: (
      //     <SimpleLayout slotProps={{ content: { compact: true } }}>
      //       <ComingSoonPage />
      //     </SimpleLayout>
      //   ),
      // },
      // {
      //   path: 'maintenance',
      //   element: (
      //     <SimpleLayout slotProps={{ content: { compact: true } }}>
      //       <MaintenancePage />
      //     </SimpleLayout>
      //   ),
      // },
      {
        path: 'error',
        children: [
          { path: '500', element: <Page500 /> },
          { path: '404', element: <Page404 /> },
          { path: '403', element: <Page403 /> },
        ],
      },
    ],
  },
];
