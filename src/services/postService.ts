import { SharedPostEntity } from "./../models/post";
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

export async function getPostsByUsersId(usersId: string[]) {
  const { data }: { data: (PostEntity | SharedPostEntity)[] } =
    await httpService.post(`${apiEndPoint}/getPostsByUsersId`, usersId);

  return data.map((post) => {
    if (_.has(post, "fileName")) {
      return (post = new PostEntity(post as PostEntity));
    } else {
      return (post = new SharedPostEntity(post as SharedPostEntity));
    }
  });
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

export function sharePost(sharingUserId: string, sharingPostId: string) {
  const formData = new FormData();
  formData.append("sharingUserId", sharingUserId);
  formData.append("sharingPostId", sharingPostId);
  //return array [0] = new sharedPost/ [1] = updated post
  return httpService.post(`${apiEndPoint}/share/post`, formData);
}
