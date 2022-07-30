import React from "react";
import { Link } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import { useInput } from "../../hook/useInput";
import CommentEntity from "../../models/comment";
import css from "./Comment.module.scss";

interface NewCommentProps {
  handleNewComment: (comment: CommentEntity) => void;
  elementRef: React.RefObject<HTMLInputElement> | null;
}

function NewComment({ handleNewComment, elementRef }: NewCommentProps) {
  const userImage = useUserImage();
  const { user: currentUser } = useUser();
  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription,
  } = useInput("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() !== "" && currentUser) {
      handleNewComment({ userId: currentUser.id, description });
      resetDescription();
    }
  };

  return (
    <div className={css["new-comment__container"]}>
      <Link to={`/profile/${currentUser?.id}/posts`}>
        <img className={`${css["comment__user"]} size--40`} src={userImage} />
      </Link>
      <form
        className={css["new-comment__form"]}
        onSubmit={(e) => handleSubmit(e)}
      >
        <input
          ref={elementRef}
          className={`${css["new-comment__description"]} form-input--gray`}
          placeholder="Write a comment..."
          {...bindDescription}
        />
      </form>
    </div>
  );
}

export default NewComment;
