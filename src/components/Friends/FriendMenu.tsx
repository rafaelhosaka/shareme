import { Outlet, useLocation } from "react-router";

import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { getPendingFriendRequest } from "../../services/friendService";
import MenuList from "../MenuList/MenuList";
import MenuItem from "../MenuList/MenuItem";
import css from "./FriendMenu.module.scss";

function FriendMenu() {
  const { user: currentUser } = useUser();
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    async function getFriendRequests() {
      if (currentUser) {
        const { data } = await getPendingFriendRequest(currentUser.id);
        setFriendRequestCount(data.length);
      }
    }
    getFriendRequests();
  }, []);

  return (
    <>
      <main className="container right m2">
        <Outlet context={{ setFriendRequestCount }} />
      </main>
      <div className="left-content">
        <MenuList title="Friends">
          <MenuItem active={pathname === "/friends/all"}>
            <NavLink to={"all"}>All friends</NavLink>
          </MenuItem>
          <MenuItem active={pathname === "/friends/request"}>
            <NavLink className={css["friend-request-link"]} to={"request"}>
              Friend Requests
              {friendRequestCount !== 0 && (
                <span className={css["friend-request-count"]}>
                  {friendRequestCount}
                </span>
              )}
            </NavLink>
          </MenuItem>
        </MenuList>
      </div>
    </>
  );
}

export default FriendMenu;
