import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import MenuItem from "../../components/MenuList/MenuItem";
import MenuList from "../../components/MenuList/MenuList";
import { useChat } from "../../context/chatContext";
import { useUser } from "../../context/userContext";
import { ChatEntity } from "../../models/chat";
import { getChatByUserId, markAsRead } from "../../services/chatService";
import { Chat } from "./Chat";
import ChatMenuContent from "./ChatMenuContent";

const ChatMenu = () => {
  const { t } = useTranslation();
  const [chats, setChats] = useState<ChatEntity[]>([]);
  const { user: currentUser } = useUser();
  const { pathname } = useLocation();
  const { statusChangedUser, receivedMessage } = useChat();

  async function getChats() {
    if (currentUser) {
      const { data } = await getChatByUserId(currentUser.id);
      setChats(data);
    }
  }

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    if (receivedMessage) {
      getChats();
    }
  }, [receivedMessage]);

  useEffect(() => {
    const newChats = chats.map((chat) => {
      if (chat.friend.id === statusChangedUser?.id) {
        chat.friend.online = statusChangedUser.online;
        return chat;
      }
      return chat;
    });
    setChats(newChats);
  }, [statusChangedUser]);

  const onRead = (chatId: string) => {
    const newChats = chats.map((chat) => {
      if (chat.id === chatId) {
        markAsRead(chat);
        chat.read = true;
        return chat;
      }
      return chat;
    });
    setChats(newChats);
  };

  return (
    <>
      <main className="container right">
        <ChatMenuContent />
      </main>
      <div className="left-content">
        <MenuList title={t("CHAT_MENU.chatMenuHeader")}>
          {chats.map((chat) => (
            <MenuItem
              key={chat.id}
              active={pathname === `/chat/${chat.friend.id}`}
            >
              <Chat onRead={onRead} chat={chat} />
            </MenuItem>
          ))}
        </MenuList>
      </div>
    </>
  );
};

export default ChatMenu;
