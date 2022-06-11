import React, { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import { useToggle } from "../../hook/useToggle";
import { useNavigate } from "react-router";
import Spinner from "../Spinner/Spinner";
import NavLinkWithToolTip from "../NavLinkWithToolTip/NavLinkWithToolTip";

import css from "./Navbar.module.scss";

function Navbar() {
  const [showSearch, toggleSearch] = useToggle(false);
  const { user: currentUser } = useUser();
  const userImage = useUserImage();
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showSearch) {
      searchRef?.current?.focus();
    }
  }, [showSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef?.current?.value) {
      navigate(`/search/people?q=${searchRef.current.value}`);
    }
  };

  const getSearchBar = () => {
    return showSearch ? (
      <div className={`${css["search-container"]} ${css.expanded}`}>
        <form className={css["search__form"]} onSubmit={(e) => handleSubmit(e)}>
          <i
            onClick={toggleSearch}
            className={`${css["search-icon"]} fa-solid fa-chevron-left fa-xl m1`}
          ></i>

          <input
            ref={searchRef}
            className={`${css.search} p1`}
            placeholder="Search on Shareme"
          />
        </form>
      </div>
    ) : (
      <div onClick={toggleSearch} className={`${css["search-container"]} p1`}>
        <i
          className={`${css["search-icon"]} fa-solid fa-magnifying-glass fa-xl`}
        ></i>
      </div>
    );
  };

  return (
    <nav className={css.navbar}>
      <div className={css["navbar-nav"]}>
        <div className={css["nav-left"]}>
          <Link className={css["logo-container"]} to="/">
            <img
              className={css.logo}
              src={process.env.PUBLIC_URL + "/images/logo.png"}
            />
          </Link>
          {getSearchBar()}
        </div>
        <div className={css["nav-center"]}>
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            faClasses="fa-solid fa-house fa-xl active"
            to="/home"
            tooltipLabel="Home"
          />

          <NavLinkWithToolTip
            activeClass={css.active}
            className={`${css["nav-link"]}`}
            faClasses="fa-solid fa-user-group fa-xl"
            to="/friends/all"
            end
            tooltipLabel="Friends"
          />
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            faClasses="fa-solid fa-users-line fa-xl"
            to="/group"
            tooltipLabel="Group"
          />
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            faClasses="fa-solid fa-store fa-xl"
            to="/marketplace"
            tooltipLabel="Marketplace"
          />
        </div>
        <div className={css["nav-right"]}>
          <NavLink
            className={({ isActive }) =>
              isActive ? `${css.user} ${css["active-user"]}` : css.user
            }
            to={`/profile/${currentUser?.id}/posts`}
          >
            <Spinner
              show={!userImage}
              sizeClass="size--40"
              fragment={
                <img
                  className={`${css["user-image"]} size--40`}
                  src={userImage}
                />
              }
            />
            <span className={css["user-name"]}>{currentUser?.firstName}</span>
          </NavLink>
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            faClasses="fa-solid fa-message fa-xl"
            to="/chat"
            tooltipLabel="Chat"
          />
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            faClasses="fa-solid fa-bell fa-xl"
            to="/notification"
            tooltipLabel="Notifications"
          />
          <NavLinkWithToolTip
            className={css["nav-link"]}
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
