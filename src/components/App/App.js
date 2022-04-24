import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../Form/LoginForm/LoginForm";
import Home from "../Home/Home";
import authService from "../../services/authService";
import { getUserByEmail } from "../../services/userService";
import { useState, useEffect } from "react";
import UserContext from "../../context/userContext";
import Friends from "../Friends/Friends";
import Profile from "../ProfilePage/Profile";
import NotFound from "../NotFound/NotFound";

import "./App.css";
import "../Form/Form.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const { data: user } = await getUserByEmail(currentUser.sub);
        setCurrentUser(user);
      }
    }
    getUser();
  }, []);

  return (
    <>
      <UserContext.Provider value={currentUser}>
        <div className="template">
          <header className="header">{currentUser && <Navbar />}</header>
          <Routes>
            <Route
              path="/"
              element={!currentUser && <Navigate to="/login" push />}
            />

            <Route
              path="/login"
              element={!currentUser ? <LoginForm /> : <Navigate to="/home" />}
            />

            {currentUser && <Route path="/home" element={<Home />} />}
            {currentUser && (
              <Route path="/friends" element={<Friends />}>
                <Route path="all" element={<Home />} />
                <Route path="request" element={<Home />} />
              </Route>
            )}

            <Route path="/profile" element={<Profile />}>
              <Route path="posts" element={<Home />} />
              <Route path="images" element={<Home />} />
              <Route path="videos" element={<Home />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <footer></footer>
        </div>
      </UserContext.Provider>
    </>
  );
}

export default App;
