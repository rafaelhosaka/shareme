import React, { useState, useEffect } from "react";
import { useUserImage } from "../../context/UserContext";
import { useBase64Image } from "../../hook/useBase64Image";
import { getUserById, userImageDownload } from "../../services/userService";
import { formatDate, pastTimeFromDate } from "../../utils/formatDate";

function Comment({ comment }) {
  const [user, setUser] = useState();
  const { image: commentUserImage } = useBase64Image(
    userImageDownload(comment.userId)
  );

  useEffect(() => {
    async function getUser() {
      const { data } = await getUserById(comment.userId);
      setUser(data);
    }
    getUser();
  }, []);

  return (
    <div className="comment__container">
      <div className="comment">
        <img className="comment__user" src={commentUserImage} />
        <div className="comment__body">
          <span className="comment__username">
            {user && `${user.firstName} ${user.lastName}`}
          </span>
          <span className="comment__description">{comment.description}</span>
        </div>
      </div>
      <div className="comment-action">
        <a className="comment-action__item" href="#">
          Like
        </a>
        <a className="comment-action__item" href="#">
          Reply
        </a>
        <span className="comment__past-time">
          {pastTimeFromDate(comment.dateCreated)}
          <span className="comment__date">
            {formatDate(comment.dateCreated)}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Comment;
