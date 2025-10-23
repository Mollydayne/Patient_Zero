import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./style.css";

import { AuthProvider } from "./context/AuthContext.jsx";
import { RegistrationProvider } from "./context/RegistrationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RegistrationProvider>
          <App />
        </RegistrationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
