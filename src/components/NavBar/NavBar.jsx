import React from "react";

import "./Navbar.css";
import LinkwithToolTip from "../../helper/LinkwithToolTip";

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
          <div className="search-container">
            <i className="search-icon fa-solid fa-magnifying-glass fa-xl"></i>
            <input
              className="search"
              href="#"
              placeholder="Search on Shareme"
            />
          </div>
        </div>
        <div className="nav-center">
          <LinkwithToolTip
            className="nav-link active"
            faClasses="fa-solid fa-house fa-xl"
            to="#"
            tooltipLabel="Home"
          />
          <LinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-user-group fa-xl"
            to="#"
            tooltipLabel="Friends"
          />
          <LinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-users-line fa-xl"
            to="#"
            tooltipLabel="Group"
          />
          <LinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-store fa-xl"
            to="#"
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
          <LinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-message fa-xl"
            to="#"
            tooltipLabel="Chat"
          />
          <LinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-bell fa-xl"
            to="#"
            tooltipLabel="Notifications"
          />
          <LinkwithToolTip
            className="nav-link"
            faClasses="fa-solid fa-gear fa-xl"
            to="#"
            tooltipLabel="Settings"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
