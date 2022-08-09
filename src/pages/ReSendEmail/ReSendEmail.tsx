import React from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../../components/Alert/Alert";
import { useInput } from "../../hook/useInput";
import { resendEmail } from "../../services/emailService";
import css from "./ReSendEmail.module.scss";

const ReSendEmail = () => {
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const [alert, dispatchAlert] = useAlert();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await resendEmail(email);
        resetEmail();
        dispatchAlert(
          "We sent you an e-mail for verification, please verify your email",
          "info"
        );
      } catch (ex: any) {
        dispatchAlert("We could not find this email", "warning");
      }
    }
  };

  return (
    <main className="container full center">
      {alert}
      <img
        className={css["login-logo"]}
        src={"./images/logo-full.png"}
        alt="Logo of the Shareme"
      />
      <div className={css["resend__container"]}>
        <form onSubmit={handleSendEmail}>
          <div className="form-group">
            <input
              required
              className="form-input"
              placeholder="Type your email here..."
              type="email"
              {...bindEmail}
            />
          </div>
          <button className="btn btn--small btn--primary btn--stretched">
            Send new verification email
          </button>

          <Link
            to="/login"
            className="btn btn--small my-2 btn--secondary btn--stretched"
          >
            Back
          </Link>
        </form>
      </div>
    </main>
  );
};

export default ReSendEmail;
