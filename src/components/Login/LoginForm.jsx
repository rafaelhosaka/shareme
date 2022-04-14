import React from "react";
import Form from "../Form/Form";
import Joi from "joi-browser";
import "./LoginForm.css";

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
        <div className="form-login-container">
          <h1 className="form-login-heading">Log Into Shareme</h1>
          <form>
            {this.renderInput("email", "Email", "form-control", "email")}

            {this.renderInput(
              "password",
              "Password",
              "form-control",
              "password"
            )}

            {this.renderButton(
              "Log In",
              "btn btn--green btn--stretched",
              this.validate()
            )}
          </form>
        </div>
      </>
    );
  }
}

export default LoginForm;
