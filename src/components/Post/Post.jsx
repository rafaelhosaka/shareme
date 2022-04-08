import React, { useEffect, useState } from "react";

import "./Post.css";

function Post({ post }) {
  return (
    <>
      <div className="post">
        <header className="post__header">
          <div className="post__user">
            <a href="/">
              <img
                className="post__user-image"
                src={require("../../assets/images/RAFAEL_FOTO.JPG")}
              />
            </a>
            <a href="/" className="post__user-name">
              Rafael Hosaka
            </a>
          </div>
          <p>{post.title}</p>
        </header>
        <img className="post__image" src={post.url} />
        <footer className="post__footer">
          <div className="post__details"></div>
          <div className="post__action">
            <div className="post__icon">
              <i className="fa-regular fa-heart"></i>
              <span>Like</span>
            </div>
            <div className="post__icon">
              <i className="fa-solid fa-comment"></i>
              <span>Commet</span>
            </div>
            <div className="post__icon">
              <i className="fa-solid fa-share-from-square"></i>Share
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Post;
