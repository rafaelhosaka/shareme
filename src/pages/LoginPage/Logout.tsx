import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import authService from "../../services/authService";

const Logout = () => {
  const { setStatus } = useUser();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (setStatus) {
      setStatus(false);
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
