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

export function getSharedPostByUsersId(usersId: string[]) {
  return httpService.post(`${apiEndPoint}/post/getPostsByUsersId`, usersId);
}
