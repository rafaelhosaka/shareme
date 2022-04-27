import { useEffect } from "react";
import authService from "../../../services/authService";

const Logout = (props) => {
  useEffect(() => {
    authService.logout();
    window.location = "/";
  }, []);
};

export default Logout;
