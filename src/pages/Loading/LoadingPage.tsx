import css from "./LoadingPage.module.scss";
import logo from "./logo100.png";

const LoadingPage = () => {
  return (
    <>
      <main className={`container ${css["container"]}`}>
        <img className={css["logo"]} src={logo} />
      </main>
      <footer className={css["footer"]}>
        <span>developed by</span>
        <span className={css["name"]}>Rafael Hideki Hosaka</span>
      </footer>
    </>
  );
};

export default LoadingPage;
