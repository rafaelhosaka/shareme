import React from "react";
import { Link, NavLink } from "react-router-dom";
import NavLinkwithToolTip from "../../helper/NavLinkwithToolTip";
import "./Navbar.css";
import { useUser, useUserImage } from "../../context/userContext";
import { useToggle } from "../../hook/useToggle";

function Navbar(props) {
  const [showSearch, toggleSearch] = useToggle(false);
  const { user: currentUser } = useUser();
  const userImage = useUserImage();

  const getSearchBar = (showSearch) => {
    return showSearch ? (
      <div className="search-container expanded">
        <i
          onClick={toggleSearch}
          className="search-icon fa-solid fa-chevron-left fa-xl"
        ></i>
        <input className="search" href="#" placeholder="Search on Shareme" />
      </div>
    ) : (
      <div onClick={toggleSearch} className="search-container">
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
          <NavLink className="user" to={`/profile/${currentUser.id}`}>
            <img className="nav__user-image" src={userImage} />
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
            faClasses="fa-solid fa-right-from-bracket fa-xl"
            to="/logout"
            tooltipLabel="Logout"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
