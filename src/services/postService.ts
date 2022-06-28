import httpService from "./httpService";
import PostEntity from "../models/post";

const apiEndPoint = "/post";

export function getPosts() {
  return httpService.get(apiEndPoint);
}

export function getPostById(id: string) {
  return httpService.get(`${apiEndPoint}/${id}`);
}

export function getPostsByUsersId(usersId: string[]) {
  return httpService.post(`${apiEndPoint}/getPostsByUsersId`, usersId);
}

export function savePostWithImage(formData: FormData) {
  return httpService.post(`${apiEndPoint}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function postImageDownload(postId: string) {
  return httpService.get(apiEndPoint + "/download/" + postId);
}

export function deletePost(post: PostEntity) {
  httpService.delete(apiEndPoint + "/delete", {
    data: post,
  });
}
