import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import MenuItem from "../../components/MenuList/MenuItem";
import MenuList from "../../components/MenuList/MenuList";
import { useChat } from "../../context/chatContext";
import { useUser } from "../../context/userContext";
import { ChatEntity } from "../../models/chat";
import { MessageEntity } from "../../models/message";
import { getChatByUserId, markAsRead } from "../../services/chatService";
import { Chat } from "./Chat";
import ChatMenuContent from "./ChatMenuContent";

const ChatMenu = () => {
  const { t } = useTranslation();
  const [chats, setChats] = useState<ChatEntity[]>([]);
  const { user: currentUser } = useUser();
  const { pathname } = useLocation();
  const { statusChangedUser, receivedMessage, updateCounter } = useChat();

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

  const handleRead = (chatId: string) => {
    const newChats = chats.map((chat) => {
      if (chat.id === chatId) {
        markAsRead(chat.owner.id, chat.friend.id);
        if (!chat.read && updateCounter) {
          updateCounter(-1);
        }
        chat.read = true;
        return chat;
      }
      return chat;
    });

    setChats(newChats);
  };

  const handleSendMessage = (message: MessageEntity, friendId: string) => {
    const newChats = chats.map((chat) => {
      if (chat.friend.id === friendId) {
        chat.lastMessage = message;
        return chat;
      }
      return chat;
    });
    setChats(newChats);
  };

  return (
    <>
      <main className="container right">
        <ChatMenuContent onSend={handleSendMessage} />
      </main>
      <div className="left-content">
        <MenuList title={t("CHAT_MENU.chatMenuHeader")}>
          {chats.map((chat) => (
            <MenuItem
              key={chat.id}
              active={pathname === `/chat/${chat.friend.id}`}
            >
              <Chat onRead={handleRead} chat={chat} />
            </MenuItem>
          ))}
        </MenuList>
      </div>
    </>
  );
};

export default ChatMenu;
