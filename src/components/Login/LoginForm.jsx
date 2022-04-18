import React from "react";
import Form from "../Form/Form";
import authService from "../../services/authService";
import Joi from "joi-browser";
import withRouter from "../../helper/withRouter";
import { Link } from "react-router-dom";

import "./LoginForm.css";
import "../Form/Button/Button.css";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
    loginError: "",
  };

  schema = {
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { email, password } = this.state.data;
      await authService.login(email, password);
      const { navigate } = this.props.router;
      window.location = "/home";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ loginError: "Username or Password incorrect" });
      }
    }
  };

  render() {
    return (
      <>
        <img
          className="login-logo"
          src={"./images/logo-full.png"}
          alt="Logo of the Shareme"
        />
        <div className="form-login-container">
          <h1 className="form-login-heading">Log Into Shareme</h1>
          <form className="form-login" onSubmit={this.handleSubmit}>
            {this.renderInput(
              "email",
              "Email",
              "form-control",
              "Email",
              "email"
            )}

            {this.renderInput(
              "password",
              "Password",
              "form-control",
              "Password",
              "password"
            )}
            {this.state.loginError && (
              <div className="alert alert--danger">{this.state.loginError}</div>
            )}
            {this.renderButton(
              "Log In",
              "btn btn--green btn--stretched",
              this.validate()
            )}
          </form>
          <Link className="btn btn--green btn--stretched" to="/register">
            Create Account
          </Link>
        </div>
      </>
    );
  }
}

export default withRouter(LoginForm);
