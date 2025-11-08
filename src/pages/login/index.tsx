import { Button, Card, CardBody } from '@nextui-org/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '~app/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardBody className="gap-6 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Plast-Proba</h1>
            <p className="mt-2 text-gray-600">Scout Management System</p>
          </div>

          <Button
            color="primary"
            size="lg"
            className="w-full"
            onPress={handleGoogleLogin}
          >
            Login with Google
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
