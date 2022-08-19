import React, { useContext, useState } from "react";
import { Panel } from "../components/MessagePanel/MessagePanelList";

interface ChatContextInterface {
  panels: Panel[];
  open: ((panel: Panel) => void) | null;
  close: ((id: string) => void) | null;
  minimize: ((id: string, imageUrl: string | undefined) => void) | null;
  maximize: ((id: string) => void) | null;
}

const ChatContext = React.createContext<ChatContextInterface>({
  panels: [],
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
  const [panels, setPanels] = useState<Panel[]>([]);

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
    <ChatContext.Provider value={{ panels, open, close, minimize, maximize }}>
      {children}
    </ChatContext.Provider>
  );
}
