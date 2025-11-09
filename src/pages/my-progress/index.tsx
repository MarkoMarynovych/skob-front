import { useSelector } from 'react-redux';
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { IconAlertCircle, IconUsers } from '@tabler/icons-react';
import { RootState } from '~app/store';
import { MainLayout } from '~widgets/layout';
import { ProbaProgressWidget } from '~widgets/proba-progress';
import { ErrorMessage } from '~shared/ui';
import { UserRole } from '~entities/user/model/types';
import { useGetMyGroupsQuery } from '~entities/group/api/groupApi';
import { SelectGenderModal } from '~features/onboarding/select-gender';

export const MyProgressPage = () => {
  const { user } = useSelector((state: RootState) => state.session);
  const { data: groups, isLoading: isLoadingGroups } = useGetMyGroupsQuery();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (user && !user.sex) {
    return (
      <SelectGenderModal
        isOpen={true}
        userId={user.id}
        email={user.email}
      />
    );
  }

  if (user.role !== UserRole.SCOUT && user.role !== UserRole.FOREMAN) {
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

  const isInGroup = groups && groups.length > 0;

  if (user.role === UserRole.SCOUT && !isLoadingGroups && !isInGroup) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Мій Прогрес</h1>
            <p className="mt-2 text-gray-600">
              Переглядайте та відстежуйте ваш прогрес у пробах
            </p>
          </div>

          <Card className="border-2 border-warning">
            <CardBody>
              <div className="flex items-start gap-4">
                <IconUsers size={48} className="text-warning flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-warning mb-2">
                    Ви ще не додані до гуртка
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Щоб почати відстежувати ваш прогрес у пробах, вам потрібно бути
                    доданим до гуртка вашим виховником.
                  </p>
                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <IconAlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">
                      <strong>Що робити:</strong> Зв'яжіться з вашим виховником та попросіть
                      його додати вас до гуртка. Після цього ви зможете почати працювати
                      над вашими пробами.
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (isLoadingGroups) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мій Прогрес</h1>
          <p className="mt-2 text-gray-600">
            Переглядайте та відстежуйте ваш прогрес у пробах
          </p>
        </div>

        <ProbaProgressWidget
          userId={user.id}
          userRole={user.role}
          isViewingOwnProgress={true}
        />
      </div>
    </MainLayout>
  );
};
