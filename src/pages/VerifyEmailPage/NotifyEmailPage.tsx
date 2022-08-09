import { Link, useSearchParams } from "react-router-dom";
import css from "./VerifyEmailPage.module.scss";

const NotifyEmailPage = () => {
  const [searchParam] = useSearchParams();
  const email = searchParam.get("email");

  return (
    <main className="container full center">
      <div className={css["container"]}>
        <i className="fa-solid fa-envelope-open-text fa-10x"></i>
        <h1 className={css["header"]}>Verify your email</h1>
        <p>
          We have sent an email to <strong>{email}</strong> to verify your email
          address and activate your account. The link in the email will expire
          in 24 hours.
        </p>
        <p>
          <strong className={css["link"]}>
            <Link to="/resend">Click here </Link>
          </strong>
          if you did not receive an email
        </p>
      </div>
    </main>
  );
};

export default NotifyEmailPage;
