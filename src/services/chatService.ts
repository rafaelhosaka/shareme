import { ChatEntity } from "./../models/chat";
import httpService from "./httpService";

const apiEndPoint = "/chat";

export function getChatByUserId(userId: string) {
  return httpService.get(`${apiEndPoint}/${userId}`);
}

export function markAsRead(chat: ChatEntity) {
  return httpService.put(`${apiEndPoint}/markAsRead`, chat);
}
