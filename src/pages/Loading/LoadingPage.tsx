import css from "./LoadingPage.module.scss";
import logo from "./logo100.png";

const LoadingPage = () => {
  return (
    <>
      <div className={css["container"]}>
        <img className={css["logo"]} src={logo} />
      </div>
      <footer className={css["footer"]}>
        <span>developed by</span>
        <span className={css["name"]}>Rafael Hideki Hosaka</span>
      </footer>
    </>
  );
};

export default LoadingPage;
