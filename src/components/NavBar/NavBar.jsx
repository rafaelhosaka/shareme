import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import NavLinkwithToolTip from "../../helper/NavLinkwithToolTip";
import { userImageDownload } from "../../services/userService";
import { useBase64Image } from "../../hook/useBase64Image";
import "./Navbar.css";
import UserContext from "../../context/userContext";

function Navbar(props) {
  const [showSearch, setShowSearch] = useState(false);
  const currentUser = useContext(UserContext);
  const userProfileImage = useBase64Image(userImageDownload(currentUser.id));

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
            <img
              className="logo"
              src={process.env.PUBLIC_URL + "/images/logo.png"}
            />
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
            to="/friends/all"
            end
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
          <NavLink className="user" to="/profile/posts">
            <img className="nav__user-image" src={userProfileImage} />
            <span className="nav__user-name">{currentUser.firstName}</span>
          </NavLink>
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
