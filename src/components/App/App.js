import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../Form/LoginForm/LoginForm";
import Home from "../Home/Home";
import authService from "../../services/authService";
import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/userContext";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const userContext = useContext(UserContext);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    setCurrentUser(currentUser);
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
