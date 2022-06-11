import { useNavigate } from "react-router";
import css from "./Unauthorized.module.scss";

function Unauthorized() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <main className="container full">
      <div className={css["unauthorized__container"]}>
        <h1>You do not have permission to access this page</h1>
        <button className="btn btn--primary btn--big m2" onClick={goBack}>
          Go back
        </button>
      </div>
    </main>
  );
}

export default Unauthorized;
