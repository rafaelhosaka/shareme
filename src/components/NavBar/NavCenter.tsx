import NavLinkWithToolTip from "../ToolTip/NavLinkWithToolTip";
import css from "./Navbar.module.scss";

const NavCenter = () => {
  return (
    <>
      <NavLinkWithToolTip
        activeClass={css.active}
        className={css["nav-link"]}
        to="/home"
        tooltipLabel="Home"
      >
        <i className="fa-solid fa-house fa-xl"></i>
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
    </>
  );
};

export default NavCenter;
