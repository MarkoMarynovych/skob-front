import { useSelector } from 'react-redux';
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { RootState } from '~app/store';
import { MainLayout } from '~widgets/layout';
import { GroupListWidget } from '~widgets/group-list';
import { CreateGroup } from '~features/group/create-group';
import { ErrorMessage } from '~shared/ui';
import { UserRole } from '~entities/user/model/types';

export const MyGroupsPage = () => {
  const { user } = useSelector((state: RootState) => state.session);

  if (!user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (user.role !== UserRole.FOREMAN && user.role !== UserRole.LIAISON) {
    return (
      <MainLayout>
        <Card>
          <CardBody>
            <ErrorMessage message="You don't have permission to view this page" />
          </CardBody>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мої Гуртки</h1>
          <p className="mt-2 text-gray-600">
            Керуйте вашими гуртками та відстежуйте прогрес пластунів
          </p>
        </div>

        <CreateGroup />
        <GroupListWidget />
      </div>
    </MainLayout>
  );
};
