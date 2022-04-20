import React, { useCallback, useState } from "react";
import { useInput } from "../../../hook/useInput";
import { savePost, savePostWithImage } from "../../../services/postService";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router";

import "./PostForm.css";

function PostFormNew(props) {
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { value: description, bind: bindDescription } = useInput("");
  const [files, setFiles] = useState([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  const navigate = useNavigate();

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
        <div className="thumbnail__images">
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

  const handleSubmit = async (e) => {
    if (files.length === 0) {
      await savePost({ description });
    } else {
      const formData = new FormData();
      formData.append("post", JSON.stringify({ description }));
      formData.append("file", files[0]); //for now accept only one image
      await savePostWithImage(formData);
    }
    window.location = "/";
  };

  return (
    <div className="form-post__container">
      <header>
        <h1 className="form-post__heading">Create Post</h1>
      </header>
      <form
        id="form-post"
        className="form-post"
        onSubmit={() => handleSubmit()}
      >
        <div className="form-post__user">
          <img
            className="form-post__user-image"
            src={"./images/RAFAEL_FOTO.JPG"}
          />
          <span className="form-post__user-name">User</span>
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

export default PostFormNew;
