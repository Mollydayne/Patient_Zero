import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 1) Si tu utilises Tailwind, garde index.css
import "./index.css";

// 2) Nos styles “maquette claire”
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
