import httpService from "./httpService";

const apiEndPoint = "/post";

export function getPosts() {
  return httpService.get(apiEndPoint);
}

export function getPostById(id) {
  return httpService.get(`${apiEndPoint}/${id}`);
}

export function savePost(post) {
  return httpService.post(apiEndPoint, post);
}

export function savePostWithImage(formData) {
  return httpService.post(`${apiEndPoint}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

//needs to return raw url because
export function imageDownload(postId) {
  return httpService.getBaseUrl() + "post/" + postId + "/download";
}