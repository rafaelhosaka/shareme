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

function AppRoutes() {
  const { user: currentUser } = useUser();

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
            <Route path="request" element={<FriendRequestList />} />
          </Route>
        )}

        {currentUser && (
          <Route path="/profile/:id" element={<Profile />}>
            <Route path="posts" element={<NotFound />} />
            <Route path="friends" element={<NotFound />} />
            <Route path="photos" element={<NotFound />} />
            <Route path="videos" element={<NotFound />} />
          </Route>
        )}
        {currentUser && (
          <Route
            path="/search/:filter"
            element={<Search currentUser={currentUser} />}
          />
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
