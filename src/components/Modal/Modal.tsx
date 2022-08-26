import { useTranslation } from "react-i18next";
import css from "./Modal.module.scss";

interface ModalProps {
  show?: boolean;
  title: string;
  description: string;
  onReject: () => void;
  onAccept: () => void;
}

const Modal = ({
  show = false,
  title,
  description,
  onReject,
  onAccept,
}: ModalProps) => {
  const { t } = useTranslation();

  return show ? (
    <div className={css["modal__container"]}>
      <div className={css["modal"]}>
        <h1 className={css["header"]}>{title}</h1>
        <div className={css["body"]}>{description}</div>
        <div className={css["btn-area"]}>
          <button onClick={onReject} className="btn">
            {t("MODAL.no")}
          </button>
          <button onClick={onAccept} className="btn btn--primary mx-1">
            {t("MODAL.yes")}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Modal;
