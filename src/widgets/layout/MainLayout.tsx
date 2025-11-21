import { ReactNode } from 'react';
import { AppNavbar } from '~widgets/navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
};
