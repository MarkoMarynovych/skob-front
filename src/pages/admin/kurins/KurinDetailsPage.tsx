import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Chip,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useGetKurinDetailsQuery, useUpdateKurinMutation, useDeleteKurinMutation } from '~entities/kurin';
import { useGetLiaisonListQuery } from '~entities/user/api';
import { useGenerateInviteMutation } from '~entities/invite/api/inviteApi';
import { InviteType } from '~entities/invite/model/types';
import { MainLayout } from '~widgets/layout';
import { ErrorMessage } from '~shared/ui';
import { RootState } from '~app/store';
import { UserRole } from '~entities/user/model/types';
import {
  IconBuildingCommunity,
  IconUsers,
  IconUsersGroup,
  IconChevronRight,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconCopy,
  IconCheck,
} from '@tabler/icons-react';

interface KurinDetailsPageProps {
  basePath?: string;
  kurinId?: string;
}

export const KurinDetailsPage = ({ basePath, kurinId: propKurinId }: KurinDetailsPageProps) => {
  const params = useParams<{ kurinId: string }>();
  const navigate = useNavigate();
  const kurinId = propKurinId || params.kurinId;
  const location = window.location.pathname;
  const resolvedBasePath = basePath || (location.includes('/liaison/') ? '/liaison' : '/admin');
  const { user } = useSelector((state: RootState) => state.session);

  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isChangeLiaisonOpen, setIsChangeLiaisonOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInviteForemanOpen, setIsInviteForemanOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLiaisonId, setNewLiaisonId] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const { data: kurin, isLoading, isError, error } = useGetKurinDetailsQuery(kurinId || '', {
    skip: !kurinId,
  });

  const { data: liaisons } = useGetLiaisonListQuery();
  const [updateKurin, { isLoading: isUpdating }] = useUpdateKurinMutation();
  const [deleteKurin, { isLoading: isDeleting }] = useDeleteKurinMutation();
  const [generateInvite, { isLoading: isGenerating }] = useGenerateInviteMutation();

  const isAdmin = user?.role === UserRole.ADMIN;
  const isLiaison = user?.role === UserRole.LIAISON;

  const handleForemanClick = (foremanId: string) => {
    navigate(`${resolvedBasePath}/kurins/${kurinId}/foremen/${foremanId}`);
  };

  const handleEditName = () => {
    if (kurin) {
      setNewName(kurin.name);
      setIsEditNameOpen(true);
    }
  };

  const handleChangeLiaison = () => {
    if (kurin) {
      setNewLiaisonId(kurin.liaison?.id || '');
      setIsChangeLiaisonOpen(true);
    }
  };

  const handleSaveName = async () => {
    if (kurinId && newName.trim()) {
      try {
        await updateKurin({ id: kurinId, data: { name: newName.trim() } }).unwrap();
        setIsEditNameOpen(false);
      } catch (err) {
        console.error('Failed to update kurin name:', err);
      }
    }
  };

  const handleSaveLiaison = async () => {
    if (kurinId) {
      try {
        await updateKurin({
          id: kurinId,
          data: { liaisonId: newLiaisonId || undefined }
        }).unwrap();
        setIsChangeLiaisonOpen(false);
      } catch (err) {
        console.error('Failed to update liaison:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (kurinId) {
      try {
        await deleteKurin(kurinId).unwrap();
        navigate('/admin-dashboard');
      } catch (err) {
        console.error('Failed to delete kurin:', err);
      }
    }
  };

  const handleGenerateInvite = async () => {
    if (kurinId) {
      try {
        const result = await generateInvite({
          type: InviteType.FOREMAN,
          contextId: kurinId,
        }).unwrap();
        setInviteLink(result.inviteLink);
        setIsInviteForemanOpen(true);
      } catch (err) {
        console.error('Failed to generate invite:', err);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading kurin details..." />
        </div>
      </MainLayout>
    );
  }

  if (isError || !kurin) {
    const errorMessage = error && 'data' in error
      ? (error.data as { message?: string })?.message || 'Failed to load kurin details'
      : 'Failed to load kurin details';
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
          <BreadcrumbItem>{kurin.name}</BreadcrumbItem>
        </Breadcrumbs>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 w-full">
              <IconBuildingCommunity size={32} className="text-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{kurin.name}</h1>
                  {isAdmin && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={handleEditName}
                      aria-label="Edit kurin name"
                    >
                      <IconEdit size={18} />
                    </Button>
                  )}
                </div>
                {kurin.liaison && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">
                      Liaison: {kurin.liaison.name}
                    </p>
                    {isAdmin && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleChangeLiaison}
                        aria-label="Change liaison"
                      >
                        <IconEdit size={14} />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {isAdmin && (
                <Button
                  color="danger"
                  variant="flat"
                  startContent={<IconTrash size={18} />}
                  onPress={() => setIsDeleteOpen(true)}
                >
                  Delete Kurin
                </Button>
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-primary-50 rounded-lg">
                <IconUsers size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold text-primary">{kurin.foremen?.length ?? 0}</p>
                <p className="text-sm text-gray-600">Foremen</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg">
                <IconUsersGroup size={24} className="text-secondary mb-2" />
                <p className="text-2xl font-bold text-secondary">
                  {kurin.foremen?.reduce((total, f) => total + (f.groupCount ?? 0), 0) ?? 0}
                </p>
                <p className="text-sm text-gray-600">Groups</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-default-100 rounded-lg">
                <IconUsers size={24} className="text-default-600 mb-2" />
                <p className="text-2xl font-bold text-default-700">
                  {kurin.foremen?.reduce((total, f) => total + (f.scoutCount ?? 0), 0) ?? 0}
                </p>
                <p className="text-sm text-gray-600">Scouts</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Foremen</h2>
            {isLiaison && (
              <Button
                color="primary"
                startContent={<IconUserPlus size={20} />}
                onPress={handleGenerateInvite}
                isLoading={isGenerating}
              >
                Invite Foreman
              </Button>
            )}
          </div>
          {kurin.foremen && kurin.foremen.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kurin.foremen.map((foreman) => (
                <Card
                  key={foreman.id}
                  isPressable
                  onPress={() => handleForemanClick(foreman.id)}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="flex gap-3">
                    {foreman.picture && (
                      <img
                        src={foreman.picture}
                        alt={foreman.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex flex-col flex-1">
                      <p className="text-lg font-semibold">{foreman.name}</p>
                      <p className="text-sm text-gray-600">{foreman.email}</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IconUsersGroup size={18} />
                        <span>Groups:</span>
                      </div>
                      <Chip size="sm" variant="flat" color="primary">
                        {foreman.groupCount || foreman.groupsCount || 0}
                      </Chip>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IconUsers size={18} />
                        <span>Scouts:</span>
                      </div>
                      <Chip size="sm" variant="flat" color="default">
                        {foreman.scoutCount || foreman.scoutsCount || 0}
                      </Chip>
                    </div>
                    {foreman.averageProgress !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg Progress:</span>
                        <Chip size="sm" variant="flat" color="success">
                          {foreman.averageProgress.toFixed(1)}%
                        </Chip>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody>
                <p className="text-center text-gray-600">
                  No foremen in this kurin yet.
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Edit Name Modal */}
        <Modal isOpen={isEditNameOpen} onClose={() => setIsEditNameOpen(false)}>
          <ModalContent>
            <ModalHeader>Edit Kurin Name</ModalHeader>
            <ModalBody>
              <Input
                label="Kurin Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter kurin name"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setIsEditNameOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSaveName} isLoading={isUpdating}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Change Liaison Modal */}
        <Modal isOpen={isChangeLiaisonOpen} onClose={() => setIsChangeLiaisonOpen(false)}>
          <ModalContent>
            <ModalHeader>Manage Liaison</ModalHeader>
            <ModalBody>
              <Select
                label="Select Liaison"
                selectedKeys={newLiaisonId ? [newLiaisonId] : []}
                onChange={(e) => setNewLiaisonId(e.target.value)}
                placeholder="Select a liaison or leave empty to remove"
              >
                {liaisons?.map((liaison) => (
                  <SelectItem key={liaison.id} value={liaison.id}>
                    {liaison.name}
                  </SelectItem>
                ))}
              </Select>
              {kurin?.liaison && (
                <p className="text-sm text-gray-600 mt-2">
                  Current: {kurin.liaison.name}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setIsChangeLiaisonOpen(false)}>
                Cancel
              </Button>
              {kurin?.liaison && (
                <Button
                  color="warning"
                  variant="flat"
                  onPress={() => setNewLiaisonId('')}
                >
                  Remove Liaison
                </Button>
              )}
              <Button color="primary" onPress={handleSaveLiaison} isLoading={isUpdating}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <ModalContent>
            <ModalHeader>Delete Kurin</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to delete this kurin?</p>
              <p className="text-sm text-gray-600 mt-2">
                This will permanently delete the kurin "{kurin?.name}". This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete} isLoading={isDeleting}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Invite Foreman Modal */}
        <Modal isOpen={isInviteForemanOpen} onClose={() => setIsInviteForemanOpen(false)}>
          <ModalContent>
            <ModalHeader>Invite Foreman to {kurin?.name}</ModalHeader>
            <ModalBody className="space-y-4">
              <p className="text-sm text-gray-600">
                Share this link with the person you want to invite as a Foreman. The link will expire in 7 days.
              </p>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1"
                  size="sm"
                />
                <Button
                  color={isCopied ? 'success' : 'primary'}
                  variant="flat"
                  onPress={handleCopyLink}
                  isIconOnly
                >
                  {isCopied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={() => setIsInviteForemanOpen(false)}>
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </MainLayout>
  );
};
