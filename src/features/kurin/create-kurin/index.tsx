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
import { useCreateKurinMutation } from '~entities/kurin';
import toast from 'react-hot-toast';
import { IconPlus } from '@tabler/icons-react';

export const CreateKurin = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [kurinName, setKurinName] = useState('');
  const [createKurin, { isLoading }] = useCreateKurinMutation();

  const handleCreate = async () => {
    if (!kurinName.trim()) {
      toast.error('Kurin name cannot be empty');
      return;
    }

    if (kurinName.trim().length < 3) {
      toast.error('Kurin name must be at least 3 characters');
      return;
    }

    try {
      await createKurin({
        name: kurinName.trim(),
      }).unwrap();

      toast.success('Kurin created successfully');
      setKurinName('');
      onClose();
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to create kurin')
        : 'Failed to create kurin';
      toast.error(errorMessage);
    }
  };

  const handleOpen = () => {
    setKurinName('');
    onOpen();
  };

  return (
    <>
      <Button
        color="primary"
        onPress={handleOpen}
        startContent={<IconPlus size={20} />}
      >
        Create New Kurin
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Kurin
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Kurin Name"
                  placeholder="Enter kurin name..."
                  value={kurinName}
                  onValueChange={setKurinName}
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
                  isDisabled={!kurinName.trim() || kurinName.trim().length < 3}
                >
                  Create Kurin
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
