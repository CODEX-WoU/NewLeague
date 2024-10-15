import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";

const router = createBrowserRouter([
  {
    path: "/",
    element: HomePage(),
  },
]);

export default router;
