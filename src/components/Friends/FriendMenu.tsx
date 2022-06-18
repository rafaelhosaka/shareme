import { Outlet } from "react-router";

import css from "./FriendMenu.module.scss";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { getPendingFriendRequest } from "../../services/friendService";

function FriendMenu() {
  const { user: currentUser } = useUser();
  const [friendRequestCount, setFriendRequestCount] = useState(0);

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
      <main className="container right">
        <Outlet context={{ setFriendRequestCount }} />
      </main>
      <div className="left-content">
        <div className={css["friends-menu__container"]}>
          <h1 className={css["friends-menu__heading"]}>Friends</h1>
          <div className={css["friends-menu__list"]}>
            <NavLink
              to={"all"}
              className={({ isActive }) =>
                isActive
                  ? `${css["friends-menu__item"]} ${css.active}`
                  : css["friends-menu__item"]
              }
            >
              All friends
            </NavLink>
            <NavLink
              to={"request"}
              className={({ isActive }) =>
                isActive
                  ? `${css["friends-menu__item"]} ${css.active}`
                  : css["friends-menu__item"]
              }
            >
              Friend Requests
              {friendRequestCount !== 0 && <span>{friendRequestCount}</span>}
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default FriendMenu;
