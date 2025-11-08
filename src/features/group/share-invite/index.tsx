import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { useLazyGetGroupInviteLinkQuery } from '~entities/group';
import toast from 'react-hot-toast';
import { IconShare, IconCheck } from '@tabler/icons-react';

interface ShareInviteProps {
  groupId: string;
  groupName?: string;
}

export const ShareInvite = ({ groupId, groupName }: ShareInviteProps) => {
  const [copied, setCopied] = useState(false);
  const [getInviteLink, { isLoading }] = useLazyGetGroupInviteLinkQuery();

  const handleShareInvite = async () => {
    try {
      const response = await getInviteLink(groupId).unwrap();
      const inviteUrl = `${window.location.origin}/join/${response.inviteToken}`;

      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      toast.success(
        groupName
          ? `Invite link for "${groupName}" copied to clipboard!`
          : 'Invite link copied to clipboard!'
      );

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to get invite link')
        : 'Failed to get invite link';
      toast.error(errorMessage);
    }
  };

  return (
    <Button
      color="primary"
      variant="flat"
      size="sm"
      onPress={handleShareInvite}
      isLoading={isLoading}
      startContent={!isLoading && (copied ? <IconCheck size={18} /> : <IconShare size={18} />)}
    >
      {copied ? 'Copied!' : 'Share Invite'}
    </Button>
  );
};
