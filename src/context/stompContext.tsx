import React, { useContext, useEffect } from "react";
import { useStomp } from "../hook/useStomp";
import { ChatStatusEntity, FriendInformationEntity } from "../models/websocket";
import FriendRequestEntity from "../models/friendRequest";
import { MessageEntity } from "../models/message";
import { NotificationEntity } from "../models/notification";
import { updateUser } from "../services/userService";
import { useUser } from "./userContext";
import UserProfileEntity from "../models/userProfile";

interface StompContextInterface {
  sendMessage: ((message: MessageEntity) => void) | null;
  receivedMessage: MessageEntity | undefined;
  changeStatus:
    | ((id: string, status: boolean, connected: boolean) => void)
    | null;
  statusChangedUser: ChatStatusEntity | undefined;
  sendNotification: ((notification: NotificationEntity) => void) | null;
  receivedNotification: NotificationEntity | undefined;
  sendNewRequest: ((notification: FriendRequestEntity) => void) | null;
  receivedNewRequest: FriendRequestEntity | undefined;
  sendRemovedRequest: ((notification: FriendRequestEntity) => void) | null;
  receivedRemovedRequest: FriendRequestEntity | undefined;
  sendNewFriend: ((friendInfo: FriendInformationEntity) => void) | null;
  receivedNewFriend: FriendInformationEntity | undefined;
  sendRemovedFriend: ((friendInfo: FriendInformationEntity) => void) | null;
  receivedRemovedFriend: FriendInformationEntity | undefined;
}

const StompContext = React.createContext<StompContextInterface>({
  sendMessage: null,
  receivedMessage: undefined,
  changeStatus: null,
  statusChangedUser: undefined,
  sendNotification: null,
  receivedNotification: undefined,
  sendNewRequest: null,
  receivedNewRequest: undefined,
  sendRemovedRequest: null,
  receivedRemovedRequest: undefined,
  sendNewFriend: null,
  receivedNewFriend: undefined,
  sendRemovedFriend: null,
  receivedRemovedFriend: undefined,
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
    connect,
    sendMessage,
    receivedMessage,
    changeStatus,
    statusChangedUser,
    sendNotification,
    receivedNotification,
    sendNewRequest,
    receivedNewRequest,
    sendRemovedRequest,
    receivedRemovedRequest,
    sendNewFriend,
    receivedNewFriend,
    sendRemovedFriend,
    receivedRemovedFriend,
    isConnected,
  } = useStomp();

  useEffect(() => {
    connect();
  }, [user]);

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

  useEffect(() => {
    if (
      receivedNewFriend &&
      user &&
      !user.friends.includes(receivedNewFriend.friend.id) &&
      setUser
    ) {
      const newUser = new UserProfileEntity(user);
      newUser.friends = [...user.friends, receivedNewFriend.friend.id];
      setUser(newUser);
    }
  }, [receivedNewFriend]);

  useEffect(() => {
    if (receivedRemovedFriend && user && setUser) {
      const newFriendsId = user.friends.filter(
        (id) => id !== receivedRemovedFriend.friend.id
      );
      const newUser = new UserProfileEntity(user);
      newUser.friends = newFriendsId;
      setUser(newUser);
    }
  }, [receivedRemovedFriend]);

  return (
    <StompContext.Provider
      value={{
        sendMessage,
        receivedMessage,
        changeStatus,
        statusChangedUser,
        sendNotification,
        receivedNotification,
        sendNewRequest,
        receivedNewRequest,
        sendRemovedRequest,
        receivedRemovedRequest,
        sendNewFriend,
        receivedNewFriend,
        sendRemovedFriend,
        receivedRemovedFriend,
      }}
    >
      {children}
    </StompContext.Provider>
  );
}
