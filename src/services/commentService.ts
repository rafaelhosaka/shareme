import CommentEntity from "../models/comment";
import httpService from "./httpService";

const apiEndPoint = "/comment";

export function newComment(commentJSON: string, postId: string) {
  const formData = new FormData();
  formData.append("comment", commentJSON);
  formData.append("postId", postId);
  return httpService.put(`${apiEndPoint}/new`, formData);
}

export function replyComment(commentJSON: string, parentComemntId: string) {
  const formData = new FormData();
  formData.append("comment", commentJSON);
  formData.append("parentCommentId", parentComemntId);
  return httpService.put(`${apiEndPoint}/reply`, formData);
}

export function updateComment(comment: CommentEntity) {
  return httpService.put(`${apiEndPoint}/update`, comment);
}

export function deleteComment(commentId: string, postId: string) {
  const formData = new FormData();
  formData.append("commentId", commentId);
  formData.append("postId", postId);
  httpService.delete(`${apiEndPoint}/delete`, { data: formData });
}
