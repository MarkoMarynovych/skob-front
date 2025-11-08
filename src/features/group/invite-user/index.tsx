import { useState } from 'react';
import { Button, Input, Card, CardBody } from '@nextui-org/react';
import { useSendInviteMutation } from '~entities/invite';
import toast from 'react-hot-toast';
import { IconSend, IconCopy, IconCheck } from '@tabler/icons-react';

export const InviteToGroup = () => {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendInvite, { isLoading }] = useSendInviteMutation();

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
      const response = await sendInvite(email.trim()).unwrap();
      const fullLink = response.inviteLink || `${window.location.origin}/invites/accept/${response.hash}`;

      setInviteLink(fullLink);
      toast.success('Invitation sent successfully!');
      setEmail('');
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? ((error as { data?: { message?: string } }).data?.message || 'Failed to send invitation')
        : 'Failed to send invitation';
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
