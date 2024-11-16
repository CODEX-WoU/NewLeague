import React from "react";
import { BsLinkedin, BsTwitterX, BsYoutube } from "react-icons/bs";

const TheFooter: React.FC = () => {
  return (
    <footer
      data-theme="light"
      className="footer footer-center border-t-4 border-black bg-base-300 text-base-content p-10"
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
          <span className="text-primary font-semibold">Woxsen University</span>
        </p>
      </aside>
    </footer>
  );
};

export default TheFooter;
