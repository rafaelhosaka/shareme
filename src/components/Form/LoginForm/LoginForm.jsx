import { validate } from "joi-browser";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useInput } from "../../../hook/useInput";
import authService from "../../../services/authService";

import "./LoginForm.css";

function LoginForm(props) {
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await authService.login(email, password);
      window.location = "/home";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setError("Username/Password incorrect");
      }
    }
  };

  return (
    <main className="container">
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
          {error && <div className="alert alert--danger">{error}</div>}
          <button className="btn btn--green btn--stretched">Log In</button>
        </form>
        <Link className="btn btn--green btn--stretched" to="/register">
          Create Account
        </Link>
      </div>
    </main>
  );
}

export default LoginForm;
