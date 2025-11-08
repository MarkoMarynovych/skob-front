import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Avatar, Skeleton } from '@nextui-org/react';
import { MainLayout } from '~widgets/layout';
import { GroupListWidget } from '~widgets/group-list';
import { useGetForemanDetailQuery } from '~entities/user/api';
import { ErrorMessage, PageHeader } from '~shared/ui';

export const ForemanDetailPage = () => {
  const { foremanId } = useParams<{ foremanId: string }>();
  const navigate = useNavigate();
  const { data: foreman, isLoading, error } = useGetForemanDetailQuery(foremanId!);

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

  if (error || !foreman) {
    return (
      <MainLayout>
        <ErrorMessage message="Failed to load foreman details" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={foreman.name}
          description="Foreman Profile and Managed Groups"
          actions={
            <Button
              color="default"
              variant="flat"
              onPress={() => navigate('/liaison-dashboard')}
            >
              Back to Dashboard
            </Button>
          }
        />

        <Card>
          <CardBody className="gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={foreman.picture}
                name={foreman.name}
                size="lg"
                className="w-20 h-20"
              />
              <div>
                <p className="text-xl font-semibold">{foreman.name}</p>
                <p className="text-gray-600">{foreman.email}</p>
                <p className="text-sm text-gray-500 mt-1">Role: {foreman.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Groups Managed</p>
                <p className="text-2xl font-bold text-primary">{foreman.groupCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Scouts</p>
                <p className="text-2xl font-bold text-secondary">{foreman.scoutCount}</p>
              </div>
              {foreman.lastActivity && (
                <div>
                  <p className="text-sm text-gray-600">Last Active</p>
                  <p className="text-sm font-medium">
                    {new Date(foreman.lastActivity).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Managed Groups</h2>
          <GroupListWidget foremanId={foreman.id} />
        </div>
      </div>
    </MainLayout>
  );
};
