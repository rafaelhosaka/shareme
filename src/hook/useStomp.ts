import { FriendInformationEntity } from "./../models/websocket";
import {
  FriendAcceptedNotificationEntity,
  FriendRequestNotificationEntity,
  NotificationEntity,
} from "./../models/notification";
import { MessageEntity } from "./../models/message";
import { over, Client } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import FriendRequestEntity from "../models/friendRequest";
import { ChatStatusEntity } from "../models/websocket";
import _ from "lodash";

export const useStomp = (): {
  connect: () => void;
  sendMessage: (message: MessageEntity) => void;
  receivedMessage: MessageEntity | undefined;
  changeStatus: (id: string, status: boolean, connected: boolean) => void;
  statusChangedUser: ChatStatusEntity | undefined;
  sendNotification: (notification: NotificationEntity) => void;
  receivedNotification: NotificationEntity | undefined;
  sendNewRequest: (request: FriendRequestEntity) => void;
  receivedNewRequest: FriendRequestEntity | undefined;
  sendRemovedRequest: (request: FriendRequestEntity) => void;
  receivedRemovedRequest: FriendRequestEntity | undefined;
  sendNewFriend: (newFriend: FriendInformationEntity) => void;
  receivedNewFriend: FriendInformationEntity | undefined;
  sendRemovedFriend: (newFriend: FriendInformationEntity) => void;
  receivedRemovedFriend: FriendInformationEntity | undefined;
  isConnected: boolean;
} => {
  const { user } = useUser();
  const [stompClient, setStompClient] = useState<Client>();
  const [receivedMessage, setReceivedMessage] = useState<MessageEntity>();
  const [statusChangedUser, setStatusChangedUser] =
    useState<ChatStatusEntity>();
  const [receivedNotification, setReceivedNotification] =
    useState<NotificationEntity>();
  const [receivedNewRequest, setReceivedNewRequest] =
    useState<FriendRequestEntity>();
  const [receivedRemovedRequest, setReceivedRemovedRequest] =
    useState<FriendRequestEntity>();
  const [receivedNewFriend, setReceivedNewFriend] =
    useState<FriendInformationEntity>();
  const [receivedRemovedFriend, setReceivedRemovedFriend] =
    useState<FriendInformationEntity>();
  const [isConnected, setConnected] = useState(false);

  const connect = () => {
    if (!isConnected) {
      let socket = new SockJS(process.env.REACT_APP_SOCKET_URL as string);
      let client = over(socket);
      client.connect({}, onConnected, onError);
      client.debug = () => {};
      setStompClient(client);
    }
  };

  useEffect(() => {
    if (isConnected && stompClient?.connected) {
      user?.friends.map((friendId) => {
        stompClient.subscribe(`/user/${friendId}/status`, onStatusUpdated);
      });

      stompClient.subscribe(`/user/${user?.id}/message`, onMessageReceived);
      stompClient.subscribe(
        `/user/${user?.id}/notification`,
        onNotificationReceived
      );
      stompClient.subscribe(`/user/${user?.id}/newRequest`, onRequestReceived);
      stompClient.subscribe(
        `/user/${user?.id}/removeRequest`,
        onRemovedRequestReceived
      );
      stompClient.subscribe(`/user/${user?.id}/newFriend`, onNewFriendReceived);
      stompClient.subscribe(
        `/user/${user?.id}/removeFriend`,
        onRemovedFriendReceived
      );
    }
  }, [isConnected, stompClient]);

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
    const notification = JSON.parse(payload.body);
    if (_.has(notification, "friendRequesting")) {
      setReceivedNotification(
        new FriendRequestNotificationEntity(notification)
      );
    } else {
      setReceivedNotification(
        new FriendAcceptedNotificationEntity(notification)
      );
    }
  };

  const onRequestReceived = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    setReceivedNewRequest(payloadData);
  };

  const onRemovedRequestReceived = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    setReceivedRemovedRequest(payloadData);
  };

  const onNewFriendReceived = (payload: any) => {
    const payloadData: FriendInformationEntity = JSON.parse(payload.body);

    setReceivedNewFriend(payloadData);
  };

  const onRemovedFriendReceived = (payload: any) => {
    const payloadData: FriendInformationEntity = JSON.parse(payload.body);

    setReceivedRemovedFriend(payloadData);
  };

  const onError = (err: any) => {
    console.log("STOMP: " + err);
    setConnected(false);
    setTimeout(connect, 10000);
    console.log("STOMP: Reconecting in 10 seconds");
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

  const sendNewRequest = (request: FriendRequestEntity) => {
    if (stompClient?.connected) {
      stompClient.send("/app/newRequest", {}, JSON.stringify(request));
    }
  };

  const sendRemovedRequest = (request: FriendRequestEntity) => {
    if (stompClient?.connected) {
      stompClient.send("/app/removeRequest", {}, JSON.stringify(request));
    }
  };

  const sendNewFriend = (friendInfo: FriendInformationEntity) => {
    if (stompClient?.connected) {
      stompClient.send("/app/newFriend", {}, JSON.stringify(friendInfo));
    }
  };

  const sendRemovedFriend = (friendInfo: FriendInformationEntity) => {
    if (stompClient?.connected) {
      stompClient.send("/app/removeFriend", {}, JSON.stringify(friendInfo));
    }
  };

  return {
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
  };
};
