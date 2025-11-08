import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Spinner, Card, CardBody } from '@nextui-org/react';
import { IconArrowLeft } from '@tabler/icons-react';
import { RootState } from '~app/store';
import { MainLayout } from '~widgets/layout';
import { ProbaProgressWidget } from '~widgets/proba-progress';
import { ErrorMessage } from '~shared/ui';
import { UserRole } from '~entities/user/model/types';

export const ScoutProgressPage = () => {
  const { scoutId } = useParams<{ scoutId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.session);

  if (!scoutId) {
    return (
      <MainLayout>
        <ErrorMessage message="Scout ID is missing" />
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (user.role !== UserRole.FOREMAN) {
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
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => navigate('/dashboard')}
            aria-label="Back to dashboard"
          >
            <IconArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scout Progress</h1>
            <p className="mt-2 text-gray-600">
              Manage and track this scout's proba progress
            </p>
          </div>
        </div>

        <ProbaProgressWidget
          userId={scoutId}
          userRole={user.role}
          isViewingOwnProgress={false}
        />
      </div>
    </MainLayout>
  );
};
