import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Avatar, Skeleton } from '@nextui-org/react';
import { MainLayout } from '~widgets/layout';
import { ForemanListWidget } from '~widgets/foreman-list';
import { useGetLiaisonDetailQuery } from '~entities/user/api';
import { ErrorMessage, PageHeader } from '~shared/ui';

export const LiaisonDetailPage = () => {
  const { liaisonId } = useParams<{ liaisonId: string }>();
  const navigate = useNavigate();
  const { data: liaison, isLoading, error } = useGetLiaisonDetailQuery(liaisonId!);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 rounded" />
          <Card>
            <CardBody className="gap-4">
              <Skeleton className="rounded-full w-20 h-20" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </CardBody>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error || !liaison) {
    return (
      <MainLayout>
        <ErrorMessage message="Failed to load liaison details" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={liaison.name}
          description="Liaison Profile and Supervised Foremen"
          actions={
            <Button
              color="default"
              variant="flat"
              onPress={() => navigate('/admin-dashboard')}
            >
              Back to Dashboard
            </Button>
          }
        />

        <Card>
          <CardBody className="gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={liaison.picture}
                name={liaison.name}
                size="lg"
                className="w-20 h-20"
              />
              <div>
                <p className="text-xl font-semibold">{liaison.name}</p>
                <p className="text-gray-600">{liaison.email}</p>
                <p className="text-sm text-gray-500 mt-1">Role: {liaison.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Foremen Supervised</p>
                <p className="text-2xl font-bold text-primary">{liaison.foremanCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Scouts</p>
                <p className="text-2xl font-bold text-secondary">{liaison.totalScouts}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Supervised Foremen</h2>
          <ForemanListWidget />
        </div>
      </div>
    </MainLayout>
  );
};
