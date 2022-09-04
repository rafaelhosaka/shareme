import { NotificationEntity } from "./../models/notification";
import FriendRequestNotificationEntity from "../models/notification";
import httpService from "./httpService";

const apiEndPoint = "/notification";

export async function getNotificationsByUserId(userId: string) {
  const { data }: { data: NotificationEntity[] } = await httpService.get(
    `${apiEndPoint}/${userId}`
  );

  return data.map((notification) => {
    return (notification = new FriendRequestNotificationEntity(
      notification as FriendRequestNotificationEntity
    ));
  });
}

export function markAsRead(notificationId: string) {
  return httpService.put(`${apiEndPoint}/markAsRead`, notificationId, {
    headers: { "Content-Type": "application/json" },
  });
}
