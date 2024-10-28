const TheHeader = () => {
  return (
    <div className="navbar font-plain md:px-12 xl:px-24 2xl:px-72 bg-black text-white">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm bg-black dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>HOME</a>
            </li>
            <li>
              <a>ABOUT</a>
            </li>
            <li>
              <a>EVENTS</a>
            </li>
            <li>
              <a>FACILITIES</a>
            </li>
            <li>
              <a>BOOKING</a>
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
        <ul className="menu menu-horizontal gap-x-8 [&_a:hover]:text-primary px-1">
          <li>
            <a>HOME</a>
          </li>
          <li>
            <a>ABOUT</a>
          </li>
          <li>
            <a>EVENTS</a>
          </li>
          <li>
            <a>FACILITIES</a>
          </li>
          <li>
            <a>BOOKING</a>
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
