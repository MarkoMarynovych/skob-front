import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  Avatar,
  Progress,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { useGetGroupDetailsQuery, useRemoveMemberMutation } from '~entities/group';
import { MainLayout } from '~widgets/layout';
import { ErrorMessage } from '~shared/ui';
import { RootState } from '~app/store';
import { UserRole } from '~entities/user/model/types';
import {
  IconUsersGroup,
  IconUsers,
  IconChevronRight,
  IconUserCheck,
  IconTrash,
} from '@tabler/icons-react';

interface GroupDetailsPageProps {
  basePath?: string;
}

export const GroupDetailsPage = ({ basePath }: GroupDetailsPageProps) => {
  const { groupId, foremanId, kurinId } = useParams<{ groupId: string; foremanId: string; kurinId: string }>();
  const navigate = useNavigate();
  const location = window.location.pathname;
  const resolvedBasePath = basePath || (location.includes('/liaison/') ? '/liaison' : '/admin');
  const { user } = useSelector((state: RootState) => state.session);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [scoutToDelete, setScoutToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data: group, isLoading, isError, error } = useGetGroupDetailsQuery(groupId || '', {
    skip: !groupId,
  });
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();

  const isForeman = user?.role === UserRole.FOREMAN;

  const handleScoutClick = (scoutId: string) => {
    navigate(`${resolvedBasePath}/kurins/${kurinId}/foremen/${foremanId}/groups/${groupId}/scouts/${scoutId}/progress`);
  };

  const handleDeleteClick = (scout: { id: string; name: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setScoutToDelete(scout);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (groupId && scoutToDelete) {
      try {
        await removeMember({ groupId, userId: scoutToDelete.id }).unwrap();
        setIsDeleteOpen(false);
        setScoutToDelete(null);
      } catch (err) {
        console.error('Failed to remove scout from group:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading group details..." />
        </div>
      </MainLayout>
    );
  }

  if (isError || !group) {
    const errorMessage = error && 'data' in error
      ? (error.data as { message?: string })?.message || 'Failed to load group details'
      : 'Failed to load group details';
    return (
      <MainLayout>
        <ErrorMessage message={errorMessage} className="mt-4" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <Breadcrumbs separator={<IconChevronRight size={16} />}>
          <BreadcrumbItem>
            <Link to={resolvedBasePath === '/admin' ? '/admin-dashboard' : '/my-kurin'}>
              {resolvedBasePath === '/admin' ? 'Admin Panel' : 'My Kurin'}
            </Link>
          </BreadcrumbItem>
          {kurinId && resolvedBasePath === '/admin' && (
            <BreadcrumbItem>
              <Link to={`${resolvedBasePath}/kurins/${kurinId}`}>
                Kurin
              </Link>
            </BreadcrumbItem>
          )}
          {kurinId && foremanId && (
            <BreadcrumbItem>
              <Link to={`${resolvedBasePath}/kurins/${kurinId}/foremen/${foremanId}`}>
                Foreman
              </Link>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem>Group Details</BreadcrumbItem>
        </Breadcrumbs>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 w-full">
              <IconUsersGroup size={32} className="text-primary" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                {group.foreman && (
                  <p className="text-sm text-gray-600 mt-1">
                    Foreman: {group.foreman.name}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-primary-50 rounded-lg">
                <IconUsers size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold text-primary">{group.scouts?.length ?? 0}</p>
                <p className="text-sm text-gray-600">Scouts</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-success-50 rounded-lg">
                <IconUserCheck size={24} className="text-success mb-2" />
                <p className="text-2xl font-bold text-success">
                  {group.scouts && group.scouts.length > 0
                    ? (group.scouts.reduce((sum, s) => {
                        const total = s.totalItems ?? 0;
                        const completed = s.completedItems ?? 0;
                        return sum + (total > 0 ? (completed / total) * 100 : 0);
                      }, 0) / group.scouts.length).toFixed(1)
                    : '0.0'}%
                </p>
                <p className="text-sm text-gray-600">Avg Progress</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Scouts</h2>
          {group.scouts && group.scouts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.scouts.map((scout) => {
                const completedItems = scout.completedItems ?? scout.completedProbasCount ?? 0;
                const totalItems = scout.totalItems ?? scout.totalProbasCount ?? 1;
                const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

                return (
                  <Card
                    key={scout.id}
                    isPressable
                    onPress={() => handleScoutClick(scout.id)}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardHeader className="flex gap-3">
                      <Avatar
                        src={scout.picture}
                        name={scout.name}
                        size="md"
                        className="flex-shrink-0"
                      />
                      <div className="flex flex-col flex-1">
                        <p className="text-md font-semibold">{scout.name}</p>
                        <p className="text-xs text-gray-600">{scout.email}</p>
                      </div>
                      {isForeman && (
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={(e) => handleDeleteClick({ id: scout.id, name: scout.name }, e)}
                          aria-label="Remove scout from group"
                        >
                          <IconTrash size={18} />
                        </Button>
                      )}
                    </CardHeader>
                    <Divider />
                    <CardBody className="gap-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-semibold">
                            {completedItems} / {totalItems}
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          color={progress >= 75 ? 'success' : progress >= 50 ? 'primary' : 'warning'}
                          size="sm"
                          showValueLabel
                        />
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardBody>
                <p className="text-center text-gray-600">
                  No scouts in this group yet.
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <ModalContent>
            <ModalHeader>Remove Scout from Group</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to remove this scout from the group?</p>
              {scoutToDelete && (
                <p className="text-sm text-gray-600 mt-2">
                  Scout: <strong>{scoutToDelete.name}</strong>
                </p>
              )}
              <p className="text-sm text-warning mt-2">
                This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDeleteConfirm} isLoading={isRemoving}>
                Remove
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </MainLayout>
  );
};
