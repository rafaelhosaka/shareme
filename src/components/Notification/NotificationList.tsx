import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { NotificationEntity } from "../../models/notification";
import {
  getNotificationsByUserId,
  markAsRead,
} from "../../services/notificationService";
import Notification from "./Notification";
import css from "./Notification.module.scss";

function NotificationList() {
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const { user } = useUser();

  useEffect(() => {
    async function getNotifications() {
      if (user) {
        const notifications = await getNotificationsByUserId(user.id);
        setNotifications(notifications);
      }
    }
    getNotifications();
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    const newNotifications = notifications.map((n) => {
      if (n.id === notificationId) {
        n.read = true;
      }
      return n;
    });

    setNotifications(newNotifications);
  };

  return (
    <div className={css["notification-list__container"]}>
      <h1 className={css["notification-list__header"]}>Notifications</h1>
      {notifications.length === 0 && (
        <div className={css["no-notifications"]}>You have no notifications</div>
      )}
      {notifications.map((n) => (
        <Notification
          key={n.id}
          notification={n}
          markAsRead={handleMarkAsRead}
        />
      ))}
    </div>
  );
}

export default NotificationList;
