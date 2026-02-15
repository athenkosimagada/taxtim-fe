import { createBrowserRouter, Navigate } from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";

import HomePage from "../../pages/HomePage";
import NotFoundPage from "../../pages/NotFoundPage";
import ErrorPage from "../../pages/ErrorPage";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";

import DashboardPage from "../../features/dashboard/pages/DashboardPage";

import RequireAuth from "../../features/auth/components/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { index: false, path: "login", element: <LoginPage /> },
      { index: false, path: "register", element: <RegisterPage /> },

      { index: true, element: <Navigate to="login" replace /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
