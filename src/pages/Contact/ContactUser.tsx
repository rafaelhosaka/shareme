import { useEffect } from "react";
import { useChat } from "../../context/chatContext";
import { useUser } from "../../context/userContext";
import { useBase64Image } from "../../hook/useBase64Image";
import UserProfileEntity from "../../models/userProfile";
import { markAsRead } from "../../services/chatService";
import { userImageDownload } from "../../services/userService";
import css from "./Contact.module.scss";

interface ChatUserProps {
  user: UserProfileEntity;
}

const ContactUser = ({ user }: ChatUserProps) => {
  const { image: userImage, setService: setUserImageService } =
    useBase64Image(null);
  const { receivedMessage, updateCounter } = useChat();
  const { user: currentUser } = useUser();

  useEffect(() => {
    setUserImageService(userImageDownload(user.id));
  }, []);

  async function markChatAsRead() {
    if (updateCounter && currentUser) {
      const { data } = await markAsRead(currentUser.id, user.id);
      updateCounter(data);
    }
  }

  useEffect(() => {
    markChatAsRead();
  }, [receivedMessage]);

  return (
    <div className={css["user__container"]}>
      <div className={css["user-image__container"]}>
        <img key={user.id} className={css["user-image"]} src={userImage} />
        {user.online && <div className={css["online"]}></div>}
      </div>
      <span className={css["user-name"]}>{user.fullName}</span>
    </div>
  );
};

export default ContactUser;
