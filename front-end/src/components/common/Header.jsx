import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <header
      onClick={handleClick}
      className="sticky top-0 z-9999 w-full bg-white shadow-sm px-6 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center w-40">
          <img
            src="/mavent-text-logo.svg"
            alt="Mavent Logo"
            className="w-full"
          />
        </div>

        {/* Navigation Labels */}
        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium text-base">
          <span className="hover:text-black cursor-pointer">Upcoming</span>
          <span className="hover:text-black cursor-pointer">Trending</span>
          <span className="hover:text-black cursor-pointer">Featured</span>
          <span className="hover:text-black cursor-pointer">Explore more</span>
        </nav>

        {/* Greeting + Avatar */}
        <div className="flex items-center gap-6">
          <span className="font-semibold text-lg text-gray-800">
            Hello, User!
          </span>
          <div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
            <img
              src="/avatar.jpg"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
