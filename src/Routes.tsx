import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { Login, MainLayout } from "./pages";

export const publicRoutes = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <Navigate to="/login" />,
    }
  ]);

  export const privateRoutes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
    },
    {
        path: "*",
        element: <Navigate to="/" />,
      }
  ]);