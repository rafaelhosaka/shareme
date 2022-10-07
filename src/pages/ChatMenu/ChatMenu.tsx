import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import MenuItem from "../../components/MenuList/MenuItem";
import MenuList from "../../components/MenuList/MenuList";
import { useChat } from "../../context/chatContext";
import { useStompContext } from "../../context/stompContext";
import { useUser } from "../../context/userContext";
import { ChatEntity } from "../../models/chat";
import { MessageEntity } from "../../models/message";
import { getChatByUserId, markAsRead } from "../../services/chatService";
import { Chat } from "./Chat";
import ChatMenuContent from "./ChatMenuContent";
import css from "./Chat.module.scss";
import LoadingContainer from "../../components/LoadingContainer/LoadingContainer";

const ChatMenu = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<ChatEntity[]>([]);
  const { user: currentUser } = useUser();
  const { pathname } = useLocation();
  const { updateCounter } = useChat();
  const { statusChangedUser, receivedMessage } = useStompContext();

  async function getChats(receivedMessage?: MessageEntity) {
    if (currentUser) {
      const { data }: { data: ChatEntity[] } = await getChatByUserId(
        currentUser.id
      );

      if (receivedMessage) {
        const newChats = data.map((chat) => {
          if (chat.friend.id === receivedMessage.sender.id) {
            chat.read = true;
            return chat;
          }
          return chat;
        });
        setChats(newChats);
      } else {
        setChats(data);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    getChats();
  }, []);

  useEffect(() => {
    if (receivedMessage) {
      getChats(receivedMessage);
    }
  }, [receivedMessage]);

  useEffect(() => {
    const newChats = chats.map((chat) => {
      if (chat.friend.id === statusChangedUser?.id) {
        chat.friend.online = statusChangedUser.online;
        chat.friend.connected = statusChangedUser.connected;
        return chat;
      }
      return chat;
    });
    setChats(newChats);
  }, [statusChangedUser]);

  async function markChatAsRead(chat: ChatEntity) {
    const { data } = await markAsRead(chat.owner.id, chat.friend.id);

    if (updateCounter) {
      updateCounter(data);
    }
  }

  const handleRead = (chatId: string) => {
    const newChats = chats.map((chat) => {
      if (chat.id === chatId) {
        if (!chat.read) {
          markChatAsRead(chat);
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

  const renderResult = () => {
    return (
      <>
        {chats.length === 0 && (
          <div className={css["no-chat"]}>{t("CHAT_MENU.noChats")}</div>
        )}
        {chats.map((chat) => (
          <MenuItem
            key={chat.id}
            active={pathname === `/chat/${chat.friend.id}`}
          >
            <Chat onRead={handleRead} chat={chat} />
          </MenuItem>
        ))}
      </>
    );
  };

  return (
    <>
      <main className="container right">
        <ChatMenuContent onSend={handleSendMessage} />
      </main>
      <div className="left-content">
        <MenuList title={t("CHAT_MENU.chatMenuHeader")}>
          {loading ? (
            <LoadingContainer showBackground={false} />
          ) : (
            renderResult()
          )}
        </MenuList>
      </div>
    </>
  );
};

export default ChatMenu;
