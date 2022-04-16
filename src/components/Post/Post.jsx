import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { imageDownload } from "../../services/postService";
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
          <p className="post__date">{formatDate(post.dateCreated)}</p>
        </header>
        <p className="post__description">{post.description}</p>
        {post.fileName && (
          <img className="post__image" src={imageDownload(post.id)} />
        )}
        <footer className="post__footer">
          <div className="post__details">
            <span className="post__details-like">2 likes</span>
            <div>
              <span className="post__details-comment">30 Comments</span>
              <span className="post__details-share">10 Shares</span>
            </div>
          </div>
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
