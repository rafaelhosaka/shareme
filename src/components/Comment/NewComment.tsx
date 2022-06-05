import React from "react";
import { Link } from "react-router-dom";
import { useUser, useUserImage } from "../../context/userContext";
import { useInput } from "../../hook/useInput";
import CommentEntity from "../../models/comment";
import { newComment } from "../../services/commentService";
import "./Comment.css";

interface NewCommentProps {
  postId: string;
  handleNewComment: (comment: CommentEntity) => void;
  elementRef: React.RefObject<HTMLInputElement> | null;
}

function NewComment({ postId, handleNewComment, elementRef }: NewCommentProps) {
  const userImage = useUserImage();
  const { user: currentUser } = useUser();
  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription,
  } = useInput("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() !== "") {
      const { data } = await newComment(
        JSON.stringify({ description, userId: currentUser?.id }),
        postId
      );
      handleNewComment(data);
      resetDescription();
    }
  };

  return (
    <div className="new-comment__container">
      <Link to={`/profile/${currentUser?.id}`}>
        <img className="comment__user size--40" src={userImage} />
      </Link>
      <form className="new-comment__form" onSubmit={(e) => handleSubmit(e)}>
        <input
          ref={elementRef}
          className="new-comment__description"
          placeholder="Write a comment..."
          {...bindDescription}
        />
      </form>
    </div>
  );
}

export default NewComment;
