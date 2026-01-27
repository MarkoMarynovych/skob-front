import { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NextUIProvider } from '@nextui-org/react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { store } from '~app/store';
import { router } from '~app/router';
import { useGetMeQuery } from '~entities/auth/api/authApi';
import { setCredentials, clearSession } from '~entities/session/model/sessionSlice';
import { useAcceptInviteByTokenMutation, useJoinGroupMutation } from '~entities/invite';
import { ErrorBoundary } from '~shared/lib/ErrorBoundary';
import { LoadingSpinner } from '~shared/ui/LoadingSpinner';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError, refetch } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [joinGroup] = useJoinGroupMutation();
  const [acceptInvite] = useAcceptInviteByTokenMutation();
  const [isSessionReady, setIsSessionReady] = useState(false);

  // Set credentials and mark session as ready BEFORE rendering children
  useLayoutEffect(() => {
    if (!isLoading) {
      if (user && !isError) {
        store.dispatch(setCredentials({ user }));
      } else if (isError) {
        store.dispatch(clearSession());
      }
      setIsSessionReady(true);
    }
  }, [user, isLoading, isError]);

  // Handle pending invites after session is ready
  useEffect(() => {
    if (isSessionReady && user && !isError) {
      const pendingInviteToken = localStorage.getItem('pendingInviteToken');
      if (pendingInviteToken) {
        localStorage.removeItem('pendingInviteToken');

        const handleInvite = async () => {
          try {
            let response;

            try {
              response = await joinGroup(pendingInviteToken).unwrap();
            } catch (groupError) {
              response = await acceptInvite(pendingInviteToken).unwrap();
            }

            if (response.groupName) {
              toast.success(`Successfully joined ${response.groupName}!`);
            } else if (response.kurinName) {
              toast.success(`Successfully joined ${response.kurinName}!`);
            } else {
              toast.success(response.message || 'Invitation accepted successfully!');
            }
            refetch();
          } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'data' in err
              ? ((err as { data?: { message?: string } }).data?.message || 'Failed to accept invitation')
              : 'Failed to accept invitation';
            toast.error(errorMessage);
          }
        };

        handleInvite();
      }
    }
  }, [isSessionReady, user, isError, joinGroup, acceptInvite, refetch]);

  // Don't render children until session state is determined and Redux is updated
  if (isLoading || !isSessionReady) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
};

export const AppProviders = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <NextUIProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                },
                error: {
                  duration: 5000,
                },
              }}
            />
          </AuthProvider>
        </NextUIProvider>
      </Provider>
    </ErrorBoundary>
  );
};
