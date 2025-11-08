import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '~app/store';
import { UserRole } from '~entities/user/model/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export const RoleGuard = ({
  children,
  allowedRoles,
  fallbackPath = '/unauthorized'
}: RoleGuardProps) => {
  const { user } = useSelector((state: RootState) => state.session);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
