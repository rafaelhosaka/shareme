import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { useBase64Image } from "../../hook/useBase64Image";
import CommentEntity from "../../models/comment";
import UserProfileEntity from "../../models/userProfile";
import { replyComment } from "../../services/commentService";
import { likeUnlikeComment } from "../../services/likeService";
import { getUserById, userImageDownload } from "../../services/userService";
import { formatDate, pastTimeFromDate } from "../../utils/formatDate";
import Spinner from "../Spinner/Spinner";

import css from "./Comment.module.scss";
import NewComment from "./NewComment";

interface CommentProps {
  comment: CommentEntity;
}

function Comment({ comment }: CommentProps) {
  const [commentState, setComment] = useState(comment);
  const [user, setUser] = useState<UserProfileEntity>();
  const { image: commentUserImage, setService } = useBase64Image(null);
  const { user: currentUser } = useUser();
  const newCommentRef = useRef<HTMLInputElement>(null);
  const [showNewComment, setShowNewComment] = useState(false);

  const isLiked = commentState.likes?.some((like) => {
    if (currentUser) return like.userId === currentUser.id;
    return;
  });

  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    async function getUser() {
      setUser(await getUserById(commentState.userId));
    }
    getUser();
    setService(userImageDownload(commentState.userId));
  }, []);

  useEffect(() => {
    if (showNewComment) focusOnNewComment();
  }, [showNewComment]);

  const handleLikeComment = async () => {
    if (currentUser) {
      await likeUnlikeComment(currentUser.id, commentState.id as string);
      setLiked((prev) => !prev);
    }
  };

  const focusOnNewComment = () => {
    newCommentRef?.current?.focus({ preventScroll: true });
    newCommentRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  const handleNewComment = async (newComment: CommentEntity) => {
    const { data } = await replyComment(
      JSON.stringify(newComment),
      commentState.id!
    );
    setComment(data);
  };

  return (
    <div className={css["comment__container"]}>
      <Link to={`/profile/${user?.id}/posts`}>
        <Spinner show={!commentUserImage} sizeClass="size--40">
          <img
            className={`${css["comment__user"]} size--40`}
            src={commentUserImage}
          />
        </Spinner>
      </Link>
      <div>
        <div className={css["comment"]}>
          <div className={`${css["comment__body"]} p1`}>
            <Link
              className={css["comment__user-name"]}
              to={`/profile/${user?.id}/posts`}
            >
              {user && `${user.firstName} ${user.lastName}`}
            </Link>
            <span className={css["comment__description"]}>
              {commentState.description}
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
          {commentState.subComments && (
            <div
              onClick={() => {
                setShowNewComment(true);
                focusOnNewComment();
              }}
              className={css["comment-action__reply"]}
            >
              Reply
            </div>
          )}
          <span className={css["comment__past-time"]}>
            {pastTimeFromDate(commentState.dateCreated!)}
            <span className={css["comment__date"]}>
              {formatDate(commentState.dateCreated!)}
            </span>
          </span>
        </div>
        {commentState.subComments?.map((subComment) => (
          <Comment key={subComment.id} comment={subComment} />
        ))}
        {commentState.subComments && showNewComment && (
          <NewComment
            handleNewComment={handleNewComment}
            elementRef={newCommentRef}
          />
        )}
      </div>
    </div>
  );
}

export default Comment;
