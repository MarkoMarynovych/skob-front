import { useState } from 'react';
import { Button, useDisclosure } from '@nextui-org/react';
import { useGenerateInviteMutation, InviteType } from '~entities/invite';
import { InviteLinkModal } from '~shared/ui';
import toast from 'react-hot-toast';
import { IconUserPlus } from '@tabler/icons-react';

interface InviteLiaisonProps {
  kurinId: string;
  kurinName?: string;
}

export const InviteLiaison = ({ kurinId, kurinName }: InviteLiaisonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inviteLink, setInviteLink] = useState('');
  const [generateInvite, { isLoading }] = useGenerateInviteMutation();

  const handleGenerateInvite = async () => {
    try {
      const response = await generateInvite({
        type: InviteType.LIAISON,
        contextId: kurinId,
      }).unwrap();

      const fullLink = `${window.location.origin}/join/${response.token}`;
      setInviteLink(fullLink);
      onOpen();
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to generate invite')
        : 'Failed to generate invite';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Button
        color="secondary"
        variant="flat"
        size="sm"
        onPress={handleGenerateInvite}
        isLoading={isLoading}
        startContent={!isLoading && <IconUserPlus size={18} />}
      >
        Invite Liaison
      </Button>

      <InviteLinkModal
        isOpen={isOpen}
        onClose={onClose}
        inviteLink={inviteLink}
        title="Liaison Invitation Link"
        description={`Share this link to invite a Liaison ${kurinName ? `for ${kurinName}` : ''}.`}
      />
    </>
  );
};
