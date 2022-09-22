import {
  FriendAcceptedNotificationEntity,
  NotificationEntity,
} from "./../models/notification";
import { FriendRequestNotificationEntity } from "../models/notification";
import httpService from "./httpService";
import _ from "lodash";

const apiEndPoint = "/notification";

export async function getNotificationsByUserId(userId: string) {
  const { data }: { data: NotificationEntity[] } = await httpService.get(
    `${apiEndPoint}/${userId}`
  );

  return data.map((notification) => {
    if (_.has(notification, "friendRequesting")) {
      return (notification = new FriendRequestNotificationEntity(
        notification as FriendRequestNotificationEntity
      ));
    } else {
      return (notification = new FriendAcceptedNotificationEntity(
        notification as FriendAcceptedNotificationEntity
      ));
    }
  });
}

export function markAsRead(notificationId: string) {
  return httpService.put(`${apiEndPoint}/markAsRead`, notificationId, {
    headers: { "Content-Type": "application/json" },
  });
}

export async function unreadCount(userId: string) {
  const { data } = await httpService.get(
    `${apiEndPoint}/${userId}/unreadCount`
  );
  return data;
}

export function deleteNotification(notificationId: string) {
  return httpService.delete(`${apiEndPoint}`, { data: notificationId });
}
