import { useTheme } from "../../context/themeContext";
import AppRoutes from "./AppRoutes";
import { useEffect } from "react";
function App(): JSX.Element {
  const isDark = useTheme();

  useEffect(() => {
    if (isDark) {
      document.getElementsByTagName("html")[0].classList.add("dark");
    } else {
      document.getElementsByTagName("html")[0].classList.remove("dark");
    }
  }, [isDark]);

  return <AppRoutes />;
}

export default App;
