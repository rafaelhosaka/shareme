import React, { useCallback, useState } from "react";
import { useInput } from "../../hook/useInput";
import { savePostWithImage } from "../../services/postService";
import { FileRejection, useDropzone } from "react-dropzone";
import { useUser, useUserImage } from "../../context/userContext";
import { useAlert } from "../Alert/Alert";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import PostEntity from "../../models/post";

import css from "./PostForm.module.scss";
import UserProfileEntity, { UserProfileDTO } from "../../models/userProfile";
import { useTranslation } from "react-i18next";
import { fullName } from "../../utils/formatedNames";

interface PostFormProps {
  handleNewPost: (post: PostEntity) => void;
}

function PostForm({ handleNewPost }: PostFormProps) {
  const { t } = useTranslation();
  const [submitting, setSubmmiting] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length !== 0) {
        dispatchAlert(t("POST_FORM.alertInvalidFileType"), "danger");
        fileRejections = [];
      } else {
        setFiles(acceptedFiles);
      }
    },
    []
  );

  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription,
  } = useInput("");
  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDrop,
    accept: {
      "image/*": [],
    },
  });
  const { user: currentUser } = useUser();
  const userImage = useUserImage();
  const [alert, dispatchAlert] = useAlert();

  const handleClose = () => {
    setFiles([]);
  };

  const renderPreview = () => {
    if (files.length === 0) return getDropZone();

    return getThumbnail();
  };

  const getDropZone = () => {
    return (
      <div {...getRootProps({ className: css.dropzone })}>
        <input {...getInputProps()} />
        <div className={css["dropzone__label"]}>{t("POST_FORM.addPhotos")}</div>
        <div className={css["dropzone__sublabel"]}>
          {t("POST_FORM.dragDrop")}
        </div>
      </div>
    );
  };

  const getThumbnail = () => {
    return (
      <div className={css.thumbnail}>
        <div
          onClick={() => handleClose()}
          className={`${css["thumbnail__close"]} m1 size--40`}
        >
          <i className={`${css["close__icon"]} fa-solid fa-xmark`}></i>
        </div>
        <div className={files.length <= 1 ? "" : "grid--2x1"}>
          {files.map((file) => (
            <img
              className={css["thumbnail__image"]}
              key={file.name}
              src={URL.createObjectURL(file)}
            />
          ))}
        </div>
      </div>
    );
  };

  const createPost = async (currentUser: UserProfileEntity) => {
    const formData = new FormData();

    formData.append(
      "post",
      JSON.stringify({ user: new UserProfileDTO(currentUser), description })
    );
    formData.append("file", files[0]); //for now accept only one image
    const { data } = await savePostWithImage(formData);

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setSubmmiting(true);
      e.preventDefault();
      if (currentUser) {
        const newPost = await createPost(currentUser);
        handleNewPost(new PostEntity(newPost));
        handleClose();
        resetDescription();
        setSubmmiting(false);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className={`${css["form-post__container"]} my-2`}>
      {alert}

      <header>
        <h1 className={`${css.heading} my-2`}>{t("POST_FORM.createPost")}</h1>
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

        {renderPreview()}
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
