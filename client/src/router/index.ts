import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import About from "../pages/about";
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
    ],
  },
]);

export default router;
