import { UserProvider } from "../../context/userContext";
import AppRoutes from "./AppRoutes";
function App(): JSX.Element {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
