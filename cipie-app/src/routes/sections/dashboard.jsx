import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { LoadingProvider, GlobalLoadingBackdrop } from 'src/components/global-loading';

import { AccountLayout } from 'src/sections/account/account-layout';

import { useAuthContext } from 'src/auth/hooks';
import { hasAccess } from 'src/auth/permissions';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const AdminDashboardPage = lazy(() => import('src/admin/view/admin-dashboard'));
const ApplicationListPage = lazy(() => import('src/admin/view/application-list'));

const ApplicationDetailsPage = lazy(() => import('src/admin/view/details'));
// const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
// const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
// const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
// const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// const OverviewCoursePage = lazy(() => import('src/pages/dashboard/course'));
// Product
// const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
// const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
// const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
// const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// Order
// const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
// const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Invoice
// const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
// const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
// const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
// const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
//Forms
// const FormsPage = lazy(() => import('src/pages/dashboard/forms/test'));
// User
// const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
// const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
// const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
// const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
// const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Account
const AccountGeneralPage = lazy(() => import('src/pages/dashboard/user/account/general'));
// const AccountBillingPage = lazy(() => import('src/pages/dashboard/user/account/billing'));
// const AccountSocialsPage = lazy(() => import('src/pages/dashboard/user/account/socials'));
// const AccountNotificationsPage = lazy(
//   () => import('src/pages/dashboard/user/account/notifications')
// );
const AccountChangePasswordPage = lazy(
  () => import('src/pages/dashboard/user/account/change-password')
);
// Blog
// const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
// const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
// const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
// const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// // Job
// const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
// const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
// const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
// const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// // Tour
// const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
// const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
// const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
// const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// // File manager
// const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// // App
// const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
// const MailPage = lazy(() => import('src/pages/dashboard/mail'));
// const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
// const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// Blank page
// const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
// const SubpathsPage = lazy(() => import('src/pages/dashboard/subpaths'));
// const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

const PriorArtCreatePage = lazy(() => import('src/pages/dashboard/priorArtSearch/new'));
const PriorArtListPage = lazy(() => import('src/pages/dashboard/priorArtSearch/list'));
const PriorArtDetailsPage = lazy(() => import('src/pages/dashboard/priorArtSearch/details'));
const PriorArtEditPage = lazy(() => import('src/pages/dashboard/priorArtSearch/edit'));

const TrademarkCreatePage = lazy(() => import('src/pages/dashboard/trademark/new'));
const TrademarkListPage = lazy(() => import('src/pages/dashboard/trademark/list'));
const TrademarkDetailsPage = lazy(() => import('src/pages/dashboard/trademark/details'));
const TrademarkEditPage = lazy(() => import('src/pages/dashboard/trademark/edit'));

const CopyrightCreatePage = lazy(() => import('src/pages/dashboard/copyright/new'));
const CopyrightListPage = lazy(() => import('src/pages/dashboard/copyright/list'));
const CopyrightDetailsPage = lazy(() => import('src/pages/dashboard/copyright/details'));
const CopyrightEditPage = lazy(() => import('src/pages/dashboard/copyright/edit'));

const IndianPatentCreatePage = lazy(() => import('src/pages/dashboard/indianPatentFiling/new'));
const IndianPatentListPage = lazy(() => import('src/pages/dashboard/indianPatentFiling/list'));
const IndianPatentDetailsPage = lazy(
  () => import('src/pages/dashboard/indianPatentFiling/details')
);
// const IndianPatentEditPage = lazy(() => import('src/pages/dashboard/indianPatentFiling/edit'));

const InternationalPatentCreatePage = lazy(
  () => import('src/pages/dashboard/internationalPatentFiling/new')
);
const InternationalPatentListPage = lazy(
  () => import('src/pages/dashboard/internationalPatentFiling/list')
);
const InternationalPatentDetailsPage = lazy(
  () => import('src/pages/dashboard/internationalPatentFiling/details')
);

const UserQueryCreatePage = lazy(() => import('src/pages/dashboard/query/new'));
const UserQueryListPage = lazy(() => import('src/pages/dashboard/query/list'));
const UserQueryDetailsPage = lazy(() => import('src/pages/dashboard/query/details'));

// const PatentHostingView = lazy(() => import('src/pages/dashboard/patentHosting/landing'));
const PatentHostingNewView = lazy(() => import('src/pages/dashboard/patentHosting/new'));
const PatentHostingListView = lazy(() => import('src/pages/dashboard/patentHosting/list'));
const PatentHostingDetailsPage = lazy(() => import('src/pages/dashboard/patentHosting/details'));

// Logo competition
const LogoChallengeListPage = lazy(() => import('src/pages/dashboard/challenge/logo/list'));
const LogoChallengeCreatePage = lazy(() => import('src/pages/dashboard/challenge/logo/new'));
const LogoChallengeDetailsPage = lazy(() => import('src/pages/dashboard/challenge/logo/details'));

// ----------------------------------------------------------------------

const WithRole = ({ children, serviceKey }) => {
  const { user } = useAuthContext();

  return (
    <RoleBasedGuard currentRole={user?.role} serviceKey={serviceKey}>
      {children}
    </RoleBasedGuard>
  );
};

const withRole = (element, serviceKey) => <WithRole serviceKey={serviceKey}>{element}</WithRole>;

function DashboardHomeRoute() {
  const { user } = useAuthContext();
  if (user?.role === 'ADMIN') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <IndexPage />;
}

function UserRoute({ children }) {
  const { user } = useAuthContext();

  if (!user) return null;

  // Admin users should never access user dashboard
  // if (hasAccess(user.role, 'ADMIN')) {
  //   return <Navigate to="/dashboard/admin" replace />;
  // }

  return children;
}

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const DashboardLayoutWrapper = () => (
  <LoadingProvider>
    <GlobalLoadingBackdrop />
    <DashboardLayout>
      <SuspenseOutlet />
    </DashboardLayout>
  </LoadingProvider>
);

const accountLayout = () => (
  <AccountLayout>
    <SuspenseOutlet />
  </AccountLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? (
      <UserRoute>
        <DashboardLayoutWrapper />
      </UserRoute>
    ) : (
      <AuthGuard>
        <UserRoute>
          <DashboardLayoutWrapper />
        </UserRoute>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardHomeRoute /> },

      // { path: 'ecommerce', element: <OverviewEcommercePage /> },
      // { path: 'analytics', element: <OverviewAnalyticsPage /> },
      // { path: 'banking', element: <OverviewBankingPage /> },
      // { path: 'booking', element: <OverviewBookingPage /> },
      // { path: 'file', element: <OverviewFilePage /> },
      // { path: 'course', element: <OverviewCoursePage /> },
      // {
      //   path: 'forms',
      //   children: [
      //     { index: true, element: <FormsPage /> },
      //     { path: 'test', element: <FormsPage /> },
      //   ],
      // },
      {
        path: 'user',
        children: [
          // { index: true, element: <UserProfilePage /> },
          // { path: 'profile', element: <UserProfilePage /> },
          // { path: 'cards', element: <UserCardsPage /> },
          // { path: 'list', element: <UserListPage /> },
          // { path: 'new', element: <UserCreatePage /> },
          // { path: ':id/edit', element: <UserEditPage /> },
          {
            path: 'account',
            element: accountLayout(),
            children: [
              { index: true, element: <AccountGeneralPage /> },
              // { path: 'billing', element: <AccountBillingPage /> },
              // { path: 'notifications', element: <AccountNotificationsPage /> },
              // { path: 'socials', element: <AccountSocialsPage /> },
              { path: 'change-password', element: <AccountChangePasswordPage /> },
            ],
          },
        ],
      },
      {
        path: 'priorArtSearch',
        children: [
          { index: true, element: withRole(<PriorArtListPage />, 'S02') },
          { path: 'list', element: withRole(<PriorArtListPage />, 'S02') },
          { path: ':id', element: withRole(<PriorArtDetailsPage />, 'S02') },
          { path: 'new', element: withRole(<PriorArtCreatePage />, 'S02') },
          { path: ':id/edit', element: withRole(<PriorArtEditPage />, 'S02') },
        ],
      },
      {
        path: 'trademark',
        children: [
          {
            index: true,
            element: withRole(<TrademarkListPage />, 'S06'),
          },
          {
            path: 'list',
            element: withRole(<TrademarkListPage />, 'S06'),
          },
          {
            path: ':id',
            element: withRole(<TrademarkDetailsPage />, 'S06'),
          },
          {
            path: 'new',
            element: withRole(<TrademarkCreatePage />, 'S06'),
          },
          {
            path: ':id/edit',
            element: withRole(<TrademarkEditPage />, 'S06'),
          },
        ],
      },
      {
        path: 'copyright',
        children: [
          {
            index: true,
            element: withRole(<CopyrightListPage />, 'S06'),
          },
          {
            path: 'list',
            element: withRole(<CopyrightListPage />, 'S06'),
          },
          {
            path: ':id',
            element: withRole(<CopyrightDetailsPage />, 'S06'),
          },
          {
            path: 'new',
            element: withRole(<CopyrightCreatePage />, 'S06'),
          },
          {
            path: ':id/edit',
            element: withRole(<CopyrightEditPage />, 'S06'),
          },
        ],
      },
      {
        path: 'indianPatentFiling',
        children: [
          {
            index: true,
            element: withRole(<IndianPatentListPage />, 'S03'),
          },
          {
            path: 'list',
            element: withRole(<IndianPatentListPage />, 'S03'),
          },
          {
            path: ':id',
            element: withRole(<IndianPatentDetailsPage />, 'S03'),
          },
          {
            path: 'new',
            element: withRole(<IndianPatentCreatePage />, 'S03'),
          },
        ],
      },
      {
        path: 'internationalPatentFiling',
        children: [
          {
            index: true,
            element: withRole(<InternationalPatentListPage />, 'S04'),
          },
          {
            path: 'list',
            element: withRole(<InternationalPatentListPage />, 'S04'),
          },
          {
            path: ':id',
            element: withRole(<InternationalPatentDetailsPage />, 'S04'),
          },
          {
            path: 'new',
            element: withRole(<InternationalPatentCreatePage />, 'S04'),
          },
        ],
      },
      {
        path: 'user-query',
        children: [
          { index: true, element: withRole(<UserQueryListPage />, 'S01') },
          { path: 'list', element: withRole(<UserQueryListPage />, 'S01') },
          { path: ':id', element: withRole(<UserQueryDetailsPage />, 'S01') },
          { path: 'new', element: withRole(<UserQueryCreatePage />, 'S01') },
          // { path: ':id/edit', element: <TrademarkEditPage /> },
        ],
      },
      {
        path: 'patent-hosting',
        children: [
          {
            index: true,
            element: <PatentHostingListView />,
          },
          {
            path: 'list',
            element: <PatentHostingListView />,
          },
          {
            index: 'new',
            element: <PatentHostingNewView />,
          },
          {
            path: 'view/:id',
            element: <PatentHostingDetailsPage />,
          },
          {
            path: ':id',
            element: <PatentHostingNewView />,
          },
        ],
      },
      {
        path: 'challenge/logo',
        children: [
          {
            index: true,
            element: withRole(<LogoChallengeListPage />, 'S15'),
          },
          {
            path: 'list',
            element: withRole(<LogoChallengeListPage />, 'S15'),
          },
          {
            path: ':id',
            element: withRole(<LogoChallengeDetailsPage />, 'S15'),
          },
          {
            path: 'new',
            element: withRole(<LogoChallengeCreatePage />, 'S15'),
          },
        ],
      },
      // {
      //   path: 'product',
      //   children: [
      //     { index: true, element: <ProductListPage /> },
      //     { path: 'list', element: <ProductListPage /> },
      //     { path: ':id', element: <ProductDetailsPage /> },
      //     { path: 'new', element: <ProductCreatePage /> },
      //     { path: ':id/edit', element: <ProductEditPage /> },
      //   ],
      // },
      // {
      //   path: 'order',
      //   children: [
      //     { index: true, element: <OrderListPage /> },
      //     { path: 'list', element: <OrderListPage /> },
      //     { path: ':id', element: <OrderDetailsPage /> },
      //   ],
      // },
      // {
      //   path: 'invoice',
      //   children: [
      //     { index: true, element: <InvoiceListPage /> },
      //     { path: 'list', element: <InvoiceListPage /> },
      //     { path: ':id', element: <InvoiceDetailsPage /> },
      //     { path: ':id/edit', element: <InvoiceEditPage /> },
      //     { path: 'new', element: <InvoiceCreatePage /> },
      //   ],
      // },
      // {
      //   path: 'post',
      //   children: [
      //     { index: true, element: <BlogPostsPage /> },
      //     { path: 'list', element: <BlogPostsPage /> },
      //     { path: ':title', element: <BlogPostPage /> },
      //     { path: ':title/edit', element: <BlogEditPostPage /> },
      //     { path: 'new', element: <BlogNewPostPage /> },
      //   ],
      // },
      // {
      //   path: 'job',
      //   children: [
      //     { index: true, element: <JobListPage /> },
      //     { path: 'list', element: <JobListPage /> },
      //     { path: ':id', element: <JobDetailsPage /> },
      //     { path: 'new', element: <JobCreatePage /> },
      //     { path: ':id/edit', element: <JobEditPage /> },
      //   ],
      // },
      // {
      //   path: 'tour',
      //   children: [
      //     { index: true, element: <TourListPage /> },
      //     { path: 'list', element: <TourListPage /> },
      //     { path: ':id', element: <TourDetailsPage /> },
      //     { path: 'new', element: <TourCreatePage /> },
      //     { path: ':id/edit', element: <TourEditPage /> },
      //   ],
      // },
      // { path: 'file-manager', element: <FileManagerPage /> },
      // { path: 'mail', element: <MailPage /> },
      // { path: 'chat', element: <ChatPage /> },
      // { path: 'calendar', element: <CalendarPage /> },
      // { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      // { path: 'params', element: <ParamsPage /> },
      // { path: 'blank', element: <BlankPage /> },
      // {
      //   path: 'subpaths',
      //   children: [
      //     {
      //       index: true,
      //       element: <Navigate to="/dashboard/subpaths/sub-1/sub-2" />,
      //     },
      //     { path: 'sub-1/sub-2', element: <SubpathsPage /> },
      //   ],
      // },
    ],
  },
];
