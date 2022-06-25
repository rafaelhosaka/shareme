import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import useComponentVisible from "../../hook/useComponentVisible";
import NavMenuItem from "../NavMenu/NavMenuItem";
import Spinner from "../Spinner/Spinner";
import NavLinkWithToolTip from "../ToolTip/NavLinkWithToolTip";
import css from "./Navbar.module.scss";
import NavMenu from "../NavMenu/NavMenu";
import NavMenuList from "../NavMenu/NavMenuList";
import { updateUser } from "../../services/userService";
import _ from "lodash";
import DivWithToolTip from "../ToolTip/DivWithToolTip";
import { useMediaQuery } from "react-responsive";

const NavRight = () => {
  const { user: currentUser, setUser } = useUser();
  const userImage = useUserImage();
  const { pathname } = useLocation();

  const {
    refs: menuRefs,
    isComponentVisible: isMenuVisible,
    setIsComponentVisible: setMenuVisible,
  } = useComponentVisible(false);

  const {
    refs: centerMenuRefs,
    isComponentVisible: isCenterMenuVisible,
    setIsComponentVisible: setCenterMenuVisible,
  } = useComponentVisible(false);

  const [menuId, setMenuId] = useState("1");

  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  useEffect(() => {
    if (!isMenuVisible) setMenuId("1");
  }, [isMenuVisible]);

  const handleThemeChange = async (themeValue: "light" | "dark" | "device") => {
    if (currentUser && setUser) {
      currentUser.themePreference = themeValue;
      const updatedUser = await updateUser(currentUser);
      setMenuId("2");
      setUser(updatedUser);
    }
  };

  const getProfileMenu = () => {
    return (
      <NavMenu currentMenuId={menuId} mainMenuId="1">
        <NavMenuList id="1">
          <Link
            to={`/profile/${currentUser?.id}/posts`}
            onClick={() => setMenuVisible(false)}
          >
            <NavMenuItem
              label={`${currentUser?.fullName}`}
              active={_.startsWith(pathname, `/profile/${currentUser?.id}`)}
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
            </NavMenuItem>
          </Link>
          <NavMenuItem
            iconClass="fa-solid fa-palette fa-xl"
            label={`Theme: ${currentUser?.themePreference}`}
            toMenuId="2"
          />
          <Link to="/logout">
            <NavMenuItem
              iconClass="fa-solid fa-right-from-bracket fa-xl"
              label="Logout"
            />
          </Link>
        </NavMenuList>
        <NavMenuList id="2" title="Theme">
          <div onClick={() => handleThemeChange("light")}>
            <NavMenuItem
              iconClass="fa-solid fa-sun fa-xl"
              active={currentUser?.themePreference === "light"}
              label="Light"
            />
          </div>
          <div onClick={() => handleThemeChange("dark")}>
            <NavMenuItem
              iconClass="fa-solid fa-moon fa-xl"
              active={currentUser?.themePreference === "dark"}
              label="Dark"
            />
          </div>
          <div onClick={() => handleThemeChange("device")}>
            <NavMenuItem
              iconClass="fa-solid fa-desktop fa-xl"
              active={currentUser?.themePreference === "device"}
              label="Device"
            />
          </div>
        </NavMenuList>
      </NavMenu>
    );
  };

  const getMenu = () => {
    return (
      <NavMenu currentMenuId="1" mainMenuId="1">
        <NavMenuList id="1">
          {isMobile ? getCenterMenu() : <></>}
          {!isDesktop ? getRightMenu() : <></>}
        </NavMenuList>
        <NavMenuList id="2" />
      </NavMenu>
    );
  };

  const getCenterMenu = () => {
    return (
      <>
        <Link to="/home">
          <NavMenuItem
            iconClass="fa-solid fa-house fa-xl"
            label="Home"
            active={pathname === "/home"}
          />
        </Link>
        <Link to="/friends/all">
          <NavMenuItem
            iconClass="fa-solid fa-user-group fa-xl"
            label="Frinds"
            active={_.startsWith(pathname, "/friends")}
          />
        </Link>
        <Link to="/group">
          <NavMenuItem
            iconClass="fa-solid fa-users-line fa-xl"
            label="Group"
            active={pathname === "/group"}
          />
        </Link>
        <Link to="/market">
          <NavMenuItem
            iconClass="fa-solid fa-store fa-xl"
            label="MarketPlace"
            active={pathname === "/market"}
          />
        </Link>
      </>
    );
  };

  const getRightMenu = () => {
    return (
      <>
        <Link to="/chat">
          <NavMenuItem
            iconClass="fa-solid fa-message fa-xl"
            label="Chat"
            active={pathname === "/chat"}
          />
        </Link>
        <Link to="/notifications">
          <NavMenuItem
            iconClass="fa-solid fa-bell fa-xl"
            label="Notifications"
            active={pathname === "/notifications"}
          />
        </Link>
      </>
    );
  };

  return (
    <>
      {!isDesktop && (
        <DivWithToolTip tooltipLabel="Menu">
          <div
            ref={(element) => (centerMenuRefs.current[1] = element)}
            onClick={() => setCenterMenuVisible((prev) => !prev)}
            className={
              isCenterMenuVisible
                ? `${css["nav-link"]} ${css["active"]}`
                : css["nav-link"]
            }
          >
            <i className="fa-solid fa-bars fa-xl"></i>
          </div>
        </DivWithToolTip>
      )}
      {isDesktop && (
        <>
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
            to="/notifications"
            tooltipLabel="Notifications"
          >
            <i className="fa-solid fa-bell fa-xl"></i>
          </NavLinkWithToolTip>
        </>
      )}
      <DivWithToolTip tooltipLabel="Profile">
        <div
          ref={(element) => (menuRefs.current[1] = element)}
          onClick={() => setMenuVisible((prev) => !prev)}
          className={css["user"]}
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
        </div>
      </DivWithToolTip>

      <div
        ref={(element) => (menuRefs.current[0] = element)}
        className={css.menu}
      >
        {isMenuVisible && getProfileMenu()}
      </div>

      <div
        ref={(element) => (centerMenuRefs.current[0] = element)}
        className={css.menu}
      >
        {isCenterMenuVisible && getMenu()}
      </div>
    </>
  );
};

export default NavRight;
