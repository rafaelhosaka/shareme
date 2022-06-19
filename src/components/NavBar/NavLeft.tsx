import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import css from "./Navbar.module.scss";

const NavLeft = () => {
  const navigate = useNavigate();

  const handleSubmit = (searchQuery: string) => {
    navigate(`/search/people?q=${searchQuery}`);
  };

  return (
    <>
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
    </>
  );
};

export default NavLeft;
