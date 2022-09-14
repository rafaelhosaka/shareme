import httpService from "./httpService";

const apiEndPoint = "/chat";

export function getChatByUserId(userId: string) {
  return httpService.get(`${apiEndPoint}/${userId}`);
}
