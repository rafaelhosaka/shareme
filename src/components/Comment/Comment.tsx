import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { useBase64Image } from "../../hook/useBase64Image";
import useComponentVisible from "../../hook/useComponentVisible";
import CommentEntity from "../../models/comment";
import UserProfileEntity from "../../models/userProfile";
import { likeUnlikeComment } from "../../services/likeService";
import { getUserById, userImageDownload } from "../../services/userService";
import { formatDate, pastTimeFromDate } from "../../utils/formatDate";
import DropdownItem from "../DropdownMenu/DropdownItem";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import Modal from "../Modal/Modal";
import Spinner from "../Spinner/Spinner";

import css from "./Comment.module.scss";
import NewComment from "./NewComment";

interface CommentProps {
  comment: CommentEntity;
  onDelete: (comment: CommentEntity, parentId?: string) => void;
  replyComment?: (newComment: CommentEntity, parentCommentId: string) => void;
}

function Comment({ comment, onDelete, replyComment }: CommentProps) {
  const [user, setUser] = useState<UserProfileEntity>();
  const { image: commentUserImage, setService } = useBase64Image(null);
  const { user: currentUser } = useUser();
  const newCommentRef = useRef<HTMLTextAreaElement>(null);
  const [showNewComment, setShowNewComment] = useState(false);
  const [showSubComments, setShowSubComments] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isLiked = comment.likes?.some((like) => {
    if (currentUser) return like.userId === currentUser.id;
    return;
  });

  const [liked, setLiked] = useState(isLiked);
  const {
    refs: dropCommentRefs,
    isComponentVisible: isDropCommentVisible,
    setIsComponentVisible: setDropCommentVisible,
  } = useComponentVisible(false);

  useEffect(() => {
    async function getUser() {
      setUser(await getUserById(comment.userId));
    }
    getUser();
    setService(userImageDownload(comment.userId));
  }, []);

  useEffect(() => {
    if (showNewComment) focusOnNewComment();
  }, [showNewComment]);

  const handleLikeComment = async () => {
    if (currentUser) {
      await likeUnlikeComment(currentUser.id, comment.id as string);
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
    if (replyComment && comment.id) replyComment(newComment, comment.id);
  };

  return (
    <div className={css["comment__container"]}>
      <Modal
        show={showModal}
        title="Delete comment?"
        description="Are you sure you want to delete this comment?"
        onReject={() => setShowModal(false)}
        onAccept={() => {
          onDelete(comment);
          setShowModal(false);
        }}
      />
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
              {comment.description}
            </span>
          </div>
          <div
            ref={(element) => (dropCommentRefs.current[0] = element)}
            onClick={() => setDropCommentVisible((prev) => !prev)}
            className={css["comment-menu__container"]}
          >
            <i className={`${css["menu-icon"]} fa-solid fa-ellipsis`}></i>
            <div className={css["comment-menu"]}>
              {isDropCommentVisible && (
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => setShowModal(true)}
                    label="Delete comment"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </div>
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
          {comment.subComments && (
            <div
              onClick={() => {
                setShowSubComments(true);
                setShowNewComment(true);
                focusOnNewComment();
              }}
              className={css["comment-action__reply"]}
            >
              Reply
            </div>
          )}
          <span className={css["comment__past-time"]}>
            {pastTimeFromDate(comment.dateCreated!)}
            <span className={css["comment__date"]}>
              {formatDate(comment.dateCreated!)}
            </span>
          </span>
        </div>
        {showSubComments
          ? comment.subComments?.map((subComment) => (
              <Comment
                key={subComment.id}
                comment={subComment}
                onDelete={() => onDelete(subComment, subComment.parentId)}
              />
            ))
          : comment.subComments &&
            comment.subComments.length !== 0 && (
              <div
                className={css["reply-icon__container"]}
                onClick={() => setShowSubComments(true)}
              >
                <i
                  className={`${css["reply-icon"]} fa-solid fa-arrow-turn-up`}
                ></i>
                {comment.subComments?.length}
                {comment.subComments.length === 1 ? ` Reply` : ` Replies`}
              </div>
            )}
        {comment.subComments && showNewComment && (
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
