import React, { Component, useCallback } from "react";
import Form from "../Form/Form";
import Joi from "joi-browser";
import Dropzone from "react-dropzone";

import "./PostForm.css";

class PostForm extends Form {
  state = {
    data: { description: "" },
    errors: {},
    files: [],
  };

  schema = {
    description: Joi.string().max(250).allow(""),
  };

  handleClose = () => {
    this.setState({ files: [] });
  };

  onDrop = (files) => {
    this.setState({ files });
  };

  renderPreview() {
    if (this.state.files.length === 0) return this.getDropZone();
    return this.getThumbnail();
  }

  getDropZone() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />

            <div className="dropzone__label">Add Photos</div>
            <div className="dropzone__sublabel">or drag and drop</div>
          </div>
        )}
      </Dropzone>
    );
  }

  getThumbnail() {
    return (
      <>
        <div className="thumbnail">
          <div onClick={this.handleClose} className="thumbnail__close">
            <i className="close__icon fa-solid fa-xmark"></i>
          </div>
          <div className="thumbnail__images">
            {this.state.files.map((file) => (
              <img
                className="thumbnail__image"
                key={file.name}
                src={URL.createObjectURL(file)}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  render() {
    return (
      <div className="form-post__container">
        <header>
          <h1 className="form-post__heading">Create Post</h1>
        </header>
        <form
          id="form-post"
          method="post"
          encType="multipart/form-data"
          className="form-post"
          action="/target"
        >
          <div className="form-post__user">
            <img
              className="form-post__user-image"
              src={require("../../assets/images/RAFAEL_FOTO.JPG")}
            />
            <span className="form-post__user-name">User</span>
          </div>
          {this.renderTextArea(
            "description",
            "",
            "form-post__description",
            "Let's Share your ideias?"
          )}

          {this.renderPreview()}
          {this.renderButton("Post", "btn btn--green btn--stretched")}
        </form>
      </div>
    );
  }
}

export default PostForm;
