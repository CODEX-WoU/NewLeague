import {
  FaSquareXTwitter,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaChevronUp,
} from "react-icons/fa6";
import appConfig from "../../config/appConfig";

export const TheFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const iconSize = 28;

  return (
    <footer className="bg-black font-plain py-4 relative">
      {/* Container with relative positioning */}
      <div className="container w-full py-8 lg:w-[60vw] mx-auto px-4 relative">
        {/* Social Links */}
        <div className="flex text-white justify-center space-x-10 mb-8">
          <a
            href={appConfig.xSocialMediaLink}
            className="hover:text-primary transition-colors"
          >
            <FaSquareXTwitter size={iconSize} />
          </a>
          <a
            href={appConfig.youtubeSocialMediaLink}
            className="hover:text-primary transition-colors"
          >
            <FaYoutube size={iconSize} />
          </a>
          <a
            href={appConfig.instaSocialMediaLink}
            className="hover:text-primary transition-colors"
          >
            <FaInstagram size={iconSize} />
          </a>
          <a
            href={appConfig.linkedInSocialMediaLink}
            className="hover:text-primary transition-colors"
          >
            <FaLinkedin size={iconSize} />
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 pb-7 border-b-[1px] text-opacity-80 text-gray-300 border-primary">
          <a href="#" className="hover:text-primary transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            About Us
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Sports Facilities
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            [Placeholder tag]
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            [Placeholder tag]
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            [Placeholder tag]
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-center text-sm pt-3 text-primary">
          © Woxsen University {new Date().getFullYear()}. All rights reserved.
        </div>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="absolute right-0 top-8 bg-primary hover:bg-primary/90 p-2 rounded-full transition-colors"
          aria-label="Scroll to top"
        >
          <FaChevronUp className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
};

export default TheFooter;
