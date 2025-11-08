import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@nextui-org/react';
import { IconX } from '@tabler/icons-react';
import { RootState } from '~app/store';
import { UserRole } from '~entities/user/model/types';

interface NavItem {
  path: string;
  label: string;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  {
    path: '/my-progress',
    label: 'Мій Прогрес',
    roles: [UserRole.SCOUT, UserRole.FOREMAN],
  },
  {
    path: '/my-groups',
    label: 'Мої Гуртки',
    roles: [UserRole.FOREMAN, UserRole.LIAISON],
  },
  {
    path: '/my-kurin',
    label: 'Мій Курінь',
    roles: [UserRole.LIAISON],
  },
  {
    path: '/admin-dashboard',
    label: 'Адмін Панель',
    roles: [UserRole.ADMIN],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useSelector((state: RootState) => state.session);

  if (!user) return null;

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <p className="font-bold text-lg text-primary">Навігація</p>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={onClose}
            aria-label="Close menu"
          >
            <IconX size={20} />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
