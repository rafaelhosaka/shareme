import { useEffect, useState } from "react";
import { useChat } from "../../context/chatContext";
import { useUser } from "../../context/userContext";
import authService from "../../services/authService";

const Logout = () => {
  const [finished, setFinished] = useState(false);
  const { user } = useUser();
  const { changeStatus } = useChat();

  useEffect(() => {
    if (changeStatus && user) {
      changeStatus(user.id, false);
      setFinished(true);
    }
  }, []);

  useEffect(() => {
    if (finished) {
      authService.logout();
      window.location.href = "/";
    }
  }, [finished]);

  return <></>;
};

export default Logout;
