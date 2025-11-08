import { Button } from '@nextui-org/react';
import { useAcceptInviteMutation } from '~entities/invite';
import toast from 'react-hot-toast';
import { IconCheck } from '@tabler/icons-react';

interface AcceptInviteButtonProps {
  inviteHash: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const AcceptInviteButton = ({ inviteHash, onSuccess, onError }: AcceptInviteButtonProps) => {
  const [acceptInvite, { isLoading }] = useAcceptInviteMutation();

  const handleAccept = async () => {
    try {
      const result = await acceptInvite(inviteHash).unwrap();
      toast.success(`Invitation accepted! You've joined ${result.groupName}. Please log in to continue.`);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to accept invitation')
        : 'Failed to accept invitation';

      toast.error(errorMessage);
      onError?.(error);
    }
  };

  return (
    <Button
      color="primary"
      size="lg"
      onPress={handleAccept}
      isLoading={isLoading}
      startContent={!isLoading && <IconCheck size={20} />}
      className="w-full"
    >
      {isLoading ? 'Accepting...' : 'Accept Invitation'}
    </Button>
  );
};
