import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStompContext } from "../../context/stompContext";
import { useUser } from "../../context/userContext";
import { NotificationEntity } from "../../models/notification";
import {
  deleteNotification,
  getNotificationsByUserId,
  markAsRead,
} from "../../services/notificationService";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import Notification from "./Notification";
import css from "./Notification.module.scss";

interface NotificationListProps {
  updateCount: (count: number) => void;
}

function NotificationList({ updateCount }: NotificationListProps) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const { user } = useUser();
  const { receivedNotification } = useStompContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNotifications() {
      if (user) {
        const notifications = await getNotificationsByUserId(user.id);
        const sorted = notifications.sort(function (a, b) {
          const dateA = new Date(a.dateCreated);
          const dateB = new Date(b.dateCreated);

          return dateB.getTime() - dateA.getTime();
        });
        setNotifications(sorted);
      }
      setLoading(false);
    }
    getNotifications();
  }, [receivedNotification]);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    const newNotifications = notifications.map((n) => {
      if (n.id === notificationId) {
        if (!n.read) {
          n.read = true;
          updateCount(-1);
        }
      }
      return n;
    });
    setNotifications(newNotifications);
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification(notificationId);
    const newNotifications = notifications.filter((n) => {
      if (n.id !== notificationId) {
        return n;
      } else {
        if (!n.read) {
          updateCount(-1);
        }
      }
      return;
    });

    setNotifications(newNotifications);
  };

  const renderResult = () => {
    return (
      <>
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
            onDelete={handleDeleteNotification}
          />
        ))}
      </>
    );
  };

  return (
    <div className={css["notification-list__container"]}>
      <h1 className={css["notification-list__header"]}>
        {t("NOTIFICATION.header")}
      </h1>
      {loading ? <LoadingContainer showBackground={false} /> : renderResult()}
    </div>
  );
}

export default NotificationList;
