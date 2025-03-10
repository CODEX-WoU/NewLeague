import { useEffect, useState } from "react";
import {} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";

const TheHeader = () => {
  const [isCompact, setIsCompact] = useState(false);

  // Adjust padding based on screen width
  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 1920);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigLinks = { home: "/", about: "/about", slotBooking: "/book-slots" };

  return (
    <div
      className={`sticky top-0 z-10 navbar font-plain bg-black text-white py-3 ${
        isCompact ? "px-24" : "2xl:px-48"
      }`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <GiHamburgerMenu />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm bg-black dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to={navigLinks.home}>HOME</Link>
            </li>
            <li>
              <Link to={navigLinks.about}>ABOUT</Link>
            </li>
            <li>
              <a>EVENTS</a>
            </li>
            <li>
              <a>FACILITIES</a>
            </li>
            <li>
              <Link to={navigLinks.slotBooking}>BOOKINGS</Link>
            </li>
            <li>
              <a>PRO SHOP</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl lg:text-3xl font-extrabold">
          Woxsen Sports Academy
        </a>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul
          className={`menu menu-horizontal ${
            isCompact ? "gap-x-4" : "gap-x-8"
          } [&_a:hover]:text-primary px-1`}
        >
          <li>
            <Link className="focus:text-white" to={navigLinks.home}>
              HOME
            </Link>
          </li>
          <li>
            <Link className="focus:text-white" to={navigLinks.about}>
              ABOUT
            </Link>
          </li>
          <li>
            <a>EVENTS</a>
          </li>
          <li>
            <a>FACILITIES</a>
          </li>
          <li>
            <Link to={navigLinks.slotBooking}>BOOKING</Link>
          </li>
          <li>
            <a>PRO SHOP</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TheHeader;
