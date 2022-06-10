import React, { useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { getUserByEmail, userImageDownload } from "../services/userService";
import { useBase64Image } from "../hook/useBase64Image";
import UserProfileEntity from "../models/userProfile";

interface UserContextInterface {
  user?: UserProfileEntity;
  setUser: (user: UserProfileEntity) => void;
}

const UserContext = React.createContext<Partial<UserContextInterface>>({});
const UserImageContext = React.createContext<string | undefined>(undefined);

UserContext.displayName = "UserContext";
UserImageContext.displayName = "UserImageContext";

export function useUser() {
  return useContext(UserContext);
}

export function useUserImage() {
  return useContext(UserImageContext);
}

interface UserProviderProps {
  children: JSX.Element;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProfileEntity | null>(null);

  const { image: userImage, setService: setService } = useBase64Image(null);

  useEffect(() => {
    async function getUser() {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const data = await getUserByEmail(currentUser.sub);
        setService(userImageDownload(data.id));
        data.roles = currentUser.roles;
        setUser(data);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      setService(userImageDownload(user.id));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser } as UserContextInterface}>
      <UserImageContext.Provider value={userImage}>
        {children}
      </UserImageContext.Provider>
    </UserContext.Provider>
  );
}
