import React from "react";
import Form from "../Form/Form";
import authService from "../../services/authService";
import Joi from "joi-browser";
import withRouter from "../../helper/withRouter";
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

  doSubmit = () => {
    const { email, password } = this.state.data;
    authService.login(email, password);
    const { navigate } = this.props.router;
    navigate("/home");
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
          <form onSubmit={this.handleSubmit}>
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

export default withRouter(LoginForm);
