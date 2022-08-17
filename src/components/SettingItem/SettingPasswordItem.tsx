import { useState } from "react";
import { useInput } from "../../hook/useInput";
import { changePasswordByUsername } from "../../services/authService";
import { useAlert } from "../Alert/Alert";
import css from "./SettingItem.module.scss";

interface SettingPasswordItemProps {
  label: string;
  username: string;
}

const SettingPasswordItem = ({ label, username }: SettingPasswordItemProps) => {
  const {
    value: currentPW,
    bind: bindCurrentPW,
    reset: resetCurrentPW,
  } = useInput("");
  const { value: newPW, bind: bindNewPW, reset: resetNewPW } = useInput("");
  const {
    value: confirmPW,
    bind: bindConfirmPW,
    reset: resetConfirmPW,
  } = useInput("");
  const [editting, setEditting] = useState(false);
  const [alert, dispatchAlert] = useAlert();

  const reset = () => {
    resetCurrentPW();
    resetNewPW();
    resetConfirmPW();
  };

  const handleCancel = () => {
    reset();
    setEditting(false);
  };

  const handleSave = async () => {
    if (newPW !== confirmPW) {
      return dispatchAlert("Passwords does not match", "warning");
    }
    try {
      await changePasswordByUsername(username, currentPW, newPW);
    } catch (ex: any) {
      if (ex.response.data === "Wrong password") {
        return dispatchAlert("Incorrect password", "danger");
      }
    }
    reset();
    setEditting(false);
    dispatchAlert("Change saved successfully", "success");
  };

  return (
    <div className={css["setting-item"]}>
      {alert}
      <strong>{label}</strong>
      <div className={css["field-passwords"]}>
        {editting ? (
          <>
            <span>Current</span>
            <input type="password" {...bindCurrentPW} required />

            <span>New</span>
            <input type="password" {...bindNewPW} required />

            <span>Re-type new</span>
            <input type="password" {...bindConfirmPW} required />
          </>
        ) : (
          <span>******</span>
        )}
      </div>
      <div className={css["btn-area"]}>
        {editting ? (
          <>
            <button
              onClick={() => {
                handleSave();
              }}
              className="btn btn--primary"
            >
              Save
            </button>
            <button onClick={handleCancel} className="btn btn--secondary">
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditting(true)}
            className="btn btn--primary"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingPasswordItem;