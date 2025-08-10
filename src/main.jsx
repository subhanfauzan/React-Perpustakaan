import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "primereact/resources/themes/saga-blue/theme.css"; // Tema (bisa diganti)
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Ikon
import "primeflex/primeflex.css"; // (Opsional) sistem grid

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
