import { Button } from '@nextui-org/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '~entities/auth/api/authApi';
import { clearSession } from '~entities/session/model/sessionSlice';
import { apiSlice } from '~shared/api/apiSlice';

export const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Step 1: Tell the backend to clear the HttpOnly cookie.
      await logoutMutation().unwrap();

      // Step 2: Clear the frontend's session state in the Redux store.
      dispatch(clearSession());

      // Step 3: Completely wipe the RTK Query cache.
      dispatch(apiSlice.util.resetApiState());

      // Step 4: Redirect to the login page.
      navigate('/login', { replace: true });

    } catch (error) {
      dispatch(clearSession());
      dispatch(apiSlice.util.resetApiState());
      navigate('/login', { replace: true });
    }
  };

  return (
    <Button
      color="danger"
      variant="flat"
      onPress={handleLogout}
      isLoading={isLoading}
      aria-label="Logout"
    >
      Logout
    </Button>
  );
};
