import { SharedPostEntity } from "./../models/post";
import httpService from "./httpService";

const apiEndPoint = "/share";

export function sharePost(sharingUserId: string, sharingPostId: string) {
  const formData = new FormData();
  formData.append("sharingUserId", sharingUserId);
  formData.append("sharingPostId", sharingPostId);
  return httpService.post(`${apiEndPoint}/post`, formData);
}

export function getSharedPostByUserId(userId: string) {
  return httpService.get(`${apiEndPoint}/post/${userId}`);
}

export async function getSharedPostByUsersId(usersId: string[]) {
  const { data }: { data: SharedPostEntity[] } = await httpService.post(
    `${apiEndPoint}/post/getPostsByUsersId`,
    usersId
  );
  return data.map((post) => (post = new SharedPostEntity(post)));
}
