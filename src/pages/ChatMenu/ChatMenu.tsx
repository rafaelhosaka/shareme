import { useEffect, useState } from "react";
import { useChat } from "../../context/chatContext";

import { useUser } from "../../context/userContext";
import UserProfileEntity from "../../models/userProfile";
import { getUsersFromIds } from "../../services/userService";
import css from "./ChatMenu.module.scss";
import ChatUser from "./ChatUser";

const ChatMenu = () => {
  const { user: currentUser } = useUser();
  const { open } = useChat();
  const [friends, setFriends] = useState<UserProfileEntity[]>([]);

  async function getFriends() {
    if (currentUser) {
      const data = await getUsersFromIds(currentUser.friends);
      setFriends(data);
    }
  }

  useEffect(() => {
    getFriends();
  }, []);

  const handleOpenPanel = (friend: UserProfileEntity) => {
    if (open) {
      open({
        minimized: false,
        userId: friend.id,
        userName: friend.fullName,
        imageUrl: undefined,
      });
    }
  };

  return (
    <div className={css["container"]}>
      <span className={css["header"]}>Contacts</span>
      {friends.map((friend) => (
        <div
          key={friend.id}
          onClick={() => handleOpenPanel(new UserProfileEntity(friend))}
        >
          <ChatUser user={new UserProfileEntity(friend)} />
        </div>
      ))}
    </div>
  );
};

export default ChatMenu;
