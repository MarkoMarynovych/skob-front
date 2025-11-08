import { Card, CardBody, CardHeader, Avatar, Chip, Skeleton } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useGetLiaisonListQuery } from '~entities/user/api';
import { ErrorMessage, EmptyState } from '~shared/ui';

export const LiaisonListWidget = () => {
  const navigate = useNavigate();
  const { data: liaisons, isLoading, error } = useGetLiaisonListQuery();

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
    return <ErrorMessage message="Failed to load liaisons list" />;
  }

  if (!liaisons || liaisons.length === 0) {
    return (
      <EmptyState
        title="No Liaisons Found"
        description="There are no liaisons in the system yet."
      />
    );
  }

  const totalForemen = liaisons.reduce((sum, l) => sum + (l.foremanCount ?? 0), 0);
  const totalScouts = liaisons.reduce((sum, l) => sum + (l.totalScouts ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600">Total Liaisons</p>
            <p className="text-3xl font-bold text-primary">{liaisons.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600">Total Foremen</p>
            <p className="text-3xl font-bold text-success">{totalForemen}</p>
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
        {liaisons.map((liaison) => (
          <Card
            key={liaison.id}
            isPressable
            onPress={() => navigate(`/liaison/${liaison.id}`)}
            className="hover:scale-105 transition-transform"
          >
            <CardHeader className="gap-3">
              <Avatar
                src={liaison.picture}
                name={liaison.name}
                size="lg"
              />
              <div className="flex flex-col">
                <p className="font-semibold">{liaison.name}</p>
                <p className="text-sm text-gray-500">{liaison.email}</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                <Chip color="primary" size="sm" variant="flat">
                  {liaison.foremanCount ?? 0} {(liaison.foremanCount ?? 0) === 1 ? 'Foreman' : 'Foremen'}
                </Chip>
                <Chip color="secondary" size="sm" variant="flat">
                  {liaison.totalScouts ?? 0} {(liaison.totalScouts ?? 0) === 1 ? 'Scout' : 'Scouts'}
                </Chip>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
