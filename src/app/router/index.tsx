import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '~shared/ui';
import { UserRole } from '~entities/user/model/types';
import { RootState } from '~app/store';
import * as Pages from './lazyRoutes';

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    {children}
  </Suspense>
);

const RoleBasedRedirect = () => {
  const { user } = useSelector((state: RootState) => state.session);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case UserRole.SCOUT:
      return <Navigate to="/my-progress" replace />;
    case UserRole.FOREMAN:
      return <Navigate to="/my-groups" replace />;
    case UserRole.LIAISON:
      return <Navigate to="/my-groups" replace />;
    case UserRole.ADMIN:
      return <Navigate to="/admin-dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <Pages.LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/join/:inviteToken',
    element: (
      <SuspenseWrapper>
        <Pages.JoinPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <SuspenseWrapper>
        <Pages.UnauthorizedPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RoleBasedRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-progress',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.SCOUT, UserRole.FOREMAN]}>
        <SuspenseWrapper>
          <Pages.MyProgressPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-groups',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.FOREMAN, UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.MyGroupsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-kurin',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.MyKurinPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <RoleBasedRedirect />
      </ProtectedRoute>
    ),
  },
  {
    path: '/scout/:scoutId/progress',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.FOREMAN, UserRole.LIAISON, UserRole.ADMIN]}>
        <SuspenseWrapper>
          <Pages.ScoutProgressPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/liaison-dashboard',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.LIAISON]}>
        <Navigate to="/my-kurin" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: '/foreman/:foremanId',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.LIAISON, UserRole.ADMIN]}>
        <SuspenseWrapper>
          <Pages.ForemanDetailPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin-dashboard',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <SuspenseWrapper>
          <Pages.AdminDashboardPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/liaison/:liaisonId',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <SuspenseWrapper>
          <Pages.LiaisonDetailPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/kurins/:kurinId',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <SuspenseWrapper>
          <Pages.KurinDetailsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/kurins/:kurinId/foremen/:foremanId',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.ForemanDetailsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/kurins/:kurinId/foremen/:foremanId/groups/:groupId',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.GroupDetailsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/kurins/:kurinId/foremen/:foremanId/groups/:groupId/scouts/:scoutId/progress',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.AdminScoutProgressPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/liaison/kurins/:kurinId',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.KurinDetailsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/liaison/kurins/:kurinId/foremen/:foremanId',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.ForemanDetailsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/liaison/kurins/:kurinId/foremen/:foremanId/groups/:groupId',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.GroupDetailsPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '/liaison/kurins/:kurinId/foremen/:foremanId/groups/:groupId/scouts/:scoutId/progress',
    element: (
      <ProtectedRoute allowedRoles={[UserRole.LIAISON]}>
        <SuspenseWrapper>
          <Pages.AdminScoutProgressPage />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <Pages.NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);
