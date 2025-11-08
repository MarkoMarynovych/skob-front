import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from '@nextui-org/react';
import { IconEdit } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { useUpdateGroupMutation } from '~entities/group/api/groupApi';

interface EditGroupNameProps {
  groupId: string;
  currentName: string;
}

export const EditGroupName = ({ groupId, currentName }: EditGroupNameProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(currentName);
  const [updateGroup, { isLoading }] = useUpdateGroupMutation();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Group name cannot be empty');
      return;
    }

    try {
      await updateGroup({
        groupId,
        name: name.trim(),
      }).unwrap();

      toast.success('Group name updated successfully');
      onClose();
    } catch (error: any) {
      console.error('Failed to update group name:', error);
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error('Failed to update group name. Please try again.');
      }
    }
  };

  const handleOpen = () => {
    setName(currentName);
    onOpen();
  };

  return (
    <>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={handleOpen}
        aria-label="Edit group name"
        className="min-w-0 w-6 h-6"
      >
        <IconEdit size={16} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Group Name
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Group Name"
                  placeholder="Enter group name"
                  value={name}
                  onValueChange={setName}
                  isDisabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-gray-500">
                  This will update the name of this group.
                </p>
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
                  onPress={handleSave}
                  isLoading={isLoading}
                  isDisabled={!name.trim() || name.trim() === currentName}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
