import { Card, CardBody, CardHeader, Avatar, Chip, Skeleton } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useGetForemanListQuery } from '~entities/user/api';
import { ErrorMessage, EmptyState } from '~shared/ui';

export const ForemanListWidget = () => {
  const navigate = useNavigate();
  const { data: foremen, isLoading, error } = useGetForemanListQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="gap-3">
              <Skeleton className="rounded-full w-12 h-12" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-full rounded" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load foremen list" />;
  }

  if (!foremen || foremen.length === 0) {
    return (
      <EmptyState
        title="No Foremen Assigned"
        description="You don't have any foremen under your supervision yet."
      />
    );
  }

  const totalGroups = foremen.reduce((sum, f) => sum + f.groupCount, 0);
  const totalScouts = foremen.reduce((sum, f) => sum + f.scoutCount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600">Total Foremen</p>
            <p className="text-3xl font-bold text-primary">{foremen.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600">Total Groups</p>
            <p className="text-3xl font-bold text-success">{totalGroups}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600">Total Scouts</p>
            <p className="text-3xl font-bold text-secondary">{totalScouts}</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foremen.map((foreman) => (
          <Card
            key={foreman.id}
            isPressable
            onPress={() => navigate(`/foreman/${foreman.id}`)}
            className="hover:scale-105 transition-transform"
          >
            <CardHeader className="gap-3">
              <Avatar
                src={foreman.picture}
                name={foreman.name}
                size="lg"
              />
              <div className="flex flex-col">
                <p className="font-semibold">{foreman.name}</p>
                <p className="text-sm text-gray-500">{foreman.email}</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                <Chip color="primary" size="sm" variant="flat">
                  {foreman.groupCount} {foreman.groupCount === 1 ? 'Group' : 'Groups'}
                </Chip>
                <Chip color="secondary" size="sm" variant="flat">
                  {foreman.scoutCount} {foreman.scoutCount === 1 ? 'Scout' : 'Scouts'}
                </Chip>
              </div>
              {foreman.lastActivity && (
                <p className="text-xs text-gray-500 mt-3">
                  Last active: {new Date(foreman.lastActivity).toLocaleDateString()}
                </p>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
