import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./app/router/router";
import { AuthProvider } from "./features/auth/hooks/useAuth";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
    </AuthProvider>
  </React.StrictMode>,
);
