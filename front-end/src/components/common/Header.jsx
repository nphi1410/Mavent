import React from "react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b py-2 px-5 border-gray-200 shadow-sm">
      <div className="flex justify-center items-center w-50">
        <div className="logo">
          <img src="/mavent-text-logo.svg" alt="logo" className="h-10" />
        </div>
      </div>
    </header>
  );
};

export default Header;
