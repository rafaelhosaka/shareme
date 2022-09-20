import React, { useContext, useEffect } from "react";
import { useStomp } from "../hook/useStomp";
import FriendRequestEntity from "../models/friendRequest";
import { MessageEntity } from "../models/message";
import { NotificationEntity } from "../models/notification";
import { useUser } from "./userContext";

interface StompContextInterface {
  sendMessage: ((message: MessageEntity) => void) | null;
  receivedMessage: MessageEntity | undefined;
  changeStatus: ((id: string, status: boolean) => void) | null;
  statusChangedUser: { id: string; online: boolean } | undefined;
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
  const { user } = useUser();

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
    if (changeStatus && user) {
      changeStatus(user.id, true);

      window.addEventListener(
        "beforeunload",
        () => changeStatus(user.id, false),
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
