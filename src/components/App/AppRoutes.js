import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../Form/LoginForm/LoginForm";
import Feed from "../Feed/Feed";
import Friends from "../Friends/Friends";
import Profile from "../ProfilePage/Profile";
import NotFound from "../NotFound/NotFound";
import { useUser } from "../../context/UserContext";
import Logout from "../Form/LoginForm/Logout";
import RegisterForm from "../Form/RegisterForm/RegisterForm";

function AppRoutes(props) {
  const currentUser = useUser();

  return (
    <div className="template">
      <header className="header">{currentUser && <Navbar />}</header>

      <Routes>
        <Route
          path="/"
          element={
            !currentUser ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/login"
          element={!currentUser ? <LoginForm /> : <Navigate to="/home" />}
        />
        <Route
          path="/logout"
          element={currentUser ? <Logout /> : <Navigate to="/login" />}
        />

        <Route path="/register" element={<RegisterForm />} />

        {currentUser && <Route path="/home" element={<Feed />} />}
        {currentUser && (
          <Route path="/friends" element={<Friends />}>
            <Route path="all" element={<NotFound />} />
            <Route path="request" element={<NotFound />} />
          </Route>
        )}

        <Route path="/profile" element={<Profile />}>
          <Route path="posts" element={<NotFound />} />
          <Route path="images" element={<NotFound />} />
          <Route path="videos" element={<NotFound />} />
        </Route>

        <Route
          path="*"
          element={
            !currentUser ? <Navigate to="/login" replace /> : <NotFound />
          }
        />
      </Routes>
      <footer></footer>
    </div>
  );
}

export default AppRoutes;
