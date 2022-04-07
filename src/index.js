import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App/App";
import { createRoot } from "react-dom/client";
import "./assets/styles/normalize.css";
import "./assets/styles/global.css";

document.title = process.env.REACT_APP_NAME;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
