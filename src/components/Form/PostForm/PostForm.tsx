import React, { useCallback, useState } from "react";
import { useInput } from "../../../hook/useInput";
import { savePostWithImage } from "../../../services/postService";
import { FileRejection, useDropzone } from "react-dropzone";
import { useUser, useUserImage } from "../../../context/userContext";
import { useAlert } from "../../Alert/Alert";
import { Link } from "react-router-dom";
import Spinner from "../../Spinner/Spinner";
import PostEntity from "../../../models/post";

import css from "./PostForm.module.scss";

interface PostFormProps {
  handleNewPost: (post: PostEntity) => void;
}

function PostForm({ handleNewPost }: PostFormProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length !== 0) {
        dispatchAlert("Invalid file type!", "danger");
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
        <div className={css["dropzone__label"]}>Add Photos</div>
        <div className={css["dropzone__sublabel"]}>or drag and drop</div>
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

  const createPost = async () => {
    const formData = new FormData();

    formData.append("post", JSON.stringify({ user: currentUser, description }));
    formData.append("file", files[0]); //for now accept only one image
    const { data } = await savePostWithImage(formData);
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      handleNewPost(await createPost());
      handleClose();
      resetDescription();
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className={`${css["form-post__container"]} my-2`}>
      {alert}

      <header>
        <h1 className={`${css.heading} my-2`}>Create Post</h1>
      </header>
      <form id="form-post" className="p2" onSubmit={(e) => handleSubmit(e)}>
        <div className={css.user}>
          <Link to={`/profile/${currentUser?.id}`}>
            <Spinner
              show={!userImage}
              sizeClass="size--60"
              fragment={
                <img
                  className={`${css["user-image"]} size--60`}
                  src={userImage}
                />
              }
            />
          </Link>
          <Link
            className={css["user-name"]}
            to={`/profile/${currentUser?.id}/posts`}
          >
            {currentUser?.fullName}
          </Link>
        </div>

        <div className="form-group">
          <textarea
            className={css.description}
            placeholder="Let's Share your ideias?"
            {...bindDescription}
          />
        </div>

        {renderPreview()}
        <button className="btn my-2 btn--primary btn--stretched">Post</button>
      </form>
    </div>
  );
}

export default PostForm;
