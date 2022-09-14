import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import MenuItem from "../../components/MenuList/MenuItem";
import MenuList from "../../components/MenuList/MenuList";
import { useUser } from "../../context/userContext";
import { ChatEntity } from "../../models/chat";
import { getChatByUserId } from "../../services/chatService";
import { Chat } from "./Chat";
import ChatMenuContent from "./ChatMenuContent";

const ChatMenu = () => {
  const { t } = useTranslation();
  const [chats, setChats] = useState<ChatEntity[]>([]);
  const { user: currentUser } = useUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getChats() {
      if (currentUser) {
        const { data } = await getChatByUserId(currentUser.id);
        setChats(data);
      }
    }
    getChats();
  }, []);

  useEffect(() => {
    if (chats[0]) {
      if (chats[0].firstUser.id === currentUser?.id) {
        navigate(`/chat/${chats[0].secondUser.id}`);
      } else {
        navigate(`/chat/${chats[0].firstUser.id}`);
      }
    }
  }, [chats]);

  return (
    <>
      <main className="container right m2">
        <ChatMenuContent />
      </main>
      <div className="left-content">
        <MenuList title={t("CHAT_MENU.chatMenuHeader")}>
          {chats.map((chat) => (
            <MenuItem
              key={chat.id}
              active={pathname === `/chat/${chat.secondUser.id}`}
            >
              <Chat chat={chat} />
            </MenuItem>
          ))}
        </MenuList>
      </div>
    </>
  );
};

export default ChatMenu;
