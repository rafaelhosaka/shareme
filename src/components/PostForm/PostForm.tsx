import React, { useState } from "react";
import { useInput } from "../../hook/useInput";
import { useUser, useUserImage } from "../../context/userContext";
import { useAlert } from "../Alert/Alert";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

import css from "./PostForm.module.scss";
import { useTranslation } from "react-i18next";
import { fullName } from "../../utils/formatedNames";
import Dropzone from "../Dropzone/Dropzone";

interface PostFormProps {
  handleNewPost: (description: string, file: File) => void;
}

function PostForm({ handleNewPost }: PostFormProps) {
  const { t } = useTranslation();
  const [submitting, setSubmmiting] = useState(false);

  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription,
  } = useInput("");
  const [files, setFiles] = useState<File[]>([]);

  const { user: currentUser } = useUser();
  const userImage = useUserImage();
  const [alert, dispatchAlert] = useAlert();

  const handleClose = () => {
    setFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setSubmmiting(true);
    e.preventDefault();
    if (currentUser) {
      handleNewPost(description, files[0]);
      handleClose();
      resetDescription();
      setSubmmiting(false);
    }
  };

  return (
    <div className={`${css["form-post__container"]} my-2`}>
      {alert}

      <header>
        <h1 className={`${css.heading}`}>{t("POST_FORM.createPost")}</h1>
      </header>
      <form
        id="form-post"
        className="p2"
        onSubmit={(e) => {
          setSubmmiting(true);
          handleSubmit(e);
        }}
      >
        <div className={css.user}>
          <Link to={`/profile/${currentUser?.id}/posts`}>
            <Spinner show={!userImage} sizeClass="size--60">
              <img
                className={`${css["user-image"]} size--60`}
                src={userImage}
              />
            </Spinner>
          </Link>
          <Link
            className={css["user-name"]}
            to={`/profile/${currentUser?.id}/posts`}
          >
            {fullName(currentUser)}
          </Link>
        </div>

        <div className="form-group">
          <textarea
            className={css.description}
            placeholder={t("POST_FORM.placeHolderDescription")}
            {...bindDescription}
          />
        </div>

        <Dropzone
          files={files}
          onSelect={(files) => setFiles(files)}
          onClose={() => setFiles([])}
          acceptVideo
          onError={(message: string) => dispatchAlert(t(message), "danger")}
        />
        <button
          disabled={submitting}
          className="btn my-2 btn--primary btn--stretched"
        >
          {t("POST_FORM.post")}
        </button>
      </form>
    </div>
  );
}

export default PostForm;
