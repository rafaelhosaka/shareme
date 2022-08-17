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

function LoginForm() {
  const { setUser } = useUser();
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");
  const [alert, dispatchAlert] = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
            dispatchAlert(
              "Your account is disabled, please verify your email",
              "danger"
            );
            break;
          default:
            dispatchAlert("Username/Password incorrect", "danger");
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      <main className="container full center">
        <>{alert}</>
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
            <h1 className={css["heading"]}>Log Into ShareMe</h1>
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

              <button className="btn btn--small my-2 btn--primary btn--stretched">
                Log In
              </button>
            </form>
            <Link
              className="btn btn--small my-2 btn--secondary btn--stretched"
              to="/register"
            >
              Create Account
            </Link>
            <Link className={css["link"]} to="/recover">
              Recover password
            </Link>
            <Link className={css["link"]} to="/resend">
              Send new email verification
            </Link>
          </Spinner>
        </div>
      </main>
      <div className="footer">
        Rafael Hideki Hosaka © 2022 ShareMe {process.env.REACT_APP_VERSION}
      </div>
    </>
  );
}

export default LoginForm;
