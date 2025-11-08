import { ReactNode } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { useSelector } from 'react-redux';
import { RootState } from '~app/store';
import { LogoutButton } from '~features/auth/logout';

interface AppNavbarProps {
  leftContent?: ReactNode;
}

export const AppNavbar = ({ leftContent }: AppNavbarProps) => {
  const { user } = useSelector((state: RootState) => state.session);

  if (!user) return null;

  return (
    <Navbar isBordered maxWidth="full" className="bg-white">
      <NavbarContent justify="start">
        {leftContent}
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
    </Navbar>
  );
};
