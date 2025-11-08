import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Card, CardBody } from '@nextui-org/react';
import { RootState } from '~app/store';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.session);

  const getDashboardPath = () => {
    if (!user) return '/login';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center py-12 px-6">
          <div className="mb-6">
            <p className="text-8xl font-bold text-danger">403</p>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. This area is restricted to users with specific roles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              color="primary"
              onPress={() => navigate(getDashboardPath())}
            >
              Go to Dashboard
            </Button>
            <Button
              color="default"
              variant="flat"
              onPress={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
