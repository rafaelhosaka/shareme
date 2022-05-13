import httpService from "./httpService";

const apiEndPoint = "/like";

export function likePost(userId, postId) {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("postId", postId);
  return httpService.put(`${apiEndPoint}/post`, formData);
}
