import httpService from "./httpService";

const apiEndPoint = "/comment";

export function newComment(comment, postId) {
  const formData = new FormData();
  formData.append("comment", comment);
  formData.append("postId", postId);
  return httpService.put(`${apiEndPoint}/new`, formData);
}
