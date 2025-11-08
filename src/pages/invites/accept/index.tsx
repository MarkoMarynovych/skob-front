import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Divider, Button } from '@nextui-org/react';
import { useGetInviteDetailsQuery, InviteStatus } from '~entities/invite';
import { AcceptInviteButton } from '~features/invite/accept-invite';
import { LoadingSpinner, ErrorMessage } from '~shared/ui';
import { IconAlertCircle, IconLogin, IconMail, IconUsers, IconCalendar } from '@tabler/icons-react';

export const InviteAcceptPage = () => {
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();

  const { data: invite, isLoading, error } = useGetInviteDetailsQuery(hash || '', {
    skip: !hash,
  });

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (!hash) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardBody className="gap-4 p-8">
            <div className="flex items-center gap-3 text-danger">
              <IconAlertCircle size={24} />
              <h2 className="text-xl font-semibold">Invalid Invitation Link</h2>
            </div>
            <p className="text-gray-600">This invitation link is invalid or malformed.</p>
            <Button color="primary" onPress={handleGoToLogin} startContent={<IconLogin size={18} />}>
              Go to Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardBody className="p-8">
            <LoadingSpinner message="Loading invitation details..." />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    const errorMessage = error && typeof error === 'object' && 'data' in error
      ? ((error as { data?: { message?: string } }).data?.message || 'Failed to load invitation')
      : 'Failed to load invitation';

    const isExpired = errorMessage.toLowerCase().includes('expired');
    const isNotFound = errorMessage.toLowerCase().includes('not found');
    const isAccepted = errorMessage.toLowerCase().includes('accepted');

    let displayMessage = errorMessage;
    if (isExpired) {
      displayMessage = 'This invitation has expired. Please request a new one from your Foreman.';
    } else if (isNotFound) {
      displayMessage = 'Invitation not found. The link may be invalid.';
    } else if (isAccepted) {
      displayMessage = 'This invitation has already been accepted.';
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardBody className="gap-6 p-8">
            <div className="flex items-center gap-3 text-danger">
              <IconAlertCircle size={24} />
              <h2 className="text-xl font-semibold">Invitation Error</h2>
            </div>
            <ErrorMessage message={displayMessage} />
            <Button color="primary" onPress={handleGoToLogin} startContent={<IconLogin size={18} />}>
              Go to Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!invite) {
    return null;
  }

  if (invite.status === InviteStatus.EXPIRED) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardBody className="gap-6 p-8">
            <div className="flex items-center gap-3 text-warning">
              <IconAlertCircle size={24} />
              <h2 className="text-xl font-semibold">Invitation Expired</h2>
            </div>
            <p className="text-gray-600">
              This invitation has expired. Please request a new one from your Foreman.
            </p>
            <Button color="primary" onPress={handleGoToLogin} startContent={<IconLogin size={18} />}>
              Go to Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (invite.status === InviteStatus.ACCEPTED) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardBody className="gap-6 p-8">
            <div className="flex items-center gap-3 text-success">
              <IconAlertCircle size={24} />
              <h2 className="text-xl font-semibold">Already Accepted</h2>
            </div>
            <p className="text-gray-600">
              This invitation has already been accepted. Please log in to continue.
            </p>
            <Button color="primary" onPress={handleGoToLogin} startContent={<IconLogin size={18} />}>
              Go to Login
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const expiresAt = new Date(invite.expiresAt);
  const isExpiringSoon = expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 px-6 pt-6 pb-0">
          <h1 className="text-2xl font-bold text-gray-800">Group Invitation</h1>
          <p className="text-sm text-gray-500">You have been invited to join a scout group</p>
        </CardHeader>
        <Divider className="my-4" />
        <CardBody className="gap-6 px-6 pb-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <IconUsers size={20} className="text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Group Name</p>
                <p className="text-lg font-semibold text-gray-800">{invite.groupName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconMail size={20} className="text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Invited Email</p>
                <p className="text-gray-800">{invite.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconLogin size={20} className="text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Invited By</p>
                <p className="text-gray-800">{invite.invitedBy}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconCalendar size={20} className={isExpiringSoon ? 'text-warning mt-0.5' : 'text-primary mt-0.5'} />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Expires</p>
                <p className={isExpiringSoon ? 'text-warning font-medium' : 'text-gray-800'}>
                  {expiresAt.toLocaleDateString()} at {expiresAt.toLocaleTimeString()}
                </p>
                {isExpiringSoon && (
                  <p className="text-xs text-warning mt-1">This invitation expires soon!</p>
                )}
              </div>
            </div>
          </div>

          <Divider />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              By accepting this invitation, you will join <span className="font-semibold">{invite.groupName}</span>.
              You will need to log in with your Google account to continue.
            </p>
          </div>

          <AcceptInviteButton inviteHash={hash} onSuccess={handleSuccess} />

          <Button
            variant="light"
            onPress={handleGoToLogin}
            className="w-full"
          >
            Cancel
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
