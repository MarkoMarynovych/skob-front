import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { useGenerateInviteMutation, InviteType } from '~entities/invite';
import { InviteLinkModal } from '~shared/ui';
import toast from 'react-hot-toast';
import { IconShare, IconChevronDown } from '@tabler/icons-react';

interface InviteDropdownProps {
  groupId: string;
  groupName?: string;
}

export const InviteDropdown = ({ groupId, groupName }: InviteDropdownProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inviteLink, setInviteLink] = useState('');
  const [inviteTitle, setInviteTitle] = useState('');
  const [inviteDescription, setInviteDescription] = useState('');
  const [generateInvite, { isLoading }] = useGenerateInviteMutation();

  const handleGenerateInvite = async (type: InviteType) => {
    try {
      const response = await generateInvite({
        type,
        contextId: groupId,
      }).unwrap();

      const fullLink = `${window.location.origin}/join/${response.token}`;
      setInviteLink(fullLink);

      if (type === InviteType.SCOUT) {
        setInviteTitle('Scout Invitation Link');
        setInviteDescription(
          `Share this link to invite a Scout ${groupName ? `to ${groupName}` : ''}.`
        );
      } else if (type === InviteType.CO_FOREMAN) {
        setInviteTitle('Co-Foreman Invitation Link');
        setInviteDescription(
          `Share this link to invite a Co-Foreman ${groupName ? `to ${groupName}` : ''}.`
        );
      }

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
      <Dropdown>
        <DropdownTrigger>
          <Button
            color="primary"
            variant="flat"
            size="sm"
            isLoading={isLoading}
            endContent={!isLoading && <IconChevronDown size={16} />}
            startContent={!isLoading && <IconShare size={18} />}
          >
            Share Invite
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Invite options">
          <DropdownItem
            key="scout"
            description="Add a new scout to this group"
            onPress={() => handleGenerateInvite(InviteType.SCOUT)}
          >
            Invite Scout
          </DropdownItem>
          <DropdownItem
            key="co-foreman"
            description="Add a co-foreman to this group"
            onPress={() => handleGenerateInvite(InviteType.CO_FOREMAN)}
          >
            Invite Co-Foreman
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <InviteLinkModal
        isOpen={isOpen}
        onClose={onClose}
        inviteLink={inviteLink}
        title={inviteTitle}
        description={inviteDescription}
      />
    </>
  );
};
