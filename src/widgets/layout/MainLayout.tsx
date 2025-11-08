import { ReactNode, useState } from 'react';
import { Button } from '@nextui-org/react';
import { IconMenu2 } from '@tabler/icons-react';
import { AppNavbar } from '~widgets/navbar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col w-full relative">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className={`relative z-10 ${isSidebarOpen ? 'pointer-events-none' : ''}`}>
          <AppNavbar
            leftContent={
              <Button
                isIconOnly
                variant="light"
                onPress={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
                className="pointer-events-auto"
              >
                <IconMenu2 size={24} />
              </Button>
            }
          />
        </div>

        <main className={`container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl relative z-10 ${isSidebarOpen ? 'pointer-events-none' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
