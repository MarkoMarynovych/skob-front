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
} from '@nextui-org/react';
import { useUpdateUserMutation } from '~entities/user';
import toast from 'react-hot-toast';
import { IconEdit } from '@tabler/icons-react';

interface EditScoutNameProps {
  scoutEmail: string;
  currentName: string;
}

export const EditScoutName = ({ scoutEmail, currentName }: EditScoutNameProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(currentName);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleOpen = () => {
    setName(currentName);
    onOpen();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      await updateUser({
        email: scoutEmail,
        data: { name: name.trim() },
      }).unwrap();

      toast.success('Scout name updated successfully');
      onClose();
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to update name')
        : 'Failed to update name';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={handleOpen}
        aria-label="Edit scout name"
        className="min-w-0 w-6 h-6"
      >
        <IconEdit size={16} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Scout Name
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Scout Name"
                  placeholder="Enter scout's name"
                  value={name}
                  onValueChange={setName}
                  isDisabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-gray-500">
                  This will update the display name for this scout in your group.
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
