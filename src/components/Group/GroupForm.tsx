import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../context/userContext";
import { useInput } from "../../hook/useInput";
import { createGroup } from "../../services/groupService";
import { useAlert } from "../Alert/Alert";
import Dropzone from "../Dropzone/Dropzone";
import css from "./GroupForm.module.scss";

const GroupForm = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  const { value: name, bind: bindName, reset: resetName } = useInput("");
  const [submitting, setSubmmiting] = useState(false);
  const [alert, dispatchAlert] = useAlert();
  const [files, setFiles] = useState<File[]>([]);

  const handleSelect = (files: File[]) => {
    setFiles(files);
  };

  const handleClose = () => {
    setFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      createGroup(
        JSON.stringify({
          admins: [currentUser.id],
          name,
        }),
        files[0]
      );
      setFiles([]);
      reset();
      dispatchAlert(t("GROUP.alertCreateSuccess"), "success");
    }
    setSubmmiting(false);
  };

  const reset = () => {
    resetName();
  };

  return (
    <div className={`${css["form__container"]} my-2`}>
      {alert}
      <header>
        <h1 className={`${css.heading} my-2`}>
          {t("GROUP.createGroupHeader")}
        </h1>
      </header>
      <form
        className="p2"
        onSubmit={(e) => {
          setSubmmiting(true);
          handleSubmit(e);
        }}
      >
        <span className="form-label">{t("GROUP.photo")}</span>
        <div className="form-group">
          <Dropzone
            files={files}
            onSelect={handleSelect}
            onClose={handleClose}
            onError={(message: string) => dispatchAlert(t(message), "danger")}
          />
        </div>
        <span className="form-label">{t("GROUP.groupName")}</span>
        <div className="form-group">
          <input className={css.field} {...bindName} required />
        </div>
        <button
          disabled={submitting}
          className="btn my-2 btn--primary btn--stretched"
        >
          {t("GROUP.create")}
        </button>
      </form>
    </div>
  );
};

export default GroupForm;
