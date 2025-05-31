import React from "react";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <footer className="border-t border-gray-200 w-full bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-4">
        {/* Left: Logo */}
        <div onClick={handleClick} className="w-40">
          <img
            src="/mavent-text-logo.svg"
            alt="Mavent Logo"
            className="w-full"
          />
        </div>

        {/* Center: Copyright */}
        <div className="text-center text-sm md:text-base text-gray-600">
          <p>&copy; {new Date().getFullYear()} Mavent. All rights reserved.</p>
        </div>

        {/* Right: Links & Social Icons */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-gray-600 text-sm">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook">
              <FontAwesomeIcon
                icon={faFacebook}
                className="hover:text-blue-600"
              />
            </a>
            <a href="#" aria-label="Twitter">
              <FontAwesomeIcon
                icon={faYoutube}
                className="hover:text-red-500"
              />
            </a>
            <a href="#" aria-label="Instagram">
              <FontAwesomeIcon
                icon={faInstagram}
                className="hover:text-pink-500"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
