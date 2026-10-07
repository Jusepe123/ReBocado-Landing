import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import PwaApp from "./app/PwaApp.jsx";
import "./styles.css";
import "./brand.css";
import "./app/app.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PwaApp />
    </BrowserRouter>
  </React.StrictMode>,
);
