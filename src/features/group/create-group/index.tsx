import { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';
import { useCreateGroupMutation, useGetMyGroupsQuery } from '~entities/group';
import toast from 'react-hot-toast';
import { IconPlus } from '@tabler/icons-react';

const MAX_GROUPS_PER_FOREMAN = 2;

export const CreateGroup = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState('');
  const [createGroup, { isLoading }] = useCreateGroupMutation();
  const { data: groups } = useGetMyGroupsQuery();

  const hasReachedLimit = groups && groups.length >= MAX_GROUPS_PER_FOREMAN;
  const remainingGroups = groups ? MAX_GROUPS_PER_FOREMAN - groups.length : MAX_GROUPS_PER_FOREMAN;

  const handleCreate = async () => {
    if (!groupName.trim()) {
      toast.error('Group name cannot be empty');
      return;
    }

    if (groupName.trim().length < 3) {
      toast.error('Group name must be at least 3 characters');
      return;
    }

    try {
      await createGroup({
        name: groupName.trim(),
      }).unwrap();

      toast.success('Group created successfully');
      setGroupName('');
      onClose();
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to create group')
        : 'Failed to create group';
      toast.error(errorMessage);
    }
  };

  const handleOpen = () => {
    setGroupName('');
    onOpen();
  };

  const buttonElement = (
    <Button
      color="primary"
      onPress={handleOpen}
      startContent={<IconPlus size={20} />}
      isDisabled={hasReachedLimit}
    >
      Create New Group
    </Button>
  );

  return (
    <>
      {hasReachedLimit ? (
        <Tooltip
          content={`You can only create up to ${MAX_GROUPS_PER_FOREMAN} groups`}
          color="warning"
        >
          {buttonElement}
        </Tooltip>
      ) : (
        buttonElement
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Group
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Group Name"
                  placeholder="Enter group name..."
                  value={groupName}
                  onValueChange={setGroupName}
                  isDisabled={isLoading}
                  autoFocus
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onCloseModal}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleCreate}
                  isLoading={isLoading}
                  isDisabled={!groupName.trim() || groupName.trim().length < 3}
                >
                  Create Group
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
