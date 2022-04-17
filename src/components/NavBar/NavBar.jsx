import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavLinkwithToolTip from "../../helper/NavLinkwithToolTip";

import "./Navbar.css";

function Navbar(props) {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearchBar = () => {
    setShowSearch(showSearch ? false : true);
  };

  const getSearchBar = (showSearch) => {
    return showSearch ? (
      <div className="search-container expanded">
        <i
          onClick={() => toggleSearchBar()}
          className="search-icon fa-solid fa-chevron-left fa-xl"
        ></i>
        <input className="search" href="#" placeholder="Search on Shareme" />
      </div>
    ) : (
      <div onClick={() => toggleSearchBar()} className="search-container">
        <i className="search-icon fa-solid fa-magnifying-glass fa-xl"></i>
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-nav">
        <div className="nav-left">
          <Link className="logo-container" to="/">
            <img className="logo" src={"./images/logo.png"} />
          </Link>
          {getSearchBar(showSearch)}
        </div>
        <div className="nav-center">
          <NavLinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-house fa-xl"
            to="/home"
            tooltipLabel="Home"
          />

          <NavLinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-user-group fa-xl"
            to="/friends"
            tooltipLabel="Friends"
          />
          <NavLinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-users-line fa-xl"
            to="/group"
            tooltipLabel="Group"
          />
          <NavLinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-store fa-xl"
            to="/marketplace"
            tooltipLabel="Marketplace"
          />
        </div>
        <div className="nav-right">
          <a className="user" href="#">
            <img className="nav__user-image" src={"./images/RAFAEL_FOTO.JPG"} />
            <span className="nav__user-name">User</span>
          </a>
          <NavLinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-message fa-xl"
            to="/chat"
            tooltipLabel="Chat"
          />
          <NavLinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-bell fa-xl"
            to="/notification"
            tooltipLabel="Notifications"
          />
          <NavLinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-gear fa-xl"
            to="/settings"
            tooltipLabel="Settings"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
