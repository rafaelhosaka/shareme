import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useChat } from "../../context/chatContext";
import { useStompContext } from "../../context/stompContext";
import { useUser } from "../../context/userContext";
import { useBase64Image } from "../../hook/useBase64Image";
import { useInput } from "../../hook/useInput";
import { ChatStatusEntity } from "../../models/websocket";
import { MessageEntity } from "../../models/message";
import UserProfileEntity from "../../models/userProfile";
import { markAsRead } from "../../services/chatService";
import { getMessages, saveMessage } from "../../services/messageService";
import { getUserById, userImageDownload } from "../../services/userService";
import { formatDate } from "../../utils/formatDate";
import { fullName } from "../../utils/formatedNames";
import css from "./MessagePanel.module.scss";
import Spinner from "../Spinner/Spinner";

interface MessagePanelProps {
  chattingUserChat: ChatStatusEntity;
  minimized: boolean;
  onMinimized: (userId: string, imageUrl: string | undefined) => void;
  onClose: (userId: string) => void;
}

const MessagePanel = ({
  chattingUserChat,
  minimized,
  onMinimized,
  onClose,
}: MessagePanelProps) => {
  const { t } = useTranslation();
  const { user: currentUser } = useUser();
  const [chattingUser, setChattingUser] = useState<UserProfileEntity>();
  const [messages, setMessages] = useState<MessageEntity[]>([]);
  const { value: text, bind: bindText, reset: resetText } = useInput("");
  const { image: userImage, setService: setUserImageService } =
    useBase64Image(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { updateCounter } = useChat();
  const { sendMessage, receivedMessage } = useStompContext();
  const [sending, setSending] = useState(false);

  async function markChatAsRead() {
    if (updateCounter && currentUser) {
      const { data } = await markAsRead(currentUser.id, chattingUserChat.id);
      updateCounter(data);
    }
  }

  useEffect(() => {
    if (receivedMessage) {
      if (receivedMessage.sender.id === chattingUserChat.id) {
        setMessages([...messages, receivedMessage]);
        markChatAsRead();
      }
    }
  }, [receivedMessage]);

  useEffect(() => {
    async function getUserMessages() {
      if (currentUser) {
        const user = await getUserById(chattingUserChat.id);
        setUserImageService(userImageDownload(chattingUserChat.id));
        setChattingUser(user);

        const { data } = await getMessages(currentUser.id, user.id);
        setMessages(data);
      }
    }
    getUserMessages();
  }, [currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages, minimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sending || !text) {
      return;
    }
    setSending(true);
    if (currentUser && sendMessage) {
      const { data } = await saveMessage(
        currentUser.id,
        chattingUserChat.id,
        text
      );
      sendMessage(data);
      setMessages([...messages, data]);
      resetText();
      setSending(false);
    }
  };

  const mouseOver = (e: React.MouseEvent, id: string) => {
    const body = document.getElementById(`body-${chattingUserChat.id}`);
    const tooltip = document.getElementById(`date-sent-${id}`);
    if (tooltip && body && e.currentTarget instanceof HTMLDivElement) {
      let bodyOffset = body.getBoundingClientRect();
      let msgDivOffset = e.currentTarget.getBoundingClientRect();
      if (msgDivOffset.top < bodyOffset.top) {
        tooltip.style.top = bodyOffset.top + "px";
      } else {
        tooltip.style.top = msgDivOffset.top + "px";
      }
      tooltip.style.left = msgDivOffset.left - 230 + "px";
    }
  };

  return (
    <>
      {!minimized && (
        <div className={`${css["message-panel"]} ${css["panel"]}`}>
          <div className={css["header"]}>
            <div className={css["user-info"]}>
              <Link
                to={`/profile/${chattingUserChat.id}/posts`}
                className={css["user-name"]}
              >
                <Spinner show={!userImage} sizeClass={"size--30"}>
                  <div className={css["user-image__container"]}>
                    <img className={css["user-image"]} src={userImage} />
                    {chattingUserChat.online && chattingUserChat.connected && (
                      <div className={css["online"]} />
                    )}
                  </div>
                </Spinner>
              </Link>
              <Link
                to={`/profile/${chattingUserChat.id}/posts`}
                className={css["user-name"]}
              >
                <span className={css["user-name"]}>
                  {fullName(chattingUser)}
                </span>
              </Link>
            </div>
            <div className={css["btn-area"]}>
              <i
                onClick={() => {
                  onMinimized(chattingUserChat.id, userImage);
                }}
                className={`${css["icon"]} fa-solid fa-minus fa-lg`}
              ></i>
              <i
                onClick={() => onClose(chattingUserChat.id)}
                className={`${css["icon"]} fa-solid fa-xmark fa-lg`}
              ></i>
            </div>
          </div>

          <div id={`body-${chattingUserChat.id}`} className={css["body"]}>
            {messages.map((message) => (
              <div key={message.id} className={css["message__container"]}>
                <div
                  onMouseOver={(e) => mouseOver(e, message.id)}
                  className={`${css["message"]} ${
                    message.sender.id === currentUser?.id ? css["mine"] : ""
                  }`}
                >
                  <span>{message.content}</span>
                </div>
                <div
                  id={`date-sent-${message.id}`}
                  className={css["date-sent"]}
                >
                  {formatDate(message.dateSent!, t("DATE.bcp47"))}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSendMessage}>
            <div className={css["footer"]}>
              <input type="text" {...bindText} />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default MessagePanel;
