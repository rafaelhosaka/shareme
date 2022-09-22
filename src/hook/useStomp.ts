import { NewFriendInformationEntity } from "./../models/websocket";
import { NotificationEntity } from "./../models/notification";
import { MessageEntity } from "./../models/message";
import { over, Client } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import FriendRequestEntity from "../models/friendRequest";
import { ChatStatusEntity } from "../models/websocket";

export const useStomp = (): {
  sendMessage: (message: MessageEntity) => void;
  receivedMessage: MessageEntity | undefined;
  changeStatus: (id: string, status: boolean, connected: boolean) => void;
  statusChangedUser: ChatStatusEntity | undefined;
  sendNotification: (notification: NotificationEntity) => void;
  receivedNotification: NotificationEntity | undefined;
  sendRequest: (request: FriendRequestEntity) => void;
  receivedRequest: FriendRequestEntity | undefined;
  sendNewFriend: (newFriend: NewFriendInformationEntity) => void;
  receivedNewFriend: NewFriendInformationEntity | undefined;
  isConnected: boolean;
} => {
  const { user } = useUser();
  const [stompClient, setStompClient] = useState<Client>();
  const [receivedMessage, setReceivedMessage] = useState<MessageEntity>();
  const [statusChangedUser, setStatusChangedUser] =
    useState<ChatStatusEntity>();
  const [receivedNotification, setReceivedNotification] =
    useState<NotificationEntity>();
  const [receivedRequest, setReceivedRequest] = useState<FriendRequestEntity>();
  const [receivedNewFriend, setReceivedNewFriend] =
    useState<NewFriendInformationEntity>();
  const [isConnected, setConnected] = useState(false);

  const connect = () => {
    let socket = new SockJS(process.env.REACT_APP_SOCKET_URL as string);
    let client = over(socket);

    client.connect({}, onConnected, onError);
    client.debug = () => {};
    setStompClient(client);
  };

  useEffect(() => {
    if (isConnected && stompClient) {
      user?.friends.map((friendId) => {
        stompClient.subscribe(`/user/${friendId}/status`, onStatusUpdated);
      });

      stompClient.subscribe(`/user/${user?.id}/message`, onMessageReceived);
      stompClient.subscribe(
        `/user/${user?.id}/notification`,
        onNotificationReceived
      );
      stompClient.subscribe(`/user/${user?.id}/request`, onRequestReceived);
      stompClient.subscribe(`/user/${user?.id}/friend`, onNewFriendReceived);
    }
  }, [isConnected]);

  const onConnected = () => {
    setTimeout(() => {
      setConnected(true);
    }, 1000);
  };

  const onStatusUpdated = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    setStatusChangedUser(payloadData);
  };

  const onMessageReceived = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    setReceivedMessage(payloadData);
  };

  const onNotificationReceived = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    setReceivedNotification(payloadData);
  };

  const onRequestReceived = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    setReceivedRequest(payloadData);
  };

  const onNewFriendReceived = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    console.log(payloadData);

    setReceivedNewFriend(payloadData);
  };

  const onError = (err: any) => {
    console.log("onError : " + err);
  };

  const sendMessage = (message: MessageEntity) => {
    if (stompClient?.connected) {
      stompClient.send("/app/message", {}, JSON.stringify(message));
    }
  };

  const changeStatus = (id: string, online: boolean, connected: boolean) => {
    if (stompClient?.connected) {
      stompClient.send(
        "/app/change-status",
        {},
        JSON.stringify({ id, online, connected })
      );
    }
  };

  const sendNotification = (notification: NotificationEntity) => {
    if (stompClient?.connected) {
      stompClient.send("/app/notification", {}, notification.id);
    }
  };

  const sendRequest = (request: FriendRequestEntity) => {
    if (stompClient?.connected) {
      stompClient.send("/app/request", {}, JSON.stringify(request));
    }
  };

  const sendNewFriend = (newFriend: NewFriendInformationEntity) => {
    if (stompClient?.connected) {
      stompClient.send("/app/friend", {}, JSON.stringify(newFriend));
    }
  };

  useEffect(() => {
    if (user) {
      connect();
    }
  }, [user]);

  return {
    sendMessage,
    receivedMessage,
    changeStatus,
    statusChangedUser,
    sendNotification,
    receivedNotification,
    sendRequest,
    receivedRequest,
    sendNewFriend,
    receivedNewFriend,
    isConnected,
  };
};
