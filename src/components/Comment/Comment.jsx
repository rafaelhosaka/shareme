import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBase64Image } from "../../hook/useBase64Image";
import { getUserById, userImageDownload } from "../../services/userService";
import { formatDate, pastTimeFromDate } from "../../utils/formatDate";

function Comment({ comment }) {
  const [user, setUser] = useState();
  const { image: commentUserImage, setService } = useBase64Image(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await getUserById(comment.userId);
      setUser(data);
    }
    getUser();
    setService(userImageDownload(comment.userId));
  }, []);

  return (
    <div className="comment__container">
      <div className="comment">
        <Link to={`/profile/${user?.id}`}>
          <img className="comment__user" src={commentUserImage} />
        </Link>
        <div className="comment__body">
          <Link className="comment__user-name" to={`/profile/${user?.id}`}>
            {user && `${user.firstName} ${user.lastName}`}
          </Link>
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
