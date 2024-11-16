/**
 * @author {Harsh Morayya} <harshmorayya@ymail.com>
 * @file Contains outlet for routing which allows to have fixed header and footer
 */

import { Outlet } from "react-router-dom";
import TheHeader from "../components/layout/TheHeader";
import TheFooter from "../components/layout/TheFooter";

function Layout() {
  return (
    <>
      <TheHeader />
      <Outlet />
      <TheFooter />
    </>
  );
}

export default Layout;
