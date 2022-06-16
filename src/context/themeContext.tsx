import React, { useContext, useEffect, useState } from "react";
import { useUser } from "./userContext";

const ThemeContext = React.createContext<boolean>(false);

ThemeContext.displayName = "ThemeContext";

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: JSX.Element;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { user } = useUser();
  const [dark, setDark] = useState(false);
  const [listener] = useState<MediaQueryList>(
    window.matchMedia("(prefers-color-scheme: dark)")
  );

  const isDeviceDarkTheme = () => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return true;
    } else {
      return false;
    }
  };

  const matchTheme = (event: MediaQueryListEvent) => {
    setDark(event.matches ? true : false);
  };

  const addListener = () => {
    if (listener) {
      listener.addEventListener("change", matchTheme, true);
    }
  };

  const removeListener = () => {
    if (listener) {
      listener.removeEventListener("change", matchTheme, true);
    }
  };

  useEffect(() => {
    if (user) {
      removeListener();
      switch (user.themePreference) {
        case "light":
          setDark(false);
          break;
        case "dark":
          setDark(true);
          break;
        default:
          setDark(isDeviceDarkTheme());
          addListener();
      }
    } else {
      setDark(isDeviceDarkTheme());
      addListener();
    }

    return () => {
      removeListener();
    };
  }, [user]);

  return <ThemeContext.Provider value={dark}>{children}</ThemeContext.Provider>;
}
