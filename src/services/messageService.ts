import httpService from "./httpService";

const apiEndPoint = "/message";

export function saveMessage(
  senderId: string,
  receiverId: string,
  content: string
) {
  const formData = new FormData();
  formData.append("senderId", senderId);
  formData.append("receiverId", receiverId);
  formData.append("content", content);
  return httpService.post(`${apiEndPoint}/send`, formData);
}

export function getMessages(senderId: string, receiverId: string) {
  const formData = new FormData();
  formData.append("senderId", senderId);
  formData.append("receiverId", receiverId);
  return httpService.post(`${apiEndPoint}/get`, formData);
}
