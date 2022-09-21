import { useEffect, useState } from "react";
import { useStompContext } from "../../context/stompContext";
import { useUser } from "../../context/userContext";
import authService from "../../services/authService";

const Logout = () => {
  const [finished, setFinished] = useState(false);
  const { user } = useUser();
  const { changeStatus } = useStompContext();

  useEffect(() => {
    if (changeStatus && user) {
      changeStatus(user.id, user.online, false);
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
