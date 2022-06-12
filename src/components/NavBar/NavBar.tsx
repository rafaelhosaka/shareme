import { Link, NavLink } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import { useNavigate } from "react-router";
import Spinner from "../Spinner/Spinner";
import NavLinkWithToolTip from "../NavLinkWithToolTip/NavLinkWithToolTip";

import css from "./Navbar.module.scss";
import SearchBar from "../SearchBar/SearchBar";

function Navbar() {
  const { user: currentUser } = useUser();
  const userImage = useUserImage();

  const navigate = useNavigate();

  const handleSubmit = (searchQuery: string) => {
    navigate(`/search/people?q=${searchQuery}`);
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
          <SearchBar
            placeHolder="Search on Shareme"
            onSubmit={handleSubmit}
            expandable={true}
          />
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
