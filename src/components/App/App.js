import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../Login/LoginForm";
import Home from "../Home/Home";
import authService from "../../services/authService";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <>
      <div className="template">
        <header className="header">{user && <Navbar />}</header>
        <main className="container">
          <Routes>
            <Route path="/login" element={<LoginForm />} />

            <Route
              path="/home"
              element={user ? <Home /> : <Navigate to="/login" />}
            />

            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
        <footer></footer>
      </div>
    </>
  );
}

export default App;
