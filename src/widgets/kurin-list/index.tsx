import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Chip,
  Divider,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useGetKurinsQuery } from '~entities/kurin';
import { ErrorMessage } from '~shared/ui';
import { InviteLiaison } from '~features/kurin/invite-liaison';
import { IconUsers, IconUserCheck, IconUsersGroup } from '@tabler/icons-react';

export const KurinListWidget = () => {
  const navigate = useNavigate();
  const { data: kurins, isLoading, isError, error } = useGetKurinsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" label="Loading kurins..." />
      </div>
    );
  }

  if (isError) {
    const errorMessage = error && 'data' in error
      ? (error.data as { message?: string })?.message || 'Failed to load kurins'
      : 'Failed to load kurins';
    return <ErrorMessage message={errorMessage} className="mt-4" />;
  }

  if (!kurins || kurins.length === 0) {
    return (
      <Card className="mt-4">
        <CardBody>
          <p className="text-center text-gray-600">
            No kurins yet. Create your first kurin to get started!
          </p>
        </CardBody>
      </Card>
    );
  }

  const handleKurinClick = (kurinId: string) => {
    navigate(`/admin/kurins/${kurinId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kurins.map((kurin) => (
        <Card
          key={kurin.id}
          isPressable
          onPress={() => handleKurinClick(kurin.id)}
          className="hover:shadow-lg transition-shadow cursor-pointer"
        >
          <CardHeader className="flex gap-3">
            <div className="flex flex-col flex-1">
              <p className="text-lg font-semibold">{kurin.name}</p>
              <div className="flex gap-2 mt-1">
                {kurin.liaison ? (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="success"
                    startContent={<IconUserCheck size={14} />}
                  >
                    {kurin.liaison.name}
                  </Chip>
                ) : (
                  <Chip size="sm" variant="flat" color="warning">
                    No Liaison
                  </Chip>
                )}
              </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <InviteLiaison kurinId={kurin.id} kurinName={kurin.name} />
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconUsers size={18} />
                <span>Foremen:</span>
              </div>
              <Chip size="sm" variant="flat" color="primary">
                {kurin.foremanCount || kurin.foremenCount || 0}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconUsersGroup size={18} />
                <span>Groups:</span>
              </div>
              <Chip size="sm" variant="flat" color="secondary">
                {kurin.groupCount || 0}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <IconUsers size={18} />
                <span>Scouts:</span>
              </div>
              <Chip size="sm" variant="flat" color="default">
                {kurin.scoutCount || kurin.scoutsCount || 0}
              </Chip>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
