import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChat } from "../../context/chatContext";

import { useUser } from "../../context/userContext";
import UserProfileEntity from "../../models/userProfile";
import { markAsRead } from "../../services/chatService";
import { getUsersFromIds } from "../../services/userService";
import css from "./Contact.module.scss";
import ContactUser from "./ContactUser";

const Contacts = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  const { open, statusChangedUser, updateCounter } = useChat();
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);

  async function getFriends() {
    if (currentUser) {
      const data = await getUsersFromIds(currentUser.friends);
      setFriends(data);
    }
  }

  useEffect(() => {
    const newFriends = friends.map((friend) => {
      if (friend.id === statusChangedUser?.id) {
        friend.online = statusChangedUser.online;
        return friend;
      }
      return friend;
    });
    setFriends(newFriends);
  }, [statusChangedUser]);

  useEffect(() => {
    getFriends();
  }, []);

  const handleOpenPanel = async (friend: UserProfileEntity) => {
    if (open && currentUser && updateCounter) {
      open({
        minimized: false,
        userId: friend.id,
        userName: friend.fullName,
        imageUrl: undefined,
        online: friend.online,
      });
      const { data } = await markAsRead(currentUser.id, friend.id);
      updateCounter(data);
    }
  };

  return (
    <div className={css["container"]}>
      {friends.length > 0 && (
        <span className={css["header"]}>{t("CHAT_MENU.header")}</span>
      )}
      {friends.map((friend) => (
        <div
          key={friend.id}
          onClick={() => handleOpenPanel(new UserProfileEntity(friend))}
        >
          <ContactUser user={new UserProfileEntity(friend)} />
        </div>
      ))}
    </div>
  );
};

export default Contacts;