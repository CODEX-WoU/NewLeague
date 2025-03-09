import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/homepage";
import About from "../pages/about";
import SignIn from "../pages/auth/signin";
import Layout from "./Outlet";
import SignUp from "../pages/auth/signup";
import SlotBooking from "../pages/book_slot";

const router = createBrowserRouter([
  {
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/auth",
        children: [
          {
            path: "/auth/signin",
            element: <SignIn />,
          },
          {
            path: "/auth/student/signup",
            element: <SignUp />,
          },
        ],
      },
      {
        path: "/book-slots",
        element: <SlotBooking />,
      },
    ],
  },
]);

export default router;
