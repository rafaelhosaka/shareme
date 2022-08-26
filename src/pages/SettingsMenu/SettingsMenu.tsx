import MenuList from "../../components/MenuList/MenuList";
import MenuItem from "../../components/MenuList/MenuItem";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SettingsMenu = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <>
      <main className="container right m2">
        <Outlet />
      </main>
      <div className="left-content">
        <MenuList title={t("SETTINGS.settings")}>
          <MenuItem active={pathname === "/settings/general"}>
            <NavLink to={"general"}>{t("SETTINGS.general")}</NavLink>
          </MenuItem>
          <MenuItem active={pathname === "/settings/language"}>
            <NavLink to={"language"}>{t("SETTINGS.language")}</NavLink>
          </MenuItem>
        </MenuList>
      </div>
    </>
  );
};

export default SettingsMenu;
