import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInput } from "../../../hook/useInput";
import authService from "../../../services/authService";
import { useAlert } from "../../Alert/Alert";

import "./LoginForm.css";

function LoginForm(props) {
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");
  const [alert, dispatchAlert] = useAlert();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.alert) {
      const alert = location.state.alert;
      dispatchAlert(alert.message, alert.type);
    }
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await authService.login(email, password);
      window.location = "/home";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        dispatchAlert("Username/Password incorrect", "danger");
      }
    }
  };

  return (
    <main className="container center">
      {alert}
      <img
        className="login-logo"
        src={"./images/logo-full.png"}
        alt="Logo of the Shareme"
      />
      <div className="form-login-container">
        <h1 className="form-login-heading">Log Into Shareme</h1>
        <form className="form-login" onSubmit={(e) => handleSubmit(e)}>
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

          <button className="btn m-2x0 btn--green btn--stretched">
            Log In
          </button>
        </form>
        <Link className="btn m-2x0 btn--green btn--stretched" to="/register">
          Create Account
        </Link>
      </div>
      <div className="copyright m-2x0">
        Copyright 2022 <a href="#">Rafael Hideki Hosaka</a>
      </div>
    </main>
  );
}

export default LoginForm;
