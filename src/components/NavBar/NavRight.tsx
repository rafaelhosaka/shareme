import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import useComponentVisible from "../../hook/useComponentVisible";
import NavMenuItem from "../NavMenu/NavMenuItem";
import Spinner from "../Spinner/Spinner";
import css from "./Navbar.module.scss";
import NavMenu from "../NavMenu/NavMenu";
import NavMenuList from "../NavMenu/NavMenuList";
import { updateUser } from "../../services/userService";
import _ from "lodash";
import DivWithToolTip from "../ToolTip/DivWithToolTip";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";
import NotificationList from "../Notification/NotificationList";
import { unreadCount as notificationUnreadCount } from "../../services/notificationService";
import NavLinkWithToolTip from "../ToolTip/NavLinkWithToolTip";
import { useChat } from "../../context/chatContext";
import { fullName } from "../../utils/formatedNames";
import { useStompContext } from "../../context/stompContext";

const NavRight = () => {
  const { t } = useTranslation();
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

  const {
    refs: notificationRefs,
    isComponentVisible: isNotificationVisible,
    setIsComponentVisible: setNotificationVisible,
  } = useComponentVisible(false);

  const [notificationCounter, setNotificationCounter] = useState(0);

  const { chatUnreadCount, updateCounter } = useChat();
  const { receivedNotification, receivedMessage, changeStatus } =
    useStompContext();

  const updateNotificationCounter = (count: number) => {
    setNotificationCounter((prev) => prev + count);
  };

  const [menuId, setMenuId] = useState("1");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  async function getNotificationUnreadCount() {
    if (currentUser) {
      const count = await notificationUnreadCount(currentUser.id);
      setNotificationCounter(count);
    }
  }

  useEffect(() => {
    getNotificationUnreadCount();
  }, []);

  useEffect(() => {
    if (!isMenuVisible) setMenuId("1");
  }, [isMenuVisible]);

  useEffect(() => {
    if (updateCounter) {
      updateCounter();
    }
  }, [receivedMessage]);

  useEffect(() => {
    setNotificationCounter((prev) => prev + 1);
  }, [receivedNotification]);

  const handleThemeChange = async (themeValue: "light" | "dark" | "device") => {
    if (currentUser && setUser) {
      currentUser.themePreference = themeValue;
      const updatedUser = await updateUser(currentUser);
      setMenuId("2");
      setUser(updatedUser);
    }
  };

  const getThemeLabel = (theme: string | undefined) => {
    switch (theme) {
      case "light":
        return t("NAVBAR.light");
      case "dark":
        return t("NAVBAR.dark");
      default:
        return t("NAVBAR.device");
    }
  };

  const handleOnlineChange = async () => {
    if (currentUser && setUser && changeStatus) {
      currentUser.online = !currentUser.online;
      const updatedUser = await updateUser(currentUser);
      setUser(updatedUser);
      changeStatus(updatedUser.id, updatedUser.online);
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
              label={`${fullName(currentUser)}`}
              active={_.startsWith(pathname, `/profile/${currentUser?.id}`)}
            >
              <Spinner show={!userImage} sizeClass="size--40">
                <img
                  className={`${css["user-image"]} size--40`}
                  src={userImage}
                />
              </Spinner>
            </NavMenuItem>
          </Link>
          <div onClick={() => handleOnlineChange()}>
            <NavMenuItem
              iconClass="fa-solid fa-comments fa-xl"
              label={t("NAVBAR.online")}
              boolean={currentUser?.online}
            />
          </div>
          <NavMenuItem
            iconClass="fa-solid fa-palette fa-xl"
            label={`${t("NAVBAR.theme")}: ${getThemeLabel(
              currentUser?.themePreference
            )}`}
            toMenuId="2"
          />
          <NavMenuItem
            iconClass="fa-solid fa-gear fa-xl"
            label={t("NAVBAR.settings")}
            toMenuId="3"
          />
          <Link to="/logout">
            <NavMenuItem
              iconClass="fa-solid fa-right-from-bracket fa-xl"
              label={t("NAVBAR.logout")}
            />
          </Link>
        </NavMenuList>
        <NavMenuList id="2" title={t("NAVBAR.theme")}>
          <div onClick={() => handleThemeChange("light")}>
            <NavMenuItem
              iconClass="fa-solid fa-sun fa-xl"
              active={currentUser?.themePreference === "light"}
              label={t("NAVBAR.light")}
            />
          </div>
          <div onClick={() => handleThemeChange("dark")}>
            <NavMenuItem
              iconClass="fa-solid fa-moon fa-xl"
              active={currentUser?.themePreference === "dark"}
              label={t("NAVBAR.dark")}
            />
          </div>
          <div onClick={() => handleThemeChange("device")}>
            <NavMenuItem
              iconClass="fa-solid fa-desktop fa-xl"
              active={currentUser?.themePreference === "device"}
              label={t("NAVBAR.device")}
            />
          </div>
        </NavMenuList>
        <NavMenuList id="3" title={t("NAVBAR.settings")}>
          <Link to="/settings/general">
            <NavMenuItem
              active={pathname === `/settings/general`}
              iconClass="fa-solid fa-gear fa-xl"
              label={t("NAVBAR.general")}
            />
          </Link>
          <Link to="/settings/language">
            <NavMenuItem
              active={pathname === `/settings/language`}
              iconClass="fa-solid fa-language fa-xl"
              label={t("NAVBAR.language")}
            />
          </Link>
        </NavMenuList>
      </NavMenu>
    );
  };

  const getMenu = () => {
    return (
      <NavMenu currentMenuId="1" mainMenuId="1">
        <NavMenuList id="1">{getCenterMenu()}</NavMenuList>
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
            label={t("NAVBAR.home")}
            active={pathname === "/home"}
          />
        </Link>
        <Link to="/friends/all">
          <NavMenuItem
            iconClass="fa-solid fa-user-group fa-xl"
            label={t("NAVBAR.friends")}
            active={_.startsWith(pathname, "/friends")}
          />
        </Link>
        <Link to="/group">
          <NavMenuItem
            iconClass="fa-solid fa-users-line fa-xl"
            label={t("NAVBAR.group")}
            active={pathname === "/group"}
          />
        </Link>
        <Link to="/marketplace/all">
          <NavMenuItem
            iconClass="fa-solid fa-store fa-xl"
            label={t("NAVBAR.marketplace")}
            active={_.startsWith(pathname, "/market")}
          />
        </Link>
        <Link to="/chat">
          <NavMenuItem
            iconClass="fa-solid fa-comments fa-xl"
            label={t("NAVBAR.chat")}
            active={pathname.startsWith("/chat")}
          />
        </Link>
        <div
          onClick={() => {
            setNotificationVisible(true);
            setCenterMenuVisible(false);
          }}
        >
          <NavMenuItem
            iconClass="fa-solid fa-bell fa-xl"
            label={t("NAVBAR.notifications")}
            active={pathname === "/notifications"}
          ></NavMenuItem>
        </div>
      </>
    );
  };

  return (
    <>
      {isMobile && (
        <DivWithToolTip tooltipLabel={t("NAVBAR.menu")}>
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
      {!isMobile && (
        <>
          <NavLinkWithToolTip
            activeClass={css.active}
            className={css["nav-link"]}
            to="/chat"
            tooltipLabel={t("NAVBAR.chat")}
            startWith="/chat"
          >
            <i className="fas fa-comments fa-xl"></i>
            {chatUnreadCount > 0 && (
              <span className={css["count"]}>{chatUnreadCount}</span>
            )}
          </NavLinkWithToolTip>
          <DivWithToolTip tooltipLabel={t("NAVBAR.notifications")}>
            <div
              className={css["nav-link"]}
              onClick={() => setNotificationVisible(true)}
            >
              <i className="fa-solid fa-bell fa-xl"></i>
              {notificationCounter > 0 && (
                <span className={css["count"]}>{notificationCounter}</span>
              )}
            </div>
          </DivWithToolTip>
        </>
      )}
      {isNotificationVisible && (
        <div
          ref={(element) => (notificationRefs.current[0] = element)}
          className={css["notifications"]}
        >
          <NotificationList updateCount={updateNotificationCounter} />
        </div>
      )}
      <DivWithToolTip tooltipLabel={t("NAVBAR.profile")}>
        <div
          ref={(element) => (menuRefs.current[1] = element)}
          onClick={() => setMenuVisible((prev) => !prev)}
          className={css["user"]}
        >
          <Spinner show={!userImage} sizeClass="size--40">
            <img className={`${css["user-image"]} size--40`} src={userImage} />
          </Spinner>
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
