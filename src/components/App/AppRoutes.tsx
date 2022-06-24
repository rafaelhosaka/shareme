import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../../pages/LoginPage/LoginForm";
import Feed from "../../pages/Feed/Feed";
import FriendMenu from "../../pages/FriendMenu/FriendMenu";
import Profile from "../../pages/ProfilePage/Profile";
import NotFound from "../../pages/NotFound/NotFound";
import Logout from "../../pages/LoginPage/Logout";
import RegisterForm from "../../pages/RegisterPage/RegisterForm";
import SearchMenu from "../../pages/SearchMenu/SearchMenu";
import ProtectedRoutes from "../ProtectedRoutes/ProtectedRoutes";
import Unauthorized from "../../pages/Unauthorized/Unauthorized";
import UserProfileEntity from "../../models/userProfile";
import ChatMenu from "../Chat/ChatMenu";

const userRole = ["ROLE_USER"];
const adminRole = ["ROLE_ADMIN"];

interface AppRoutesProps {
  currentUser: UserProfileEntity | undefined;
}

function AppRoutes({ currentUser }: AppRoutesProps) {
  return (
    <div className="template">
      <header className="header">{currentUser && <Navbar />}</header>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/home" /> : <LoginForm />}
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/home" /> : <RegisterForm />}
        />

        {/* USER and ADMIN */}
        <Route
          element={
            <ProtectedRoutes allowedRoles={[...userRole, ...adminRole]} />
          }
        >
          <Route path="/home" element={<Feed />} />

          <Route path="/friends/:option" element={<FriendMenu />} />

          <Route path="/chat" element={<ChatMenu />}>
            <Route path="all" element={<NotFound />} />
          </Route>

          <Route path="/profile/:id/:option" element={<Profile />} />

          <Route path="/search/:filter" element={<SearchMenu />} />

          <Route path="/logout" element={<Logout />} />
        </Route>

        {/* ADMIN */}
        <Route element={<ProtectedRoutes allowedRoles={adminRole} />}></Route>

        {/* Others */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
