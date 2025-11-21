import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '~app/store';
import { UserRole } from '~entities/user/model/types';
import { LogoutButton } from '~features/auth/logout';

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

export const AppNavbar = () => {
  const { user } = useSelector((state: RootState) => state.session);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      className="bg-white"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-xl text-primary">Plast-Proba</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name={user.name}
              size="sm"
              src={user.picture}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-default-500">{user.email}</p>
            </DropdownItem>
            <DropdownItem key="role" className="h-10 gap-2">
              <p className="text-sm">Role: {user.role}</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              <LogoutButton variant="light" color="danger" className="w-full justify-start p-0" />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        {visibleItems.map((item) => (
          <NavbarMenuItem key={item.path}>
            <NavLink
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `w-full text-lg py-2 ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
