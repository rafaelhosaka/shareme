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
