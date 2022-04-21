import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../Form/LoginForm/LoginForm";
import Home from "../Home/Home";
import authService from "../../services/authService";
import { getUserByEmail } from "../../services/userService";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/userContext";

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
          <main className="container">
            <Routes>
              <Route
                path="/login"
                element={!currentUser ? <LoginForm /> : <Navigate to="/home" />}
              />

              {currentUser && <Route path="/home" element={<Home />} />}

              <Route
                path="/*"
                element={!currentUser && <Navigate to="/login" push />}
              />
            </Routes>
          </main>
          <footer></footer>
        </div>
      </UserContext.Provider>
    </>
  );
}

export default App;
