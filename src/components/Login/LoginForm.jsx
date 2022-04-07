import React from "react";
import Form from "../Form/Form";
import Joi from "joi-browser";
import "./LoginForm.css";
import "../Form/Button/Button.css";
import "../Form/Input/Input.css";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  render() {
    return (
      <>
        <img
          className="login-logo"
          src={require("../../assets/images/logo-full.png")}
          alt="Logo of the Shareme"
        />
        <div className="login-container">
          <h1 className="login-heading">Log Into Shareme</h1>
          <form>
            <div className="form-group">
              {this.renderInput("email", "Email", "form-control", "email")}
            </div>
            <div className="form-group">
              {this.renderInput(
                "password",
                "Password",
                "form-control",
                "password"
              )}
            </div>

            <div className="form-group">
              {this.renderButton(
                "Log In",
                "btn btn--green btn--stretched",
                this.validate()
              )}
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default LoginForm;
