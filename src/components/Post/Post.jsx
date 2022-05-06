import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import {
  postImageDownload,
  toggleLike,
  getPostById,
} from "../../services/postService";
import { userImageDownload } from "../../services/userService";
import "./Post.css";
import { useBase64Image } from "../../hook/useBase64Image";
import { useUser } from "../../context/UserContext";

function Post(props) {
  const [post, setPost] = useState(props.post);
  const { image: postImage } = useBase64Image(postImageDownload(post.id));
  const { image: postUserImage } = useBase64Image(
    userImageDownload(post.user.id)
  );
  const currentUser = useUser();

  const handleLike = async () => {
    const { data } = await toggleLike(currentUser.id, post.id);
    setPost(data);
    if (!liked) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  const isLiked = post.likes.some((like) => {
    return like.userId === currentUser.id;
  });

  const [liked, setLiked] = useState(isLiked);

  return (
    <>
      <div className="post">
        <header className="post__header">
          <div className="post__user">
            <a href="/">
              <img className="post__user-image" src={postUserImage} />
            </a>
            <a href="/" className="post__user-name">
              {`${post.user.firstName} ${post.user.lastName}`}
            </a>
          </div>
          <p className="post__date">{formatDate(post.dateCreated)}</p>
        </header>
        <p className="post__description">{post.description}</p>
        {post.fileName && <img className="post__image" src={postImage} />}
        <footer className="post__footer">
          <div className="post__details">
            <span className="post__details-like">{post.likeCount} likes</span>
            <div>
              <span className="post__details-comment">30 Comments</span>
              <span className="post__details-share">10 Shares</span>
            </div>
          </div>
          <div className="post__action">
            <div onClick={handleLike} className="post__icon">
              <i
                className={liked ? "fa-solid fa-heart" : "fa-regular fa-heart"}
              ></i>
              <span>Like</span>
            </div>
            <div className="post__icon">
              <i className="fa-solid fa-comment"></i>
              <span>Commet</span>
            </div>
            <div className="post__icon">
              <i className="fa-solid fa-share-from-square"></i>
              <span>Share</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Post;
