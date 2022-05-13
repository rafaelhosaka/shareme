import React from "react";
import { useUser, useUserImage } from "../../context/UserContext";
import { useInput } from "../../hook/useInput";
import { newComment } from "../../services/commentService";
import "./Comment.css";

function NewComment({ postId, handleNewComment, elementRef }) {
  const userImage = useUserImage();
  const currentUser = useUser();
  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription,
  } = useInput("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim() !== "") {
      const { data } = await newComment(
        JSON.stringify({ description, userId: currentUser.id }),
        postId
      );
      handleNewComment(data);
      resetDescription();
    }
  };

  return (
    <div className="new-comment__container">
      <img className="comment__user" src={userImage} />
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
