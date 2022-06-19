import css from "./Navbar.module.scss";
import NavLeft from "./NavLeft";
import NavCenter from "./NavCenter";
import NavRight from "./NavRight";

function Navbar() {
  return (
    <nav className={css.navbar}>
      <div className={css["navbar-nav"]}>
        <div className={css["nav-left"]}>
          <NavLeft />
        </div>
        <div className={css["nav-center"]}>
          <NavCenter />
        </div>
        <div className={css["nav-right"]}>
          <NavRight />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
