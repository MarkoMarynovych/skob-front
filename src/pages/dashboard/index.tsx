import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { RootState } from '~app/store';
import { MainLayout } from '~widgets/layout';
import { ProbaProgressWidget } from '~widgets/proba-progress';
import { GroupListWidget } from '~widgets/group-list';
import { WelcomeWidget } from '~widgets/welcome';
import { CreateGroup } from '~features/group/create-group';
import { SelectGenderModal } from '~features/onboarding/select-gender';
import { UserRole } from '~entities/user/model/types';

export const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.session);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome && user) {
      setShowWelcome(true);
    }
  }, [user]);

  if (!user) {
    console.log('[DashboardPage] No user, returning null');
    return null;
  }

  console.log('[DashboardPage] User data:', user);
  console.log('[DashboardPage] User sex:', user.sex);

  if (user && !user.sex) {
    console.log('[DashboardPage] User has no sex, showing SelectGenderModal');
    return (
      <SelectGenderModal
        isOpen={true}
        userId={user.id}
        email={user.email}
      />
    );
  }

  if (user.role === UserRole.LIAISON) {
    return <Navigate to="/liaison-dashboard" replace />;
  }

  if (user.role === UserRole.ADMIN) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {user.role === UserRole.SCOUT && (
          <ProbaProgressWidget
            userId={user.id}
            userRole={user.role}
            isViewingOwnProgress={true}
          />
        )}

        {user.role === UserRole.FOREMAN && (
          <>
            <CreateGroup />
            <GroupListWidget />
          </>
        )}
      </div>

      <WelcomeWidget
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        userName={user.name}
        userRole={user.role}
      />
    </MainLayout>
  );
};
