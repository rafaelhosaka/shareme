import { SyntheticEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useBase64Image } from "../../hook/useBase64Image";
import useComponentVisible from "../../hook/useComponentVisible";
import FriendRequestNotificationEntity, {
  NotificationEntity,
} from "../../models/notification";
import { userImageDownload } from "../../services/userService";
import { pastTimeFromDate } from "../../utils/formatDate";
import { fullName } from "../../utils/formatedNames";
import DropdownItem from "../DropdownMenu/DropdownItem";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import css from "./Notification.module.scss";

interface NotificationProps {
  notification: NotificationEntity;
  markAsRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
}

const Notification = ({
  notification,
  markAsRead,
  onDelete,
}: NotificationProps) => {
  const { t } = useTranslation();
  const { image, setService } = useBase64Image(null);
  const navigate = useNavigate();

  const {
    refs: dropRefs,
    isComponentVisible: isDropVisible,
    setIsComponentVisible: setDropVisible,
  } = useComponentVisible(false);

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
            <span className={css["user-name"]}>{`${fullName(
              notification.friendRequesting
            )}`}</span>
            <span>{t("NOTIFICATION.friendReqNotification")}</span>
            <div
              ref={(element) => (dropRefs.current[1] = element)}
              className={css["notification-menu"]}
            >
              {isDropVisible && (
                <DropdownMenu position="right">
                  <DropdownItem
                    onClick={(e: SyntheticEvent) => {
                      e.stopPropagation();
                      onDelete(notification.id);
                    }}
                    label={t("NOTIFICATION.deleteNotification")}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </div>
            <div className={css["date"]}>
              {pastTimeFromDate(notification.dateCreated, t)}
            </div>
            <div className={css["menu__container"]}>
              <div
                ref={(element) => (dropRefs.current[0] = element)}
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  setDropVisible((prev) => !prev);
                }}
                className={css["menu"]}
              >
                <i
                  className={`${css["menu-icon"]} fa-solid fa-ellipsis fa-xl`}
                ></i>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Notification;
