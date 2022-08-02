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
  return show ? (
    <div className={css["modal__container"]}>
      <div className={css["modal"]}>
        <h1 className={css["header"]}>{title}</h1>
        <div className={css["body"]}>{description}</div>
        <div className={css["btn-area"]}>
          <button onClick={onReject} className="btn">
            No
          </button>
          <button onClick={onAccept} className="btn btn--primary mx-1">
            Delete
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Modal;
