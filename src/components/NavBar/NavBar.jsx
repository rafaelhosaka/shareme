import React from "react";

import "./Navbar.css";
import NavLinkwithToolTip from "../../helper/NavLinkwithToolTip";

function Navbar(props) {
  return (
    <nav className="navbar">
      <div className="navbar-nav">
        <div className="nav-left">
          <a className="logo-container" href="#">
            <img
              className="logo"
              src={require("../../assets/images/logo.png")}
            />
          </a>
          <div onClick={() => {}} className="search-container">
            <i className="search-icon fa-solid fa-magnifying-glass fa-xl"></i>
            <input
              className="search"
              href="#"
              placeholder="Search on Shareme"
            />
          </div>
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
            <img
              className="user-image"
              src={require("../../assets/images/RAFAEL_FOTO.JPG")}
            />
            Rafael
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
