import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./style.css";

// importe le provider
import { RegistrationProvider } from "./context/RegistrationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* on entoure App avec le provider */}
      <RegistrationProvider>
        <App />
      </RegistrationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
