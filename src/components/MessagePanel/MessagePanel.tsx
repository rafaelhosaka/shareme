import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useChat } from "../../context/chatContext";
import { useUser } from "../../context/userContext";
import { useBase64Image } from "../../hook/useBase64Image";
import { useInput } from "../../hook/useInput";
import { MessageEntity } from "../../models/message";
import UserProfileEntity from "../../models/userProfile";
import { getMessages, saveMessage } from "../../services/messageService";
import { getUserById, userImageDownload } from "../../services/userService";
import { formatDate } from "../../utils/formatDate";
import css from "./MessagePanel.module.scss";

interface MessagePanelProps {
  chattingUserId: string;
  minimized: boolean;
  online: boolean;
  onMinimized: (userId: string, imageUrl: string | undefined) => void;
  onClose: (userId: string) => void;
}

const MessagePanel = ({
  chattingUserId,
  minimized,
  online,
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
  const { sendMessage, receivedMessage } = useChat();

  useEffect(() => {
    if (receivedMessage) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  useEffect(() => {
    async function getUserMessages() {
      if (currentUser) {
        const user = await getUserById(chattingUserId);
        setUserImageService(userImageDownload(chattingUserId));
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
    if (currentUser && sendMessage) {
      const { data } = await saveMessage(currentUser.id, chattingUserId, text);
      sendMessage(data);
      setMessages([...messages, data]);
      resetText();
    }
  };

  const mouseOver = (e: React.MouseEvent, id: string) => {
    const tooltip = document.getElementById(`date-sent-${id}`);
    if (tooltip && e.currentTarget instanceof HTMLDivElement) {
      let msgDivOffset = e.currentTarget.getBoundingClientRect();
      tooltip.style.top = msgDivOffset.top + "px";
      tooltip.style.left = msgDivOffset.left - 230 + "px";
    }
  };

  return (
    <>
      {!minimized && (
        <div className={`${css["message-panel"]}`}>
          <div className={css["header"]}>
            <div className={css["user-info"]}>
              <Link
                to={`/profile/${chattingUserId}/posts`}
                className={css["user-name"]}
              >
                <div className={css["user-image__container"]}>
                  <img className={css["user-image"]} src={userImage} />
                  {online && <div className={css["online"]} />}
                </div>
              </Link>
              <Link
                to={`/profile/${chattingUserId}/posts`}
                className={css["user-name"]}
              >
                <span className={css["user-name"]}>
                  {chattingUser?.fullName}
                </span>
              </Link>
            </div>
            <div className={css["btn-area"]}>
              <i
                onClick={() => {
                  onMinimized(chattingUserId, userImage);
                }}
                className={`${css["icon"]} fa-solid fa-minus fa-lg`}
              ></i>
              <i
                onClick={() => onClose(chattingUserId)}
                className={`${css["icon"]} fa-solid fa-xmark fa-lg`}
              ></i>
            </div>
          </div>

          <div className={css["body"]}>
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
