import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Avatar,
  Chip,
  Divider,
} from '@nextui-org/react';
import { useGetMyGroupsQuery } from '~entities/group';
import { ErrorMessage } from '~shared/ui';
import { InviteDropdown } from '~features/group/invite-dropdown';
import { EditScoutName } from '~features/user/edit-name';
import { EditGroupName } from '~features/group/edit-name';

interface GroupListWidgetProps {
  foremanId?: string;
}

export const GroupListWidget = ({ foremanId }: GroupListWidgetProps = {}) => {
  const navigate = useNavigate();
  const { data: groups, isLoading, isError, error } = useGetMyGroupsQuery(foremanId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" label="Loading your groups..." />
      </div>
    );
  }

  if (isError) {
    const errorMessage = error && 'data' in error
      ? (error.data as { message?: string })?.message || 'Failed to load groups'
      : 'Failed to load groups';
    return <ErrorMessage message={errorMessage} className="mt-4" />;
  }

  if (!groups || groups.length === 0) {
    return (
      <Card className="mt-4">
        <CardBody>
          <p className="text-center text-gray-600">
            No groups yet. Create your first group to get started!
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col flex-1">
              <p className="text-lg font-semibold">{group.name}</p>
              <p className="text-sm text-gray-500">
                {group.scouts.length} {group.scouts.length === 1 ? 'Scout' : 'Scouts'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <EditGroupName groupId={group.id} currentName={group.name} />
              <InviteDropdown groupId={group.id} groupName={group.name} />
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-3">
            {group.scouts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No scouts in this group yet
              </p>
            ) : (
              group.scouts.map((scout) => (
                <div
                  key={scout.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/scout/${scout.id}/progress`)}
                  >
                    <Avatar
                      src={scout.picture}
                      name={scout.name}
                      size="sm"
                      showFallback
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{scout.name}</p>
                      <p className="text-xs text-gray-500 truncate">{scout.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Chip size="sm" variant="flat" color="primary">
                        {scout.completedProbasCount}/{scout.totalProbasCount}
                      </Chip>
                    </div>
                  </div>
                  <EditScoutName scoutEmail={scout.email} currentName={scout.name} />
                </div>
              ))
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
