import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../services/emailService";
import css from "./VerifyEmailPage.module.scss";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function verify() {
      if (token) {
        try {
          const { data } = await verifyEmail(token);
          setMessage(data);
        } catch (ex: any) {
          setMessage(ex.response.data);
          setError(true);
        }
      } else {
        navigate("/login");
      }
    }
    verify();
    setTimeout(() => {
      navigate("/login");
    }, 5000);
  }, []);

  return (
    <main className="container full center">
      <div className={css["container"]}>
        {error ? (
          <i className="fa-solid fa-circle-xmark fa-5x"></i>
        ) : (
          <i className={`fa-solid fa-circle-check fa-5x`}></i>
        )}
        <h1 className={css["header"]}>{message}</h1>
        {error ? "" : "Now you can login"}
        <p>We will redirect you to home page soon</p>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
