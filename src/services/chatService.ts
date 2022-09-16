import httpService from "./httpService";

const apiEndPoint = "/chat";

export function getChatByUserId(userId: string) {
  return httpService.get(`${apiEndPoint}/${userId}`);
}

export function markAsRead(ownerId: string, friendId: string) {
  const formData = new FormData();
  formData.append("ownerId", ownerId);
  formData.append("friendId", friendId);
  return httpService.put(`${apiEndPoint}/markAsRead`, formData);
}

export async function unreadCount(userId: string) {
  const { data } = await httpService.get(
    `${apiEndPoint}/${userId}/unreadCount`
  );
  return data;
}
