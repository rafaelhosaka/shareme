import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../context/userContext";
import { useStomp } from "../../hook/useStomp";
import { NotificationEntity } from "../../models/notification";
import {
  getNotificationsByUserId,
  markAsRead,
} from "../../services/notificationService";
import Notification from "./Notification";
import css from "./Notification.module.scss";

interface NotificationListProps {
  updateCount: (count: number) => void;
}

function NotificationList({ updateCount }: NotificationListProps) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const { user } = useUser();
  const { receivedNotification } = useStomp();

  useEffect(() => {
    async function getNotifications() {
      if (user) {
        const notifications = await getNotificationsByUserId(user.id);
        setNotifications(notifications);
      }
    }
    getNotifications();
  }, []);

  useEffect(() => {
    if (receivedNotification) {
      setNotifications([receivedNotification, ...notifications]);
    }
  }, [receivedNotification]);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    const newNotifications = notifications.map((n) => {
      if (n.id === notificationId) {
        n.read = true;
      }
      return n;
    });
    updateCount(-1);
    setNotifications(newNotifications);
  };

  return (
    <div className={css["notification-list__container"]}>
      <h1 className={css["notification-list__header"]}>
        {t("NOTIFICATION.header")}
      </h1>
      {notifications.length === 0 && (
        <div className={css["no-notifications"]}>
          {t("NOTIFICATION.noNotifications")}
        </div>
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
