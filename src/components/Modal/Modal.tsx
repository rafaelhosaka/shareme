import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import css from "./Modal.module.scss";

interface ModalProps {
  show?: boolean;
  title: string;
  description: string;
  showButtons?: boolean;
  onReject: () => void;
  onAccept?: () => void;
}

const Modal = ({
  show = false,
  title,
  description,
  showButtons = true,
  onReject,
  onAccept,
}: ModalProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(show);
    } else {
      setTimeout(() => {
        setVisible(show);
      }, 300);
    }
  }, [show]);

  return (
    <div
      className={
        visible
          ? css["modal__container"]
          : `${css["modal__container"]} ${css["close"]}`
      }
    >
      <div className={show ? css["modal"] : `${css["modal"]} ${css["close"]}`}>
        <div className={css["header"]}>
          <h1>{title}</h1>
          <div
            onClick={() => {
              onReject();
            }}
            className={`${css["thumbnail__close"]} m1 size--40`}
          >
            <i className={`${css["close__icon"]} fa-solid fa-xmark`}></i>
          </div>
        </div>
        <div className={css["body"]}>{description}</div>
        {showButtons && (
          <div className={css["btn-area"]}>
            <button onClick={onReject} className="btn">
              {t("MODAL.no")}
            </button>
            <button onClick={onAccept} className="btn btn--primary mx-1">
              {t("MODAL.yes")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
