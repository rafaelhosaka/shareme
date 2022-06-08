import { UserProvider } from "../../context/userContext";

import "../Form/Form.css";
import AppRoutes from "./AppRoutes";
function App(): JSX.Element {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
