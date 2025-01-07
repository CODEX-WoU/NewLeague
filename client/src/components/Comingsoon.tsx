import React from "react";
// import { Instagram, Twitter, Linkedin, ChevronDown } from 'lucide-react';
import { BsInstagram, BsTwitterX, BsLinkedin } from "react-icons/bs";
import { BiChevronDownCircle } from "react-icons/bi";
import bgimage from "../../assets/ComingSoonBG.svg";
import appConfig from "../config/appConfig";

const ComingSoon: React.FC = () => {
  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-no-repeat flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bgimage}), linear-gradient(135deg, #d92137 , #000000)`,
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop:blur-3xl"></div>
      <div className="relative z-10 max-w-3xl mx-auto p-8 text-center">
        <div className="mb-8">
          <h1 className="font-raleway text-white text-4xl lg:text-5xl sm:text-6xl mb-12 font-bold">
            Coming Soon!
          </h1>
          <p className="font-raleway text-white mb-8 lg:text-3xl sm:text-2xl">
            We are launching new features to the website.
          </p>
          <div className="flex items-center justify-center">
            <div className="text-white font-raleway font-semibold text-xl px-5 py-2 bg-[#EF495D] mb-8 rounded-full w-2/5">
              Stay Updated
            </div>
          </div>
          <div className="flex justify-center">
            <div className="animate-bounce">
              <BiChevronDownCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-12">
          <a
            href={appConfig.instaSocialMediaLink}
            className="text-white hover:text-[#EF495D] transition-colors duration-300"
          >
            <BsInstagram className="w-8 h-8" />
          </a>
          <a
            href={appConfig.linkedInSocialMediaLink}
            className="text-white hover:text-[#EF495D] transition-colors duration-300"
          >
            <BsLinkedin className="w-8 h-8" />
          </a>
          <a
            href={appConfig.xSocialMediaLink}
            className="text-white hover:text-[#EF495D] transition-colors duration-300"
          >
            <BsTwitterX className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
