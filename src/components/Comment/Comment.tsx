import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { useBase64Image } from "../../hook/useBase64Image";
import CommentEntity from "../../models/comment";
import UserProfileEntity from "../../models/userProfile";
import { likeUnlikeComment } from "../../services/likeService";
import { getUserById, userImageDownload } from "../../services/userService";
import { formatDate, pastTimeFromDate } from "../../utils/formatDate";
import Spinner from "../Spinner/Spinner";

import css from "./Comment.module.scss";

interface CommentProps {
  comment: CommentEntity;
}

function Comment({ comment }: CommentProps) {
  const [user, setUser] = useState<UserProfileEntity>();
  const { image: commentUserImage, setService } = useBase64Image(null);
  const { user: currentUser } = useUser();

  const isLiked = comment.likes.some((like) => {
    if (currentUser) return like.userId === currentUser.id;
    return;
  });

  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    async function getUser() {
      setUser(await getUserById(comment.userId));
    }
    getUser();
    setService(userImageDownload(comment.userId));
  }, []);

  const handleLikeComment = async () => {
    if (currentUser) {
      await likeUnlikeComment(currentUser.id, comment.id);
      setLiked((prev) => !prev);
    }
  };

  return (
    <div className={css["comment__container"]}>
      <div className={css["comment"]}>
        <Link to={`/profile/${user?.id}/posts`}>
          <Spinner show={!commentUserImage} sizeClass="size--40">
            <img
              className={`${css["comment__user"]} size--40`}
              src={commentUserImage}
            />
          </Spinner>
        </Link>
        <div className={`${css["comment__body"]} p1`}>
          <Link
            className={css["comment__user-name"]}
            to={`/profile/${user?.id}/posts`}
          >
            {user && `${user.firstName} ${user.lastName}`}
          </Link>
          <span className={css["comment__description"]}>
            {comment.description}
          </span>
        </div>
      </div>
      <div className={css["comment-action"]}>
        <div
          onClick={handleLikeComment}
          className={`${css["comment-action__like"]} ${
            liked ? css["liked"] : ""
          }`}
        >
          Like
        </div>
        <div className={css["comment-action__reply"]}>Reply</div>
        <span className={css["comment__past-time"]}>
          {pastTimeFromDate(comment.dateCreated)}
          <span className={css["comment__date"]}>
            {formatDate(comment.dateCreated)}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Comment;
