import { useState, useEffect } from "react";
import "./Alert.css";

const ALERT = {
  SUCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
};

export function useAlert(): [
  JSX.Element,
  (message: string, type: string) => void
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

  function dispatchAlert(message: string, type: string) {
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
    <div id="alert" className={`alert${getClass(type)}`}>
      <div>
        <span className="alert__label">{getLabel(type)}</span>
        <span className="alert__message">{message}</span>
      </div>
      <i
        className="alert__close fa-solid fa-xmark fa-xl"
        onClick={closeAlert}
      ></i>
    </div>
  );
}

function getLabel(type: string) {
  switch (type) {
    case ALERT.SUCESS:
      return "Success! ";
    case ALERT.DANGER:
      return "Error! ";
    case ALERT.WARNING:
      return "Warning! ";
    default:
      return "";
  }
}

function getClass(type: string) {
  switch (type) {
    case ALERT.SUCESS:
      return " alert--success";
    case ALERT.DANGER:
      return " alert--danger";
    case ALERT.WARNING:
      return " alert--warning";
    default:
      return "";
  }
}
