import { useParams } from "react-router";

const ChatMenuContent = () => {
  const { id } = useParams();

  return <div>{id}</div>;
};

export default ChatMenuContent;
