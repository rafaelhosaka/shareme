import { SyntheticEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useBase64File } from "../../hook/useBase64File";
import useComponentVisible from "../../hook/useComponentVisible";
import {
  FriendAcceptedNotificationEntity,
  FriendRequestNotificationEntity,
  NotificationEntity,
} from "../../models/notification";
import { userImageDownload } from "../../services/userService";
import { pastTimeFromDate } from "../../utils/formatDate";
import { fullName } from "../../utils/formatedNames";
import DropdownItem from "../DropdownMenu/DropdownItem";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import Spinner from "../Spinner/Spinner";
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
  const {
    file,
    executeRequest: userImageDownloadExecute,
    cancelRequest: userImageDownloadCancel,
  } = useBase64File(userImageDownload);
  const navigate = useNavigate();

  const {
    refs: dropRefs,
    isComponentVisible: isDropVisible,
    setIsComponentVisible: setDropVisible,
  } = useComponentVisible(false);

  useEffect(() => {
    if (notification instanceof FriendRequestNotificationEntity) {
      userImageDownloadExecute(notification.friendRequesting?.id);
    }

    if (notification instanceof FriendAcceptedNotificationEntity) {
      userImageDownloadExecute(notification.acceptedFriend?.id);
    }

    return () => {
      userImageDownloadCancel();
    };
  }, []);

  const handleClick = () => {
    markAsRead(notification.id);
    if (notification instanceof FriendRequestNotificationEntity) {
      navigate("/friends/request");
    }

    if (notification instanceof FriendAcceptedNotificationEntity) {
      navigate(`/profile/${notification.acceptedFriend.id}/posts`);
    }
  };

  const renderName = () => {
    if (notification instanceof FriendRequestNotificationEntity) {
      return fullName(notification.friendRequesting);
    }

    if (notification instanceof FriendAcceptedNotificationEntity) {
      return fullName(notification.acceptedFriend);
    }

    return "";
  };

  const renderDescription = () => {
    if (notification instanceof FriendRequestNotificationEntity) {
      return t("NOTIFICATION.friendReqNotification");
    }

    if (notification instanceof FriendAcceptedNotificationEntity) {
      return t("NOTIFICATION.friendAcceptNotification");
    }

    return "";
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`${css["notification__container"]} ${
          !notification.read && css["active"]
        }`}
      >
        <div>
          <Spinner show={!file} sizeClass="size--60">
            <img className={css["notification-image"]} src={file} />
          </Spinner>
        </div>
        <div className={css["body"]}>
          <span className={css["user-name"]}>{renderName()}</span>
          <span>{renderDescription()}</span>
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
    </>
  );
};

export default Notification;
