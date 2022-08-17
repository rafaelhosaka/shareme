import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAlert } from "../../components/Alert/Alert";
import Spinner from "../../components/Spinner/Spinner";
import { useInput } from "../../hook/useInput";
import { changePasswordByToken } from "../../services/authService";
import css from "./RecoverPassword.module.scss";

const ResetPasswordForm = () => {
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
      dispatchAlert("Passwords does not match", "warning");
    } else {
      try {
        await changePasswordByToken(token, newPassword);
        resetNewPassword();
        resetConfirmPassword();
        dispatchAlert(
          "Your password has been updated, please login",
          "success"
        );
      } catch (ex: any) {
        if (ex.response.data === "Token does not exist") {
          dispatchAlert("Invalid token", "danger");
        }
        if (ex.response.data === "Token expired") {
          dispatchAlert("Token expired", "danger");
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
                placeholder="New password"
                type="password"
                {...bindNewPassword}
              />
              <input
                className="form-input"
                placeholder="Confirm new password"
                type="password"
                {...bindConfirmPassword}
              />
            </div>
            <button className="btn btn--small btn--primary btn--stretched">
              Change password
            </button>
            <Link
              to="/login"
              className="btn btn--small my-2 btn--secondary btn--stretched"
            >
              Back
            </Link>
          </form>
        </Spinner>
      </div>
    </main>
  );
};

export default ResetPasswordForm;
