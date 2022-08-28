import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { useAlert } from "../../components/Alert/Alert";
import Spinner from "../../components/Spinner/Spinner";
import { useInput } from "../../hook/useInput";
import { changePasswordByToken } from "../../services/authService";
import css from "./RecoverPassword.module.scss";

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const {
    value: newPassword,
    bind: bindNewPassword,
    reset: resetNewPassword,
  } = useInput("");
  const {
    value: confirmPassword,
    bind: bindConfirmPassword,
    reset: resetConfirmPassword,
  } = useInput("");
  const [alert, dispatchAlert] = useAlert();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!token) {
      return;
    }
    setLoading(true);
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      dispatchAlert(t("RECOVER_PASSWORD.alertPasswordNotMatch"), "warning");
    } else {
      try {
        await changePasswordByToken(token, newPassword);
        resetNewPassword();
        resetConfirmPassword();
        dispatchAlert(t("RECOVER_PASSWORD.alertPasswordUpdated"), "success");
      } catch (ex: any) {
        if (ex.response.data === "Token does not exist") {
          dispatchAlert(t("RECOVER_PASSWORD.alertInvalidToken"), "danger");
        }
        if (ex.response.data === "Token expired") {
          dispatchAlert(t("RECOVER_PASSWORD.alertExpiredToken"), "danger");
        }
      }
    }
    setLoading(false);
  };

  return (
    <main className="container full center">
      {alert}
      <div className={`${css["container"]} ${loading ? css["loading"] : ""}`}>
        <Spinner show={loading} sizeClass="size--400">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className="form-input"
                placeholder={t("RECOVER_PASSWORD.newPassword")}
                type="password"
                {...bindNewPassword}
              />
              <input
                className="form-input"
                placeholder={t("RECOVER_PASSWORD.confirmNewPassword")}
                type="password"
                {...bindConfirmPassword}
              />
            </div>
            <button className="btn btn--small btn--primary btn--stretched">
              {t("RECOVER_PASSWORD.changePassword")}
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

export default ResetPasswordForm;
