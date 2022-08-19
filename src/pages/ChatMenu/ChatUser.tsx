import { useEffect } from "react";
import { useBase64Image } from "../../hook/useBase64Image";
import UserProfileEntity from "../../models/userProfile";
import { userImageDownload } from "../../services/userService";
import css from "./ChatMenu.module.scss";

interface ChatUserProps {
  user: UserProfileEntity;
}

const ChatUser = ({ user }: ChatUserProps) => {
  const { image: userImage, setService: setUserImageService } =
    useBase64Image(null);

  useEffect(() => {
    setUserImageService(userImageDownload(user.id));
  }, []);

  return (
    <div className={css["user__container"]}>
      <img key={user.id} className={css["user-image"]} src={userImage} />
      <span className={css["user-name"]}>{user.fullName}</span>
    </div>
  );
};

export default ChatUser;
