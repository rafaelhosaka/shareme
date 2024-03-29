import { useTranslation } from "react-i18next";
import NavLinkWithToolTip from "../ToolTip/NavLinkWithToolTip";
import css from "./Navbar.module.scss";

const NavCenter = () => {
  const { t } = useTranslation();

  return (
    <>
      <NavLinkWithToolTip
        activeClass={css.active}
        className={css["nav-link"]}
        to="/home"
        tooltipLabel={t("NAVBAR.home")}
      >
        <i className="fa-solid fa-house fa-xl"></i>
      </NavLinkWithToolTip>

      <NavLinkWithToolTip
        activeClass={css.active}
        className={`${css["nav-link"]}`}
        to="/friends/all"
        activeStartWith="/friends"
        tooltipLabel={t("NAVBAR.friends")}
      >
        <i className="fa-solid fa-user-group fa-xl"></i>
      </NavLinkWithToolTip>
      <NavLinkWithToolTip
        activeClass={css.active}
        className={css["nav-link"]}
        to="/group/feed"
        activeStartWith="/group"
        tooltipLabel={t("NAVBAR.group")}
      >
        <i className="fa-solid fa-users-line fa-xl"></i>
      </NavLinkWithToolTip>
      <NavLinkWithToolTip
        activeClass={css.active}
        className={css["nav-link"]}
        to="/marketplace/all"
        activeStartWith="/marketplace"
        tooltipLabel={t("NAVBAR.marketplace")}
      >
        <i className="fa-solid fa-store fa-xl"></i>
      </NavLinkWithToolTip>
    </>
  );
};

export default NavCenter;
