import React, { useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { getUserByEmail, userImageDownload } from "../services/userService";
import { useBase64Image } from "../hook/useBase64Image";

const UserContext = React.createContext();
const UserImageContext = React.createContext();

UserContext.displayName = "UserContext";
UserImageContext.displayName = "UserImageContext";

export function useUser() {
  return useContext(UserContext);
}

export function useUserImage() {
  return useContext(UserImageContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const { image: userImage, setService: setService } = useBase64Image(null);

  useEffect(() => {
    async function getUser() {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const { data } = await getUserByEmail(currentUser.sub);
        setService(userImageDownload(data.id));
        setUser(data);
      }
    }
    getUser();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserImageContext.Provider value={userImage}>
        {children}
      </UserImageContext.Provider>
    </UserContext.Provider>
  );
}
