import React from "react";
import { BsLinkedin, BsTwitterX, BsYoutube } from "react-icons/bs";

const TheFooter: React.FC = () => {
  return (
    <div className="border-t-2 border-gray-300 bg-base-300 text-base-content p-10">
      <footer
        data-theme="light"
        className="footer footer-center p-4 lg:w-2/5 mx-auto rounded-2xl"
      >
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Bookings</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-6">
            <a href="https://in.linkedin.com/school/woxsen-university/">
              <BsLinkedin size={24} color="#ef495d" />
            </a>
            <a href="https://x.com/Woxsen">
              <BsTwitterX size={24} color="#ef495d" />
            </a>
            <a href="https://www.youtube.com/c/WoxsenUniversity">
              <BsYoutube size={24} color="#ef495d" />
            </a>
          </div>
        </nav>
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by{" "}
            <span className="text-primary font-semibold">
              Woxsen University
            </span>
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default TheFooter;
