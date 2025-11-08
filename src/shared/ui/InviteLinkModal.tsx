import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import toast from 'react-hot-toast';

interface InviteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteLink: string;
  title?: string;
  description?: string;
}

export const InviteLinkModal = ({
  isOpen,
  onClose,
  inviteLink,
  title = 'Invite Link Generated',
  description = 'Share this link with the person you want to invite.',
}: InviteLinkModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p className="text-sm text-gray-600 mb-3">{description}</p>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  classNames={{
                    input: 'text-xs',
                  }}
                />
                <Button
                  color={copied ? 'success' : 'primary'}
                  onPress={handleCopy}
                  isIconOnly
                >
                  {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onCloseModal}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
