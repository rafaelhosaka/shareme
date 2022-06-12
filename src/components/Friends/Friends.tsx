import { Outlet } from "react-router";

import css from "./Friends.module.scss";
import { NavLink } from "react-router-dom";

function Friends() {
  const menu = [
    { key: "all", value: "All friends" },
    { key: "request", value: "Friend Requests" },
  ];

  const renderMenu = () => {
    return menu.map((option) => {
      return (
        <NavLink
          key={option.key}
          to={option.key}
          className={({ isActive }) =>
            isActive
              ? `${css["friends-menu__item"]} ${css.active}`
              : css["friends-menu__item"]
          }
        >
          {option.value}
        </NavLink>
      );
    });
  };

  return (
    <>
      <main className="container right">
        <Outlet />
      </main>
      <div className="left-content">
        <div className={css["friends-menu__container"]}>
          <h1 className={css["friends-menu__heading"]}>Friends</h1>
          <div className={css["friends-menu__list"]}>{renderMenu()}</div>
        </div>
      </div>
    </>
  );
}

export default Friends;
