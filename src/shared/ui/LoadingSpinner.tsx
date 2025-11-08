import { Spinner } from '@nextui-org/react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ message, size = 'lg', fullScreen = false }: LoadingSpinnerProps) => {
  const containerClass = fullScreen
    ? 'flex flex-col items-center justify-center gap-4 min-h-screen'
    : 'flex flex-col items-center justify-center gap-4 p-8';

  return (
    <div className={containerClass}>
      <Spinner size={size} color="primary" />
      {message && <p className="text-gray-600 text-center">{message}</p>}
    </div>
  );
};
