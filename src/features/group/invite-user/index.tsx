import { useState } from 'react';
import { Button, Input, Card, CardBody } from '@nextui-org/react';
import { useGenerateInviteMutation, InviteType } from '~entities/invite';
import toast from 'react-hot-toast';
import { IconSend, IconCopy, IconCheck } from '@tabler/icons-react';

interface InviteToGroupProps {
  groupId: string;
}

export const InviteToGroup = ({ groupId }: InviteToGroupProps) => {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generateInvite, { isLoading }] = useGenerateInviteMutation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendInvite = async () => {
    if (!email.trim()) {
      toast.error('Email address is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const response = await generateInvite({
        type: InviteType.SCOUT,
        contextId: groupId,
      }).unwrap();

      setInviteLink(response.inviteLink);
      toast.success(`Invitation link generated! Share it with ${email.trim()}`);
      setEmail('');
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to generate invitation')
        : 'Failed to generate invitation';
      toast.error(errorMessage);
    }
  };

  const handleCopyLink = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Invitation link copied to clipboard!');

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && email.trim() && validateEmail(email.trim())) {
      handleSendInvite();
    }
  };

  const handleNewInvite = () => {
    setInviteLink(null);
    setCopied(false);
  };

  if (inviteLink) {
    return (
      <Card className="w-full">
        <CardBody className="gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700">Invitation Link Generated</p>
            <div className="bg-gray-50 p-3 rounded-lg break-all text-sm text-gray-600 border border-gray-200">
              {inviteLink}
            </div>
          </div>

          <div className="flex gap-2 flex-col sm:flex-row">
            <Button
              color="primary"
              onPress={handleCopyLink}
              startContent={copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
              className="flex-1"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button
              variant="flat"
              onPress={handleNewInvite}
              className="flex-1"
            >
              Send Another Invite
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="flex gap-2 flex-col sm:flex-row sm:items-end">
      <Input
        type="email"
        label="Email Address"
        placeholder="scout@example.com"
        value={email}
        onValueChange={setEmail}
        onKeyPress={handleKeyPress}
        isDisabled={isLoading}
        className="flex-1"
        classNames={{
          input: "text-base",
        }}
      />
      <Button
        color="primary"
        onPress={handleSendInvite}
        isLoading={isLoading}
        isDisabled={!email.trim() || !validateEmail(email.trim())}
        startContent={!isLoading && <IconSend size={18} />}
        className="w-full sm:w-auto"
      >
        {isLoading ? 'Sending...' : 'Send Invite'}
      </Button>
    </div>
  );
};
