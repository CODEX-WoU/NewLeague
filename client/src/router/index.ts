import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import About from "../pages/about";

const router = createBrowserRouter([
  {
    path: "/",
    element: HomePage(),
  },
  {
    path: "/about",
    element: About(),
  },
]);

export default router;
