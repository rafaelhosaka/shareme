import { ReactElement } from "react";

export interface NavMenuProps {
  children?: ReactElement<MenuListProps>[];
  currentMenuId: string;
  mainMenuId: string;
}

export interface MenuListProps {
  id: string;
  title?: string;
  children?: ReactElement<MenuItemProps> | ReactElement<MenuItemProps>[];
  redirectToMenu?: (menuId: string | undefined) => void;
  back?: () => void;
  isMain?: boolean;
}

export interface MenuItemProps {
  label: string;
  iconClass?: string;
  toMenuId?: string;
  redirectToMenu?: (menuId: string | undefined) => void;
  active?: boolean;
  children?: ReactElement | ReactElement[];
}

export function isMenuItemProps(obj: any) {
  return obj?.props?.label;
}
