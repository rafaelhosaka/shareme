import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInput } from "../../hook/useInput";
import { changePasswordByUsername } from "../../services/authService";
import { useAlert } from "../Alert/Alert";
import css from "./SettingItem.module.scss";

interface SettingPasswordItemProps {
  label: string;
  username: string;
}

const SettingPasswordItem = ({ label, username }: SettingPasswordItemProps) => {
  const { t } = useTranslation();
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
    if (currentPW && newPW && confirmPW) {
      if (newPW !== confirmPW) {
        return dispatchAlert(t("SETTINGS.alertPasswordNotMatch"), "warning");
      }
      try {
        await changePasswordByUsername(username, currentPW, newPW);
      } catch (ex: any) {
        if (ex.response.data === "Wrong password") {
          return dispatchAlert(t("SETTINGS.alertIncorrectPassword"), "danger");
        }
      }
      reset();
      setEditting(false);
      dispatchAlert(t("SETTINGS.alertChangeSaved"), "success");
    } else {
      return;
    }
  };

  return (
    <div className={css["setting-item"]}>
      {alert}
      <strong>{label}</strong>
      <div className={css["field-passwords"]}>
        {editting ? (
          <>
            <span>{t("SETTINGS.current")}</span>
            <input type="password" {...bindCurrentPW} required />

            <span>{t("SETTINGS.new")}</span>
            <input type="password" {...bindNewPW} required />

            <span>{t("SETTINGS.reType")}</span>
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
              {t("SETTINGS.save")}
            </button>
            <button onClick={handleCancel} className="btn btn--secondary">
              {t("SETTINGS.cancel")}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditting(true)}
            className="btn btn--primary"
          >
            {t("SETTINGS.edit")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingPasswordItem;
