import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody } from '@nextui-org/react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center py-12 px-6">
          <div className="mb-6">
            <p className="text-8xl font-bold text-primary">404</p>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              color="primary"
              onPress={() => navigate('/dashboard')}
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
