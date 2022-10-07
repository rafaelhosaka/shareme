import { CancelToken } from "axios";
import _ from "lodash";
import PostEntity from "../models/post";
import httpService from "./httpService";

const apiEndPoint = "/post";

export function getPosts() {
  return httpService.get(apiEndPoint);
}

export function getPostById(id: string) {
  return httpService.get(`${apiEndPoint}/${id}`);
}

export function getPostsByUsersId(
  usersId: string[],
  cancelToken?: CancelToken
) {
  return httpService.post(`${apiEndPoint}/getPostsByUsersId`, usersId, {
    cancelToken,
  });
}

export async function savePost(postJson: string, file: File) {
  const formData = new FormData();
  formData.append("post", postJson);
  formData.append("file", file);
  const { data } = await httpService.post(`${apiEndPoint}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return new PostEntity(data);
}

export function postImageDownload(postId: string, cancelToken?: CancelToken) {
  return httpService.get(apiEndPoint + "/download/" + postId, { cancelToken });
}

export function deletePost(postId: string) {
  httpService.delete(apiEndPoint + "/delete", {
    data: postId,
  });
}

export function sharePost(sharingUserId: string, sharingPostId: string) {
  const formData = new FormData();
  formData.append("sharingUserId", sharingUserId);
  formData.append("sharingPostId", sharingPostId);
  //return array [0] = new sharedPost/ [1] = updated post
  return httpService.post(`${apiEndPoint}/share/post`, formData);
}

export function updatePost(post: PostEntity) {
  return httpService.put(`${apiEndPoint}/update`, post);
}

export function getGroupPosts(groupId: string) {
  return httpService.get(`${apiEndPoint}/group/${groupId}`);
}

export function getAllGroupsPosts(userId: string) {
  return httpService.get(`${apiEndPoint}/group/all/${userId}`);
}
