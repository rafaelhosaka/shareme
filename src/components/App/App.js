import "./App.css";
import LoginForm from "../Login/LoginForm";
import { Routes, Route } from "react-router";
import Navbar from "../NavBar/NavBar";
import { Fragment } from "react";

function App() {
  return (
    <Fragment>
      <div className="template">
        <header className="header">
          <Navbar />
        </header>
        <main className="container">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </main>
        <footer></footer>
      </div>
    </Fragment>
  );
}

export default App;
