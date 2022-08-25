import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App/App";
import { createRoot } from "react-dom/client";
import "./styles/_main.scss";
import { UserProvider } from "./context/userContext";
import { ThemeProvider } from "./context/themeContext";
import { ChatProvider } from "./context/chatContext";
import { LanguageProvider } from "./context/languageContext";

document.title = process.env.REACT_APP_NAME as string;

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <LanguageProvider>
          <ThemeProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </ThemeProvider>
        </LanguageProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
