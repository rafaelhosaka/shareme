import PostEntity from "../models/post";
import httpService from "./httpService";

const apiEndPoint = "/post";

export function getPosts() {
  return httpService.get(apiEndPoint);
}

export function getPostById(id: string) {
  return httpService.get(`${apiEndPoint}/${id}`);
}

export async function getPostsByUsersId(usersId: string[]) {
  const { data }: { data: PostEntity[] } = await httpService.post(
    `${apiEndPoint}/getPostsByUsersId`,
    usersId
  );
  return data.map((post) => (post = new PostEntity(post)));
}

export function savePostWithImage(formData: FormData) {
  return httpService.post(`${apiEndPoint}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function postImageDownload(postId: string) {
  return httpService.get(apiEndPoint + "/download/" + postId);
}

export function deletePost(postId: string) {
  httpService.delete(apiEndPoint + "/delete", {
    data: postId,
  });
}
