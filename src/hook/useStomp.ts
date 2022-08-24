import { MessageEntity } from "./../models/message";
import { over, Client } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";

export const useStomp = (): [
  send: (message: MessageEntity) => void,
  receivedMessage: MessageEntity | undefined,
  changeStatus: (id: string, status: boolean) => void,
  statusChangedUser: { id: string; online: boolean } | undefined,
  isConnected: boolean
] => {
  const { user } = useUser();
  const [receivedMessage, setReceivedMessage] = useState<MessageEntity>();
  const [stompClient, setStompClient] = useState<Client>();
  const [statusChangedUser, setStatusChangedUser] = useState<{
    id: string;
    online: boolean;
  }>();
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (stompClient) {
      stompClient.connect({}, onConnected, onError);
      stompClient.debug = () => {};
    }
  }, [stompClient, user]);

  const connect = () => {
    let socket = new SockJS(process.env.REACT_APP_SOCKET_URL as string);
    let client = over(socket);
    setStompClient(client);
  };

  const onConnected = () => {
    if (stompClient) {
      user?.friends.map((friendId) => {
        stompClient.subscribe(`/user/${friendId}/status`, onStatusUpdated);
      });

      stompClient.subscribe(`/user/${user?.id}/private`, onMessageReceived);
      setConnected(true);
    }
  };

  const onStatusUpdated = (payload: any) => {
    console.log("statusupdated");

    const payloadData = JSON.parse(payload.body);
    setStatusChangedUser(payloadData);
  };

  const onMessageReceived = (payload: any) => {
    const payloadData = JSON.parse(payload.body);
    setReceivedMessage(payloadData);
  };

  const onError = (err: any) => {
    console.log("onError : " + err);
  };

  const sendMessage = (message: MessageEntity) => {
    if (stompClient?.connected) {
      stompClient?.send("/app/message", {}, JSON.stringify(message));
    }
  };

  const changeStatus = (id: string, online: boolean) => {
    if (stompClient?.connected) {
      stompClient.send(
        "/app/change-status",
        {},
        JSON.stringify({ id, online })
      );
    }
  };

  return [
    sendMessage,
    receivedMessage,
    changeStatus,
    statusChangedUser,
    isConnected,
  ];
};
