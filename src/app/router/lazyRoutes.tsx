import { lazy } from 'react';

export const LoginPage = lazy(() =>
  import('~pages/login').then(module => ({ default: module.LoginPage }))
);

export const DashboardPage = lazy(() =>
  import('~pages/dashboard').then(module => ({ default: module.DashboardPage }))
);

export const ScoutProgressPage = lazy(() =>
  import('~pages/scout-progress').then(module => ({ default: module.ScoutProgressPage }))
);

export const JoinPage = lazy(() =>
  import('~pages/join').then(module => ({ default: module.JoinPage }))
);

export const LiaisonDashboardPage = lazy(() =>
  import('~pages/liaison-dashboard').then(module => ({ default: module.LiaisonDashboardPage }))
);

export const ForemanDetailPage = lazy(() =>
  import('~pages/foreman-detail').then(module => ({ default: module.ForemanDetailPage }))
);

export const AdminDashboardPage = lazy(() =>
  import('~pages/admin-dashboard').then(module => ({ default: module.AdminDashboardPage }))
);

export const LiaisonDetailPage = lazy(() =>
  import('~pages/liaison-detail').then(module => ({ default: module.LiaisonDetailPage }))
);

export const NotFoundPage = lazy(() =>
  import('~pages/not-found').then(module => ({ default: module.NotFoundPage }))
);

export const UnauthorizedPage = lazy(() =>
  import('~pages/unauthorized').then(module => ({ default: module.UnauthorizedPage }))
);

export const MyProgressPage = lazy(() =>
  import('~pages/my-progress').then(module => ({ default: module.MyProgressPage }))
);

export const MyGroupsPage = lazy(() =>
  import('~pages/my-groups').then(module => ({ default: module.MyGroupsPage }))
);

export const MyKurinPage = lazy(() =>
  import('~pages/my-kurin').then(module => ({ default: module.MyKurinPage }))
);

export const KurinDetailsPage = lazy(() =>
  import('~pages/admin/kurins').then(module => ({ default: module.KurinDetailsPage }))
);

export const ForemanDetailsPage = lazy(() =>
  import('~pages/admin/foremen').then(module => ({ default: module.ForemanDetailsPage }))
);

export const GroupDetailsPage = lazy(() =>
  import('~pages/admin/groups').then(module => ({ default: module.GroupDetailsPage }))
);

export const AdminScoutProgressPage = lazy(() =>
  import('~pages/admin/scouts').then(module => ({ default: module.ScoutProgressPage }))
);
