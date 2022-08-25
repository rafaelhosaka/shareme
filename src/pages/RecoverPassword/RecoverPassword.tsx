import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAlert } from "../../components/Alert/Alert";
import Spinner from "../../components/Spinner/Spinner";
import { useInput } from "../../hook/useInput";
import { sendPasswordRecoveryEmail } from "../../services/emailService";
import css from "./RecoverPassword.module.scss";

const RecoverPassword = () => {
  const { t } = useTranslation();
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const [alert, dispatchAlert] = useAlert();
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (email) {
      try {
        await sendPasswordRecoveryEmail(email);
        resetEmail();
        dispatchAlert(t("RECOVER_PASSWORD.alertSentEmail"), "info");
      } catch (ex: any) {
        dispatchAlert(t("RECOVER_PASSWORD.alertEmailNotFound"), "warning");
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
      <div className={`${css["container"]} ${loading ? css["loading"] : ""}`}>
        <Spinner show={loading} sizeClass="size--400">
          <form onSubmit={handleSendEmail}>
            <div className="form-group">
              <input
                required
                className="form-input"
                placeholder={t("RECOVER_PASSWORD.placeHolderEmail")}
                type="email"
                {...bindEmail}
              />
            </div>

            <button className="btn btn--small btn--primary btn--stretched">
              {t("RECOVER_PASSWORD.recoverPassword")}
            </button>

            <Link
              to="/login"
              className="btn btn--small my-2 btn--secondary btn--stretched"
            >
              {t("RECOVER_PASSWORD.back")}
            </Link>
          </form>
        </Spinner>
      </div>
    </main>
  );
};

export default RecoverPassword;
