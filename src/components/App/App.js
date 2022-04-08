import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../Login/LoginForm";
import Home from "../Home/Home";

function App() {
  return (
    <>
      <div className="template">
        <header className="header">
          <Navbar />
        </header>
        <main className="container">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
        <footer></footer>
      </div>
    </>
  );
}

export default App;
