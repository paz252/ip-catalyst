import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { LoadingProvider, GlobalLoadingBackdrop } from 'src/components/global-loading';

import { useAuthContext } from 'src/auth/hooks';
import { hasAccess } from 'src/auth/permissions';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// ----------------------------------------------------------------------

// const DashboardHome = lazy(() => import('src/pages/dashboard'));

const AdminDashboardPage = lazy(() => import('src/admin/view/admin-dashboard'));

const ApplicationListPage = lazy(() => import('src/admin/view/application-list'));

const ApplicationDetailsPage = lazy(() => import('src/admin/view/details'));

// const ResourceListPage = lazy(
//   () => import('src/admin/view/resource/list')
// );

// const ResourceCreatePage = lazy(
//   () => import('src/admin/view/resource/new')
// );

// const ResourceEditPage = lazy(
//   () => import('src/admin/view/resource/edit')
// );

const IpHostingListPage = lazy(() => import('src/admin/view/ip-hosting/list'));

const IpHostingDetailsPage = lazy(() => import('src/admin/view/ip-hosting/details'));

const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));

// Logo challenge round

const LogoChallengeListPage = lazy(() => import('src/admin/view/challenge/logo/list'));

const LogoChallengeDetailsPage = lazy(() => import('src/admin/view/challenge/logo/details'));

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

// ----------------------------------------------------------------------
// Admin Guard
// ----------------------------------------------------------------------

function AdminRoute({ children }) {
  const { user } = useAuthContext();

  if (!user) return null;

  if (!hasAccess(user.role, 'ADMIN')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
// ----------------------------------------------------------------------
// Admin Dashboard Routes
// ----------------------------------------------------------------------

export const adminDashboardRoutes = [
  {
    path: 'dashboard/admin',
    element: CONFIG.auth.skip ? (
      <DashboardLayoutWrapper />
    ) : (
      <AuthGuard>
        <AdminRoute>
          <DashboardLayoutWrapper />
        </AdminRoute>
      </AuthGuard>
    ),

    children: [
      {
        index: true,
        element: withRole(<AdminDashboardPage />, 'ADMIN'),
      },
      {
        path: 'applications',
        children: [
          {
            index: true,
            element: withRole(<ApplicationListPage />, 'ADMIN'),
          },
          {
            path: ':id',
            element: withRole(<ApplicationDetailsPage />, 'ADMIN'),
          },
        ],
      },
      // {
      //   path: 'resources',
      //   children: [
      //     { index: true, element: withRole(<ResourceListPage />, "ADMIN")},
      //     { path: 'list', element: withRole(<ResourceListPage />, "ADMIN")},
      //     { path: ':id', element: withRole(<ResourceEditPage />, "ADMIN") },
      //     { path: 'new', element: withRole(<ResourceCreatePage />, "ADMIN") },
      //   ],
      // },
      {
        path: 'ip-hosting',
        children: [
          { index: true, element: withRole(<IpHostingListPage />, 'ADMIN') },
          { path: 'list', element: withRole(<IpHostingListPage />, 'ADMIN') },
          { path: ':id', element: withRole(<IpHostingDetailsPage />, 'ADMIN') },
        ],
      },
      {
        path: 'challenge/logo',
        children: [
          { index: true, element: withRole(<LogoChallengeListPage />, 'ADMIN') },
          { path: 'list', element: withRole(<LogoChallengeListPage />, 'ADMIN') },
          { path: ':id', element: withRole(<LogoChallengeDetailsPage />, 'ADMIN') },
        ],
      },
      {
        path: 'permission',
        element: <PermissionDeniedPage />,
      },
    ],
  },
];
