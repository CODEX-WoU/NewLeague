import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import About from "../pages/about";
import SignIn from "../pages/auth/signin";
import Layout from "./Outlet";

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
        ],
      },
    ],
  },
]);

export default router;
