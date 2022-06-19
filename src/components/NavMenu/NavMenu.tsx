import React, { ReactElement, useEffect, useState } from "react";
import { NavMenuListProps, NavMenuProps } from "../../models/navMenu";

function NavMenu({ children, currentMenuId, mainMenuId }: NavMenuProps) {
  const [menuDisplay, setMenuDisplay] =
    useState<ReactElement<NavMenuListProps>>();
  const [currentId, setCurrentId] = useState(currentMenuId);
  const [isMain, setIsMain] = useState(true);

  function addFunctions(menuDisplay: ReactElement, isMain: boolean) {
    return React.cloneElement(menuDisplay, {
      redirectToMenu: redirectToMenu,
      back: back,
      isMain: isMain,
    });
  }

  const redirectToMenu = (menuId: string | undefined) => {
    if (menuId) {
      const menu = children?.find((menuList) => menuList.props.id === menuId);
      if (menu) {
        setIsMain(false);
        setCurrentId(menuId);
        setMenuDisplay(addFunctions(menu, false));
      }
    }
  };

  const back = () => {
    const menu = children?.find((menuList) => menuList.props.id === mainMenuId);
    if (menu) {
      setCurrentId(mainMenuId);
      setIsMain(true);
      setMenuDisplay(addFunctions(menu, true));
    }
  };

  useEffect(() => {
    const menu = children?.find((menuList) => menuList.props.id === currentId);
    if (menu) {
      setMenuDisplay(addFunctions(menu, isMain));
    }
  }, [children]);

  return <>{menuDisplay}</>;
}

export default NavMenu;
