import { Link } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import { useNavigate } from "react-router";
import Spinner from "../Spinner/Spinner";
import NavLinkWithToolTip from "../ToolTip/NavLinkWithToolTip";

import css from "./Navbar.module.scss";
import SearchBar from "../SearchBar/SearchBar";
import DivWithToolTip from "../ToolTip/DivWithToolTip";
import MenuList from "../Menu/MenuList";
import MenuItem from "../Menu/MenuItem";
import NavMenu from "../Menu/NavMenu";
import useComponentVisible from "../../hook/useComponentVisible";
import { updateUser } from "../../services/userService";
import { useEffect, useState } from "react";

function Navbar() {
  const { user: currentUser, setUser } = useUser();
  const userImage = useUserImage();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [menuId, setMenuId] = useState("1");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isComponentVisible) setMenuId("1");
  }, [isComponentVisible]);

  const handleThemeChange = async (themeValue: "light" | "dark" | "device") => {
    if (currentUser && setUser) {
      currentUser.themePreference = themeValue;
      const updatedUser = await updateUser(currentUser);
      setMenuId("2");
      setUser(updatedUser);
    }
  };

  const handleSubmit = (searchQuery: string) => {
    navigate(`/search/people?q=${searchQuery}`);
  };

  const getMenu = () => {
    return (
      <NavMenu currentMenuId={menuId} mainMenuId="1">
        <MenuList id="1" title="Settings">
          <MenuItem
            iconClass="fa-solid fa-palette fa-xl"
            label={`Theme: ${currentUser?.themePreference}`}
            toMenuId="2"
          />
          <Link to="/logout">
            <MenuItem
              iconClass="fa-solid fa-right-from-bracket fa-xl"
              label="Logout"
            />
          </Link>
        </MenuList>
        <MenuList id="2" title="Theme">
          <div onClick={() => handleThemeChange("light")}>
            <MenuItem
              iconClass="fa-solid fa-sun fa-xl"
              active={currentUser?.themePreference === "light"}
              label="Light"
            />
          </div>
          <div onClick={() => handleThemeChange("dark")}>
            <MenuItem
              iconClass="fa-solid fa-moon fa-xl"
              active={currentUser?.themePreference === "dark"}
              label="Dark"
            />
          </div>
          <div onClick={() => handleThemeChange("device")}>
            <MenuItem
              iconClass="fa-solid fa-desktop fa-xl"
              active={currentUser?.themePreference === "device"}
              label="Device"
            />
          </div>
        </MenuList>
      </NavMenu>
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
            to="/home"
            tooltipLabel="Home"
          >
            <i className="fa-solid fa-house fa-xl active"></i>
          </NavLinkWithToolTip>

          <NavLinkWithToolTip
            activeClass={css.active}
            className={`${css["nav-link"]}`}
            to="/friends/all"
            activeURLs={["/friends/all", "/friends/request"]}
            tooltipLabel="Friends"
          >
            <i className="fa-solid fa-user-group fa-xl"></i>
          </NavLinkWithToolTip>
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            to="/group"
            tooltipLabel="Group"
          >
            <i className="fa-solid fa-users-line fa-xl"></i>
          </NavLinkWithToolTip>
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            to="/marketplace"
            tooltipLabel="Marketplace"
          >
            <i className="fa-solid fa-store fa-xl"></i>
          </NavLinkWithToolTip>
        </div>
        <div className={css["nav-right"]}>
          <NavLinkWithToolTip
            activeClass={css["active-user"]}
            className={css["user"]}
            to={`/profile/${currentUser?.id}/posts`}
            tooltipLabel="Profile Page"
            activeURLs={[
              `/profile/${currentUser?.id}`,
              `/profile/${currentUser?.id}/posts`,
              `/profile/${currentUser?.id}/friends`,
              `/profile/${currentUser?.id}/photos`,
              `/profile/${currentUser?.id}/videos`,
            ]}
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
          </NavLinkWithToolTip>
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            to="/chat"
            tooltipLabel="Chat"
          >
            <i className="fa-solid fa-message fa-xl"></i>
          </NavLinkWithToolTip>
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            to="/notification"
            tooltipLabel="Notifications"
          >
            <i className="fa-solid fa-bell fa-xl"></i>
          </NavLinkWithToolTip>

          <div onClick={() => setIsComponentVisible((prev) => !prev)}>
            <DivWithToolTip
              className={`${css["nav-link"]} ${
                isComponentVisible ? css.active : ""
              }`}
              tooltipLabel="Setting"
            >
              <i className="fa-solid fa-bars fa-xl"></i>
            </DivWithToolTip>
          </div>
          <div ref={ref} className={css.menu}>
            {isComponentVisible && getMenu()}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
