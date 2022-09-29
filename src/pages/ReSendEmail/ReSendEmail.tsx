import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAlert } from "../../components/Alert/Alert";
import Spinner from "../../components/Spinner/Spinner";
import { useInput } from "../../hook/useInput";
import { resendEmail } from "../../services/emailService";
import css from "./ReSendEmail.module.scss";

const ReSendEmail = () => {
  const { t } = useTranslation();
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const [alert, dispatchAlert] = useAlert();
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (email) {
      try {
        await resendEmail(email);
        resetEmail();
        dispatchAlert(t("RESEND_EMAIL.alertSentEmail"), "info");
      } catch (ex: any) {
        switch (ex.response.data) {
          case "This user account is already activated":
            dispatchAlert(t("RESEND_EMAIL.alertAlreadyActivated"), "warning");
            break;
          case "User with " + email + " not found":
            dispatchAlert(t("RESEND_EMAIL.alertEmailNotFound"), "warning");
            break;
          default:
            dispatchAlert(ex.response.data, "danger");
        }
      }
    }
    setLoading(false);
  };

  return (
    <main className="container full center">
      {alert}
      <img
        className={css["login-logo"]}
        src={"./images/logo-full.png"}
        alt="Logo of the Shareme"
      />
      <div
        className={`${css["resend__container"]} ${
          loading ? css["loading"] : ""
        }`}
      >
        <Spinner show={loading} sizeClass="size--400">
          <div className={`${css.header} p2`}>
            <h1>{t("RESEND_EMAIL.header")}</h1>
          </div>
          <form className="p2" onSubmit={handleSendEmail}>
            <div className="form-group">
              <input
                required
                className="form-input"
                placeholder={t("RESEND_EMAIL.placeHolderEmail")}
                type="email"
                {...bindEmail}
              />
            </div>

            <button className="btn btn--small btn--primary btn--stretched">
              {t("RESEND_EMAIL.sendNewEmail")}
            </button>

            <Link
              to="/login"
              className="btn btn--small my-2 btn--secondary btn--stretched"
            >
              {t("RESEND_EMAIL.back")}
            </Link>
          </form>
        </Spinner>
      </div>
    </main>
  );
};

export default ReSendEmail;
