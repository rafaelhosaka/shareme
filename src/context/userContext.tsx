import React, { useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { getUserByEmail, userImageDownload } from "../services/userService";
import { useBase64File } from "../hook/useBase64File";
import UserProfileEntity from "../models/userProfile";

interface UserContextInterface {
  user?: UserProfileEntity;
  setUser: (user: UserProfileEntity) => void;
  loading: boolean;
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
  const {
    file: userImage,
    executeRequest: userImageDownloadExecute,
    cancelRequest: userImageDownloadCancel,
  } = useBase64File(userImageDownload);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const data = await getUserByEmail(currentUser.sub);
        userImageDownloadExecute(data.id);
        data.roles = currentUser.roles;
        setUser(data);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    setLoading(true);
    getUser();

    return () => {
      userImageDownloadCancel();
    };
  }, []);

  useEffect(() => {
    if (user) {
      userImageDownloadExecute(user.id);
    }
  }, [user]);

  const updateUser = (user: UserProfileEntity) => {
    if (!user.roles || user.roles.length === 0) {
      user.roles = authService.getRoles();
    }
    setUser(user);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser: updateUser, loading } as UserContextInterface}
    >
      <UserImageContext.Provider value={userImage}>
        {children}
      </UserImageContext.Provider>
    </UserContext.Provider>
  );
}
