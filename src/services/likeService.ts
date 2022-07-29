import httpService from "./httpService";

const apiEndPoint = "/like";

export function likeUnlikePost(userId: string, postId: string) {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("postId", postId);
  return httpService.put(`${apiEndPoint}/post`, formData);
}

export function likeUnlikeComment(userId: string, commentId: string) {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("commentId", commentId);
  return httpService.put(`${apiEndPoint}/comment`, formData);
}
