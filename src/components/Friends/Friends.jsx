import React from "react";
import { Outlet } from "react-router";

import "./Friends.css";
import { NavLink } from "react-router-dom";

function Friends(props) {
  return (
    <>
      <main className="container">
        <Outlet />
      </main>
      <div className="left-content">
        <div className="friends-menu__container">
          <h1 className="friends-menu__heading">Friends</h1>
          <div className="friends-menu__list">
            <NavLink to="all" className="friends-menu__item">
              All friends
            </NavLink>
            <NavLink to="request" className="friends-menu__item">
              Friend Requests
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Friends;
