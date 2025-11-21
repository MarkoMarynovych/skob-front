import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardBody, Button } from '@nextui-org/react';
import { RootState } from '~app/store';
import { useAcceptInviteByTokenMutation, useJoinGroupMutation } from '~entities/invite';
import { LoadingSpinner, ErrorMessage } from '~shared/ui';
import toast from 'react-hot-toast';
import { IconAlertCircle, IconLogin } from '@tabler/icons-react';

export const JoinPage = () => {
  const { inviteToken } = useParams<{ inviteToken: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.session);
  const [joinGroup, { isLoading: isJoiningGroup }] = useJoinGroupMutation();
  const [acceptInvite, { isLoading: isAcceptingInvite }] = useAcceptInviteByTokenMutation();
  const [error, setError] = useState<string | null>(null);
  const isLoading = isJoiningGroup || isAcceptingInvite;

  useEffect(() => {
    if (!inviteToken) {
      setError('Invalid invite link');
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem('pendingInviteToken', inviteToken);
      toast('Please log in to accept this invitation', { icon: '🔑' });
      navigate('/login', { replace: true });
      return;
    }

    const acceptInviteHandler = async () => {
      try {
        let response;

        try {
          response = await joinGroup(inviteToken).unwrap();
        } catch (groupError) {
          response = await acceptInvite(inviteToken).unwrap();
        }

        if (response.groupName) {
          toast.success(`Successfully joined ${response.groupName}!`);
        } else if (response.kurinName) {
          toast.success(`Successfully joined ${response.kurinName}!`);
        } else {
          toast.success(response.message || 'Invitation accepted successfully!');
        }

        navigate('/dashboard', { replace: true });
      } catch (err) {
        const errorMessage = err && typeof err === 'object' && 'data' in err
          ? ((err as { data?: { message?: string } }).data?.message || 'Failed to accept invitation')
          : 'Failed to accept invitation';
        setError(errorMessage);
      }
    };

    acceptInviteHandler();
  }, [inviteToken, isAuthenticated, navigate, joinGroup, acceptInvite]);

  if (!inviteToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardBody className="gap-4 p-8">
            <div className="flex items-center gap-3 text-danger">
              <IconAlertCircle size={24} />
              <h2 className="text-xl font-semibold">Invalid Invitation Link</h2>
            </div>
            <p className="text-gray-600">This invitation link is invalid or malformed.</p>
            <Button color="primary" onPress={() => navigate('/login')} startContent={<IconLogin size={18} />}>
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
            <LoadingSpinner message="Accepting invitation..." />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardBody className="gap-6 p-8">
            <div className="flex items-center gap-3 text-danger">
              <IconAlertCircle size={24} />
              <h2 className="text-xl font-semibold">Error Accepting Invitation</h2>
            </div>
            <ErrorMessage message={error} />
            <div className="flex gap-2">
              <Button color="primary" onPress={() => navigate('/dashboard')} className="flex-1">
                Go to Dashboard
              </Button>
              <Button variant="flat" onPress={() => navigate('/login')} className="flex-1">
                Login
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return null;
};
