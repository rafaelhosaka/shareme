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

  return show ? (
    <div className={css["modal__container"]}>
      <div className={css["modal"]}>
        <div className={css["header"]}>
          <h1>{title}</h1>
          <div
            onClick={() => onReject()}
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
  ) : (
    <></>
  );
};

export default Modal;
