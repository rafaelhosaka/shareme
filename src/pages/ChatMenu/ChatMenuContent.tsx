import { useParams } from "react-router";
import ChatMessagePanel from "../../components/MessagePanel/ChatMessagePanel";
import { MessageEntity } from "../../models/message";

interface ChatMenuContentProps {
  onSend: (message: MessageEntity, friendId: string) => void;
}

const ChatMenuContent = ({ onSend }: ChatMenuContentProps) => {
  const { id } = useParams();

  return (
    <div>{id && <ChatMessagePanel onSend={onSend} chattingUserId={id} />}</div>
  );
};

export default ChatMenuContent;
