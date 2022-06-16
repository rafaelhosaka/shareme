import { useTheme } from "../../context/themeContext";
import { useUser } from "../../context/userContext";
import AppRoutes from "./AppRoutes";
import { useEffect } from "react";
function App(): JSX.Element {
  const { user: currentUser } = useUser();
  const isDark = useTheme();

  useEffect(() => {
    if (isDark) {
      document.getElementsByTagName("html")[0].classList.add("dark");
    } else {
      document.getElementsByTagName("html")[0].classList.remove("dark");
    }
  }, [isDark]);

  return <AppRoutes currentUser={currentUser} />;
}

export default App;
