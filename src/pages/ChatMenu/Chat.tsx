import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import { useBase64Image } from "../../hook/useBase64Image";
import { ChatEntity } from "../../models/chat";
import UserProfileEntity from "../../models/userProfile";
import { userImageDownload } from "../../services/userService";
import { pastTimeFromDate } from "../../utils/formatDate";
import { fullName } from "../../utils/formatedNames";
import css from "./Chat.module.scss";

interface ChatProps {
  chat: ChatEntity;
  onRead: (chatId: string) => void;
}

export const Chat = ({ chat, onRead }: ChatProps) => {
  const { t } = useTranslation();
  const [friend, setFriend] = useState<UserProfileEntity>();
  const { image: friendImage, setService: setFriendImageService } =
    useBase64Image(null);

  useEffect(() => {
    setFriend(chat.friend);
    setFriendImageService(userImageDownload(chat.friend.id));
  }, []);

  return (
    <NavLink
      onClick={() => onRead(chat.id)}
      className={css["chat__container"]}
      to={`/chat/${friend?.id}`}
    >
      <Spinner show={!friendImage} sizeClass="size--60">
        <div className={css["image__container"]}>
          <img className={`${css["user-image"]} size--60`} src={friendImage} />
          {chat.friend?.online && chat.friend.connected && (
            <div className={css["online"]}></div>
          )}
        </div>
      </Spinner>
      <div className={`${css["body"]} ${!chat.read && css["unread"]}`}>
        <div>{fullName(friend)}</div>
        <div className={`${css["message__container"]}`}>
          <div className={`${css["message"]} ${!chat.read && css["unread"]}`}>
            {chat.lastMessage.sender.id === chat.owner.id && "You: "}
            {chat.lastMessage.content}
          </div>
          <div className={`${css["date"]} ${!chat.read && css["unread"]}`}>
            {pastTimeFromDate(chat.lastMessage.dateSent, t)}
          </div>
        </div>
      </div>
    </NavLink>
  );
};
