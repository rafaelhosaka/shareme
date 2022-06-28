import { useState, useEffect } from "react";
import css from "./Alert.module.scss";

const ALERT = {
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
};

export function useAlert(): [
  JSX.Element,
  (message: string, type: "info" | "success" | "warning" | "danger") => void
] {
  const [alert, setAlert] = useState<JSX.Element>(<></>);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!showAlert) {
      setAlert(<></>);
    }
  }, [showAlert]);

  function closeAlert() {
    setShowAlert(false);
  }

  function dispatchAlert(
    message: string,
    type: "info" | "success" | "warning" | "danger"
  ) {
    setShowAlert(true);
    setAlert(<Alert type={type} message={message} closeAlert={closeAlert} />);
  }

  return [alert, dispatchAlert];
}

interface AlertProps {
  message: string;
  type: string;
  closeAlert: () => void;
}

function Alert({ message, type, closeAlert }: AlertProps) {
  return (
    <div id="alert" className={`${css.alert} ${getClass(type)}`}>
      <div>
        <span className={css["label"]}>{getLabel(type)}</span>
        <span className={css["message"]}>{message}</span>
      </div>
      <i
        className={`${css["close-btn"]} fa-solid fa-xmark fa-xl`}
        onClick={closeAlert}
      ></i>
    </div>
  );
}

function getLabel(type: string) {
  switch (type) {
    case ALERT.SUCCESS:
      return "Success! ";
    case ALERT.DANGER:
      return "Error! ";
    case ALERT.WARNING:
      return "Warning! ";
    default:
      return "Info! ";
  }
}

function getClass(type: string) {
  switch (type) {
    case ALERT.SUCCESS:
      return `${css["alert--success"]}`;
    case ALERT.DANGER:
      return `${css["alert--danger"]}`;
    case ALERT.WARNING:
      return `${css["alert--warning"]}`;
    default:
      return "";
  }
}
