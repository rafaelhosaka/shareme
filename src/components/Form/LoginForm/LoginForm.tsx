import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInput } from "../../../hook/useInput";
import AlertEntity, { LocationProps } from "../../../models/alert";
import authService from "../../../services/authService";
import { useAlert } from "../../Alert/Alert";

import css from "./LoginForm.module.scss";

function LoginForm() {
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");
  const [alert, dispatchAlert] = useAlert();
  const location = useLocation() as unknown as LocationProps;

  useEffect(() => {
    if (location.state && (location.state.alert as AlertEntity)) {
      const alert = location.state.alert;
      dispatchAlert(alert.message, alert.type);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await authService.login(email, password);
      window.location.href = "/home";
    } catch (ex: any) {
      if (ex.response && ex.response.status === 400) {
        dispatchAlert("Username/Password incorrect", "danger");
      }
    }
  };

  return (
    <main className="container center">
      <>{alert}</>
      <img
        className={css["login-logo"]}
        src={"./images/logo-full.png"}
        alt="Logo of the Shareme"
      />
      <div className={css["form-login-container"]}>
        <h1 className={css["heading"]}>Log Into Shareme</h1>
        <form className={css["form"]} onSubmit={(e) => handleSubmit(e)}>
          <div className="form-group">
            <input
              placeholder="Email"
              type="email"
              className="form-input"
              {...bindEmail}
              required
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Password"
              type="password"
              className="form-input"
              {...bindPassword}
              required
            />
          </div>

          <button className="btn my-2 btn--green btn--stretched">Log In</button>
        </form>
        <Link className="btn my-2 btn--green btn--stretched" to="/register">
          Create Account
        </Link>
      </div>
      <div className={`${css.copyright} my-2`}>
        Copyright 2022 <a href="#">Rafael Hideki Hosaka</a>
      </div>
    </main>
  );
}

export default LoginForm;
