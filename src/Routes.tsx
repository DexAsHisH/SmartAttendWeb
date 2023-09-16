import { createBrowserRouter, Navigate } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { Dashboard, Login, Root} from "./pages";
import { Signup } from "./pages/Authentication";
import { Attendence } from "./pages/Root/Attencence";
import { Profile } from "./pages/Root/Profile";

export const publicRoutes = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <Signup />,
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
      element: <Root />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "qr-code",
          element: <Attendence />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ]
    },
    {
        path: "*",
        element: <Navigate to="/" />,
      }
  ]);