import "./App.css";
import { Routes, Route } from "react-router";
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
          </Routes>
        </main>
        <footer></footer>
      </div>
    </>
  );
}

export default App;
