import MenuList from "../../components/MenuList/MenuList";
import MenuItem from "../../components/MenuList/MenuItem";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const SettingsMenu = () => {
  const { pathname } = useLocation();

  return (
    <>
      <main className="container right m2">
        <Outlet />
      </main>
      <div className="left-content">
        <MenuList title="Settings">
          <MenuItem active={pathname === "/settings/general"}>
            <NavLink to={"general"}>General</NavLink>
          </MenuItem>
          <MenuItem active={pathname === "/settings/language"}>
            <NavLink to={"language"}>Language</NavLink>
          </MenuItem>
        </MenuList>
      </div>
    </>
  );
};

export default SettingsMenu;
