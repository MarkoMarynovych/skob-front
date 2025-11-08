import { useSelector } from 'react-redux';
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { RootState } from '~app/store';
import { MainLayout } from '~widgets/layout';
import { KurinDetailsPage } from '~pages/admin/kurins';
import { ErrorMessage } from '~shared/ui';
import { IconAlertCircle } from '@tabler/icons-react';
import { UserRole } from '~entities/user/model/types';

export const MyKurinPage = () => {
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

  if (user.role !== UserRole.LIAISON) {
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

  if (!user?.kurin) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Мій Курінь</h1>
            <p className="mt-2 text-gray-600">
              Керуйте вашим куренем та запрошуйте виховників
            </p>
          </div>

          <Card className="border-2 border-warning">
            <CardBody>
              <div className="flex items-start gap-3">
                <IconAlertCircle size={24} className="text-warning flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-warning mb-1">
                    Курінь не призначений
                  </h3>
                  <p className="text-sm text-gray-600">
                    Вам ще не призначено курінь. Зверніться до адміністратора,
                    щоб отримати призначення до куреня перед тим, як запрошувати виховників.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return <KurinDetailsPage basePath="/liaison" kurinId={user.kurin.id} />;
};
