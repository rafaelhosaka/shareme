import React, { useCallback, useState } from "react";
import { useInput } from "../../../hook/useInput";
import { savePostWithImage } from "../../../services/postService";
import { useDropzone } from "react-dropzone";
import "./PostForm.css";
import { useUser, useUserImage } from "../../../context/userContext";
import { useAlert } from "../../Alert/Alert";
import { Link } from "react-router-dom";

function PostForm({ handleNewPost }) {
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length !== 0) {
      dispatchAlert("Invalid file type!", "danger");
      fileRejections = [];
    } else {
      setFiles(acceptedFiles);
    }
  }, []);

  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription,
  } = useInput("");
  const [files, setFiles] = useState([]);
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
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="dropzone__label">Add Photos</div>
        <div className="dropzone__sublabel">or drag and drop</div>
      </div>
    );
  };

  const getThumbnail = () => {
    return (
      <div className="thumbnail">
        <div onClick={() => handleClose()} className="thumbnail__close">
          <i className="close__icon fa-solid fa-xmark"></i>
        </div>
        <div className={files.length <= 1 ? "" : "grid--2x1"}>
          {files.map((file) => (
            <img
              className="thumbnail__image"
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

  const handleSubmit = async (e) => {
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
    <div className="form-post__container">
      {alert}
      <header>
        <h1 className="form-post__heading">Create Post</h1>
      </header>
      <form
        id="form-post"
        className="form-post"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="form-post__user">
          <Link to={`/profile/${currentUser.id}`}>
            <img className="form-post__user-image" src={userImage} />
          </Link>
          <Link
            className="form-post__user-name"
            to={`/profile/${currentUser.id}/posts`}
          >
            {currentUser && `${currentUser.firstName} ${currentUser.lastName}`}
          </Link>
        </div>

        <div className="form-group">
          <textarea
            className="form-post__description"
            placeholder="Let's Share your ideias?"
            {...bindDescription}
          />
        </div>

        {renderPreview()}
        <button className="btn btn--green btn--stretched">Post</button>
      </form>
    </div>
  );
}

export default PostForm;
