import css from "./NotFound.module.scss";
import { NavLink } from "react-router-dom";

function NotFound() {
  return (
    <main className="container full">
      <div className={css["notfound__container"]}>
        <h1>Page not found</h1>
        <NavLink to="/" className="btn btn--big btn--green m2">
          Back to home
        </NavLink>
      </div>
    </main>
  );
}

export default NotFound;
