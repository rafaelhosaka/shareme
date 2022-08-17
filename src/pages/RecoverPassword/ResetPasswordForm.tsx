import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAlert } from "../../components/Alert/Alert";
import { useInput } from "../../hook/useInput";
import { changePasswordByToken } from "../../services/authService";
import css from "./RecoverPassword.module.scss";

const ResetPasswordForm = () => {
  const { value: newPassword, bind: bindNewPassword } = useInput("");
  const { value: confirmPassword, bind: bindConfirmPassword } = useInput("");
  const [alert, dispatchAlert] = useAlert();
  const [params] = useSearchParams();
  const token = params.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatchAlert("Passwords does not match", "warning");
    } else {
      try {
        await changePasswordByToken(token, newPassword);
        return dispatchAlert(
          "Your password has been updated, please login",
          "success"
        );
      } catch (ex: any) {
        if (ex.response.data === "Token does not exist") {
          return dispatchAlert("Invalid token", "danger");
        }
        if (ex.response.data === "Token expired") {
          return dispatchAlert("Token expired", "danger");
        }
      }
    }
  };

  return (
    <main className="container full center">
      {alert}
      <div className={css["container"]}>
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
      </div>
    </main>
  );
};

export default ResetPasswordForm;
