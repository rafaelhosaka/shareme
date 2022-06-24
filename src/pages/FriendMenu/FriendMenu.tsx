import { useLocation } from "react-router";

import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { getPendingFriendRequest } from "../../services/friendService";
import MenuList from "../../components/MenuList/MenuList";
import MenuItem from "../../components/MenuList/MenuItem";
import css from "./FriendMenu.module.scss";
import FriendMenuContent from "./FriendMenuContent";

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
        <FriendMenuContent setRequestCount={setFriendRequestCount} />
      </main>
      <div className="left-content">
        <MenuList title="Friends">
          <MenuItem active={pathname === "/friends/all"}>
            <NavLink to={"/friends/all"}>All friends</NavLink>
          </MenuItem>
          <MenuItem active={pathname === "/friends/request"}>
            <NavLink
              className={css["friend-request-link"]}
              to={"/friends/request"}
            >
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
