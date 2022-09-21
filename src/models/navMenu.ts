import { ReactElement } from "react";

export interface NavMenuProps {
  children?: ReactElement<NavMenuListProps>[];
  currentMenuId: string;
  mainMenuId: string;
}

export interface NavMenuListProps {
  id: string;
  title?: string;
  children?: ReactElement<NavMenuItemProps> | ReactElement<NavMenuItemProps>[];
  redirectToMenu?: (menuId: string | undefined) => void;
  back?: () => void;
  isMain?: boolean;
}

export interface NavMenuItemProps {
  label: string;
  iconClass?: string;
  toMenuId?: string;
  redirectToMenu?: (menuId: string | undefined) => void;
  active?: boolean;
  children?: ReactElement | ReactElement[];
  boolean?: boolean | undefined;
}

export function isMenuItemProps(obj: any) {
  return obj?.props?.label;
}
