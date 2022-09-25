import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChat } from "../../context/chatContext";
import { useStompContext } from "../../context/stompContext";

import { useUser } from "../../context/userContext";
import UserProfileEntity from "../../models/userProfile";
import { markAsRead } from "../../services/chatService";
import { getUsersFromIds } from "../../services/userService";
import { fullName } from "../../utils/formatedNames";
import css from "./Contact.module.scss";
import ContactUser from "./ContactUser";

const Contacts = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  const { open, updateCounter } = useChat();
  const { statusChangedUser, receivedNewFriend, receivedRemovedFriend } =
    useStompContext();
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
        friend.connected = statusChangedUser.connected;
        return friend;
      }
      return friend;
    });
    setFriends(newFriends);
  }, [statusChangedUser]);

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    if (receivedNewFriend) {
      setFriends([...friends, receivedNewFriend.friend]);
    }
  }, [receivedNewFriend]);

  useEffect(() => {
    if (receivedRemovedFriend) {
      setFriends(
        friends.filter((f) => f.id !== receivedRemovedFriend.friend.id)
      );
    }
  }, [receivedRemovedFriend]);

  const handleOpenPanel = async (friend: UserProfileEntity) => {
    if (open && currentUser && updateCounter) {
      open({
        minimized: false,
        chattingUserChat: {
          id: friend.id,
          online: friend.online,
          connected: friend.connected,
        },
        userName: fullName(friend),
        imageUrl: undefined,
      });
      const { data } = await markAsRead(currentUser.id, friend.id);
      updateCounter(data);
    }
  };

  return (
    <div className={css["container"]}>
      <div className={css["contacts"]}>
        <span className={css["header"]}>{t("CHAT_MENU.header")}</span>
        {friends.length === 0 && (
          <span className={css["no-contacts"]}>
            {t("CHAT_MENU.noContacts")}
          </span>
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
    </div>
  );
};

export default Contacts;
