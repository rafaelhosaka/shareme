import httpService from "./httpService";
import authService from "./authService";
const apiEndPoint = "/post";

export function getPosts() {
  return httpService.get(apiEndPoint);
}

export function getPostById(id) {
  return httpService.get(`${apiEndPoint}/${id}`);
}

export function savePostWithImage(formData) {
  return httpService.post(`${apiEndPoint}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

//needs to return raw url
export function imageDownload(postId) {
  return httpService.getBaseUrl() + "post/download/" + postId;
}
