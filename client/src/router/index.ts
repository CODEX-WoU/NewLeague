import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import About from "../pages/about";
import SignIn from "../pages/auth/signin";
import Layout from "./Outlet";
import Signup from "../pages/auth/signup";

const router = createBrowserRouter([
  {
    element: Layout(),
    children: [
      {
        path: "/",
        element: HomePage(),
      },
      {
        path: "/about",
        element: About(),
      },
      {
        path: "/auth",
        children: [
          {
            path: "/auth/signin",
            element: SignIn(),
          },
          {
            path: "/auth/student/signup",
            element: Signup(),
          },
        ],
      },
    ],
  },
]);

export default router;
