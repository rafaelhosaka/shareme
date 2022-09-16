import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useInput } from "../../hook/useInput";
import authService from "../../services/authService";
import { useAlert } from "../../components/Alert/Alert";

import css from "./LoginForm.module.scss";
import { useUser } from "../../context/userContext";
import { getUserByEmail } from "../../services/userService";
import { useNavigate } from "react-router";
import Spinner from "../../components/Spinner/Spinner";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal/Modal";

function LoginForm() {
  const { t } = useTranslation();
  const { setUser } = useUser();
  const { value: email, bind: bindEmail } = useInput("demo@shareme.com");
  const { value: password, bind: bindPassword } = useInput("demo");
  const [alert, dispatchAlert] = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (setUser) {
        await authService.login(email, password);
        const currentUser = authService.getCurrentUser();
        const data = await getUserByEmail(currentUser.sub);
        data.roles = currentUser.roles;
        setUser(data);
        navigate("/home");
      }
    } catch (ex: any) {
      if (ex.response && ex.response.status === 400) {
        switch (ex.response.data) {
          case "User is disabled":
            dispatchAlert(t("LOGIN_FORM.alertAccountDisabled"), "danger");
            break;
          default:
            dispatchAlert(
              t("LOGIN_FORM.alertEmailPasswordIncorrect"),
              "danger"
            );
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      <main className="container full center">
        <>{alert}</>
        <Modal
          show={showModal}
          title={t("DEMO.modalDemoTitle")}
          description={t("DEMO.modalDemoDesc")}
          showButtons={false}
          onReject={() => setShowModal(false)}
        />
        <img
          className={css["login-logo"]}
          src={"./images/logo-full.png"}
          alt="Logo of the Shareme"
        />

        <div
          className={`${css["form-login-container"]} ${
            loading ? css["loading"] : ""
          }`}
        >
          <Spinner show={loading} sizeClass={"size--400"}>
            <h1 className={css["heading"]}>{t("LOGIN_FORM.heading")}</h1>
            <form className={css["form"]} onSubmit={(e) => handleSubmit(e)}>
              <div className="form-group">
                <input
                  placeholder={t("LOGIN_FORM.email")}
                  type="email"
                  className="form-input"
                  {...bindEmail}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  placeholder={t("LOGIN_FORM.password")}
                  type="password"
                  className="form-input"
                  {...bindPassword}
                  required
                />
              </div>

              <button className="btn btn--small my-2 btn--primary btn--stretched">
                {t("LOGIN_FORM.login")}
              </button>
            </form>
            <Link
              className="btn btn--small my-2 btn--secondary btn--stretched"
              to="/register"
            >
              {t("LOGIN_FORM.createAccount")}
            </Link>
            <Link className={css["link"]} to="/recover">
              {t("LOGIN_FORM.recoverPassword")}
            </Link>
            <Link className={css["link"]} to="/resend">
              {t("LOGIN_FORM.sendNewEmailVerification")}
            </Link>
          </Spinner>
        </div>
      </main>
    </>
  );
}

export default LoginForm;
