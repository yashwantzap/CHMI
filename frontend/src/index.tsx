import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import { LoginProvider } from "./context/LoginContext";
import ToastManager from "./components/ToastManager";   // <-- correct import

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LoginProvider>
        <App />
        <ToastManager />     {/* <-- this must be rendered */}
      </LoginProvider>
    </BrowserRouter>
  </React.StrictMode>
);
