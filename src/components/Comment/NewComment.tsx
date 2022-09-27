import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import { useInput } from "../../hook/useInput";
import CommentEntity from "../../models/comment";
import Spinner from "../Spinner/Spinner";
import css from "./Comment.module.scss";

interface NewCommentProps {
  handleNewComment: (comment: CommentEntity) => void;
  elementRef: React.RefObject<HTMLTextAreaElement> | null;
}

function NewComment({ handleNewComment, elementRef }: NewCommentProps) {
  const { t } = useTranslation();
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (elementRef?.current) {
      textAreaAdjust(elementRef.current);
    }
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  function textAreaAdjust(element: HTMLTextAreaElement) {
    element.style.height = "1px";
    element.style.height = 25 + element.scrollHeight + "px";
  }

  return (
    <div className={css["new-comment__container"]}>
      <Link to={`/profile/${currentUser?.id}/posts`}>
        <Spinner show={!userImage} sizeClass={"size--40"}>
          <img className={`${css["comment__user"]} size--40`} src={userImage} />
        </Spinner>
      </Link>
      <form className={css["new-comment__form"]}>
        <textarea
          ref={elementRef}
          className={`${css["new-comment__description"]} form-input--gray`}
          placeholder={t("NEW_COMMENT.writeComment")}
          onKeyDown={handleKeyDown}
          {...bindDescription}
        />
      </form>
    </div>
  );
}

export default NewComment;
