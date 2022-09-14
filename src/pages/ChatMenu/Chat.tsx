import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import { useUser } from "../../context/userContext";
import { useBase64Image } from "../../hook/useBase64Image";
import { ChatEntity } from "../../models/chat";
import UserProfileEntity from "../../models/userProfile";
import { userImageDownload } from "../../services/userService";
import { pastTimeFromDate } from "../../utils/formatDate";
import css from "./Chat.module.scss";

interface ChatProps {
  chat: ChatEntity;
}

export const Chat = ({ chat }: ChatProps) => {
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  const [friend, setFriend] = useState<UserProfileEntity>();
  const { image: friendImage, setService: setFriendImageService } =
    useBase64Image(null);

  useEffect(() => {
    if (currentUser?.id === chat.firstUser.id) {
      setFriend(chat.secondUser);
      setFriendImageService(userImageDownload(chat.secondUser.id));
    } else {
      setFriend(chat.firstUser);
      setFriendImageService(userImageDownload(chat.firstUser.id));
    }
  }, []);

  return (
    <NavLink className={css["chat__container"]} to={`/chat/${friend?.id}`}>
      <Spinner show={!friendImage} sizeClass="size--60">
        <img className={`${css["user-image"]} size--60`} src={friendImage} />
      </Spinner>
      <div className={css["body"]}>
        <div>{friend?.firstName + " " + friend?.lastName}</div>
        <div className={css["message__container"]}>
          <div className={css["message"]}>{chat.lastMessage.content}</div>
          <div className={css["date"]}>
            {pastTimeFromDate(chat.lastMessage.dateSent, t)}
          </div>
        </div>
      </div>
    </NavLink>
  );
};
