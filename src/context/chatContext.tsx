import React, { useContext, useEffect, useState } from "react";
import { Panel } from "../components/MessagePanel/MessagePanelList";
import { unreadCount } from "../services/chatService";
import { useStompContext } from "./stompContext";
import { useUser } from "./userContext";

interface ChatContextInterface {
  panels: Panel[];
  chatUnreadCount: number;
  updateCounter: ((newValue?: number) => void) | null;
  open: ((panel: Panel) => void) | null;
  close: ((id: string) => void) | null;
  minimize: ((id: string, imageUrl: string | undefined) => void) | null;
  maximize: ((id: string) => void) | null;
}

const ChatContext = React.createContext<ChatContextInterface>({
  panels: [],
  chatUnreadCount: 0,
  updateCounter: null,
  open: null,
  close: null,
  minimize: null,
  maximize: null,
});

ChatContext.displayName = "ChatContext";

export function useChat() {
  return useContext(ChatContext);
}

interface ChatProviderProps {
  children: JSX.Element;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { user } = useUser();
  const [panels, setPanels] = useState<Panel[]>([]);
  const { statusChangedUser } = useStompContext();

  const [chatUnreadCount, setChatUnreadCount] = useState(0);

  async function getChatUnreadCount() {
    if (user) {
      const chatCount = await unreadCount(user.id);
      setChatUnreadCount(chatCount);
    }
  }

  useEffect(() => {
    getChatUnreadCount();
  }, [user]);

  useEffect(() => {
    const newPanels = panels.map((panel) => {
      if (panel.chattingUserChat.id === statusChangedUser?.id) {
        return {
          ...panel,
          chattingUserChat: {
            id: statusChangedUser.id,
            online: statusChangedUser.online,
            connected: statusChangedUser.connected,
          },
        };
      }
      return panel;
    });
    setPanels(newPanels);
  }, [statusChangedUser]);

  const updateCounter = (newValue?: number) => {
    if (newValue) {
      setChatUnreadCount(newValue);
    } else {
      getChatUnreadCount();
    }
  };

  const open = (panel: Panel) => {
    if (
      panels.filter((p) => p.chattingUserChat.id === panel.chattingUserChat.id)
        .length > 0
    ) {
      return maximize(panel.chattingUserChat.id);
    }
    setPanels((prev) => [...prev, panel]);
  };

  const close = (id: string) => {
    setPanels((prev) =>
      prev.filter((panel) => panel.chattingUserChat.id !== id)
    );
  };

  const minimize = (userId: string, imageUrl: string | undefined) => {
    const newPanels = panels.map((panel) => {
      if (panel.chattingUserChat.id === userId) {
        return { ...panel, imageUrl, minimized: true };
      }
      return panel;
    });
    setPanels(newPanels);
  };

  const maximize = (id: string) => {
    const newPanels = panels.map((panel) => {
      if (panel.chattingUserChat.id === id) {
        return { ...panel, minimized: false };
      }
      return panel;
    });
    setPanels(newPanels);
  };

  return (
    <ChatContext.Provider
      value={{
        panels,
        chatUnreadCount,
        updateCounter,
        open,
        close,
        minimize,
        maximize,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
