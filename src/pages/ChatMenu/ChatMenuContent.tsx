import { useParams } from "react-router";
import ChatMessagePanel from "../../components/MessagePanel/ChatMessagePanel";

const ChatMenuContent = () => {
  const { id } = useParams();

  return <div>{id && <ChatMessagePanel chattingUserId={id} />}</div>;
};

export default ChatMenuContent;
