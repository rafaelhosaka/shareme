import React, { useContext, useEffect, useState } from "react";
import { Panel } from "../components/MessagePanel/MessagePanelList";
import { useStomp } from "../hook/useStomp";
import { MessageEntity } from "../models/message";
import { useUser } from "./userContext";

interface ChatContextInterface {
  panels: Panel[];
  open: ((panel: Panel) => void) | null;
  close: ((id: string) => void) | null;
  minimize: ((id: string, imageUrl: string | undefined) => void) | null;
  maximize: ((id: string) => void) | null;
  sendMessage: ((message: MessageEntity) => void) | null;
  receivedMessage: MessageEntity | undefined;
  changeStatus: ((id: string, status: boolean) => void) | null;
  statusChangedUser: { id: string; online: boolean } | undefined;
}

const ChatContext = React.createContext<ChatContextInterface>({
  panels: [],
  open: null,
  close: null,
  minimize: null,
  maximize: null,
  sendMessage: null,
  receivedMessage: undefined,
  changeStatus: null,
  statusChangedUser: undefined,
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
  const {
    sendMessage,
    receivedMessage,
    changeStatus,
    statusChangedUser,
    isConnected,
  } = useStomp();

  useEffect(() => {
    if (changeStatus && user) {
      changeStatus(user.id, true);

      window.addEventListener(
        "beforeunload",
        () => changeStatus(user.id, false),
        false
      );
    }
  }, [isConnected]);

  useEffect(() => {
    const newPanels = panels.map((panel) => {
      if (panel.userId === statusChangedUser?.id) {
        return { ...panel, online: statusChangedUser.online };
      }
      return panel;
    });
    setPanels(newPanels);
  }, [statusChangedUser]);

  const open = (panel: Panel) => {
    if (panels.filter((p) => p.userId === panel.userId).length > 0) {
      return maximize(panel.userId);
    }
    setPanels((prev) => [...prev, panel]);
  };

  const close = (id: string) => {
    setPanels((prev) => prev.filter((panel) => panel.userId !== id));
  };

  const minimize = (userId: string, imageUrl: string | undefined) => {
    const newPanels = panels.map((panel) => {
      if (panel.userId === userId) {
        return { ...panel, imageUrl, minimized: true };
      }
      return panel;
    });
    setPanels(newPanels);
  };

  const maximize = (id: string) => {
    const newPanels = panels.map((panel) => {
      if (panel.userId === id) {
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
        open,
        close,
        minimize,
        maximize,
        sendMessage,
        receivedMessage,
        changeStatus,
        statusChangedUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
