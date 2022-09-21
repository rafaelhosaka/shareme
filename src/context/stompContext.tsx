import React, { useContext, useEffect } from "react";
import { useStomp } from "../hook/useStomp";
import { ChatStatusEntity } from "../models/chat";
import FriendRequestEntity from "../models/friendRequest";
import { MessageEntity } from "../models/message";
import { NotificationEntity } from "../models/notification";
import { updateUser } from "../services/userService";
import { useUser } from "./userContext";

interface StompContextInterface {
  sendMessage: ((message: MessageEntity) => void) | null;
  receivedMessage: MessageEntity | undefined;
  changeStatus:
    | ((id: string, status: boolean, connected: boolean) => void)
    | null;
  statusChangedUser: ChatStatusEntity | undefined;
  receivedNotification: NotificationEntity | undefined;
  sendNotification: ((notification: NotificationEntity) => void) | null;
  sendRequest: ((notification: FriendRequestEntity) => void) | null;
  receivedRequest: FriendRequestEntity | undefined;
}

const StompContext = React.createContext<StompContextInterface>({
  sendMessage: null,
  receivedMessage: undefined,
  changeStatus: null,
  statusChangedUser: undefined,
  receivedNotification: undefined,
  sendNotification: null,
  sendRequest: null,
  receivedRequest: undefined,
});

StompContext.displayName = "StompContext";

export function useStompContext() {
  return useContext(StompContext);
}

interface StompProviderProps {
  children: JSX.Element;
}

export function StompProvider({ children }: StompProviderProps) {
  const { user, setUser } = useUser();

  const {
    sendMessage,
    receivedMessage,
    changeStatus,
    statusChangedUser,
    receivedNotification,
    sendNotification,
    sendRequest,
    receivedRequest,
    isConnected,
  } = useStomp();

  useEffect(() => {
    if (user && setUser) {
      if (user.online) {
        changeStatus(user.id, user.online, true);
      }
      user.connected = true;
      updateUser(user);
      setUser(user);
      window.addEventListener(
        "beforeunload",
        () => changeStatus(user.id, user.online, false),
        false
      );
    }
  }, [isConnected]);

  return (
    <StompContext.Provider
      value={{
        sendMessage,
        receivedMessage,
        changeStatus,
        statusChangedUser,
        receivedNotification,
        sendNotification,
        sendRequest,
        receivedRequest,
      }}
    >
      {children}
    </StompContext.Provider>
  );
}
