import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import MenuItem from "../../components/MenuList/MenuItem";
import MenuList from "../../components/MenuList/MenuList";
import MenuSeparator from "../../components/MenuList/MenuSeparator";
import { useUser } from "../../context/userContext";
import { GroupEntity } from "../../models/group";
import { getGroupsByUserId } from "../../services/groupService";
import GroupMenuContent from "./GroupMenuContent";

const GroupMenu = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  const [groups, setGroups] = useState<GroupEntity[]>([]);

  useEffect(() => {
    async function getGroups() {
      if (currentUser) {
        const { data } = await getGroupsByUserId(currentUser.id);
        setGroups(data);
      }
    }
    getGroups();
  }, []);

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
          <>
            {groups.map((group) => (
              <MenuItem
                key={group.id}
                active={pathname === `/group/${group.id}`}
              >
                <NavLink to={`/group/${group.id}`}>{group.name}</NavLink>
              </MenuItem>
            ))}
          </>
        </MenuList>
      </div>
    </>
  );
};

export default GroupMenu;
