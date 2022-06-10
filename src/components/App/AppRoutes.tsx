import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../Form/LoginForm/LoginForm";
import Feed from "../Feed/Feed";
import Friends from "../Friends/Friends";
import Profile from "../ProfilePage/Profile";
import NotFound from "../NotFound/NotFound";
import { useUser } from "../../context/userContext";
import Logout from "../Form/LoginForm/Logout";
import RegisterForm from "../Form/RegisterForm/RegisterForm";
import Search from "../Search/Search";
import FriendRequestList from "../Friends/FriendRequest/FriendRequestList";
import ProtectedRoutes from "../ProtectedRoutes/ProtectedRoutes";
import Unauthorized from "../Unauthorized/Unauthorized";

const userRole = ["ROLE_USER"];
const adminRole = ["ROLE_ADMIN"];

function AppRoutes() {
  const { user: currentUser } = useUser();

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

          <Route path="/friends" element={<Friends />}>
            <Route path="all" element={<NotFound />} />
            <Route path="request" element={<FriendRequestList />} />
          </Route>

          <Route path="/profile/:id" element={<Profile />}>
            <Route path="posts" element={<NotFound />} />
            <Route path="friends" element={<NotFound />} />
            <Route path="photos" element={<NotFound />} />
            <Route path="videos" element={<NotFound />} />
          </Route>

          <Route path="/logout" element={<Logout />} />
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={adminRole} />}>
          <Route path="/search/:filter" element={<Search />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
