import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useBase64Image } from "../../hook/useBase64Image";
import FriendRequestNotificationEntity, {
  NotificationEntity,
} from "../../models/notification";
import { userImageDownload } from "../../services/userService";
import css from "./Notification.module.scss";

interface NotificationProps {
  notification: NotificationEntity;
  markAsRead: (notificationId: string) => void;
}

const Notification = ({ notification, markAsRead }: NotificationProps) => {
  const { image, setService } = useBase64Image(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (notification instanceof FriendRequestNotificationEntity)
      setService(userImageDownload(notification.friendRequesting.id));
  }, []);

  const redirectToFriendRequests = () => {
    markAsRead(notification.id);
    navigate("/friends/request");
  };

  return (
    <>
      {notification instanceof FriendRequestNotificationEntity ? (
        <div
          onClick={redirectToFriendRequests}
          className={`${css["notification__container"]} ${
            !notification.read && css["active"]
          }`}
        >
          <div>
            <img className={css["notification-image"]} src={image} />
          </div>
          <div className={css["body"]}>
            <span
              className={css["user-name"]}
            >{`${notification.friendRequesting.firstName} ${notification.friendRequesting.lastName} `}</span>
            <span>sent you a friend request</span>
            <div className={css["date"]}>a week ago</div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Notification;
