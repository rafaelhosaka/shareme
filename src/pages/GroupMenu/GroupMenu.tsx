import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import MenuItem from "../../components/MenuList/MenuItem";
import MenuList from "../../components/MenuList/MenuList";
import MenuSeparator from "../../components/MenuList/MenuSeparator";
import GroupMenuContent from "./GroupMenuContent";

const GroupMenu = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <main className="container right m2">
        <GroupMenuContent />
      </main>
      <div className="left-content">
        <MenuList title={t("GROUP.header")}>
          <MenuItem active={pathname === "/group/feed"}>
            <NavLink to={"/group/feed"}>{t("GROUP.feed")}</NavLink>
          </MenuItem>
          <MenuItem active={pathname === "/group/create"}>
            <NavLink to={"/group/create"}>{t("GROUP.createGroup")}</NavLink>
          </MenuItem>
          <MenuItem active={pathname === "/group/search"}>
            <NavLink to={"/group/search"}>{t("GROUP.search")}</NavLink>
          </MenuItem>
          <MenuSeparator title={t("GROUP.joinedGroups")} />
        </MenuList>
      </div>
    </>
  );
};

export default GroupMenu;
