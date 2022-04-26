import React, { useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { getUserByEmail, userImageDownload } from "../services/userService";
import { useBase64Image } from "../hook/useBase64Image";

const UserContext = React.createContext();

UserContext.displayName = "UserContext";

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const { data } = await getUserByEmail(currentUser.sub);
        setUser(data);
        console.log("context");
      }
    }
    getUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
