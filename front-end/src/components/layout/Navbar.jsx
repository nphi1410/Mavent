import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Mock authentication state with useState (replace with context or localStorage in real app)
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') ? true : true);
  const [currentUser, setCurrentUser] = useState({ username: 'John Doe' });

  // Handle logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  // Check if the link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="Mavent Logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap">Mavent</span>
        </Link>
        
        <div className="flex items-center lg:order-2">
          {isAuthenticated ? (
            <div className="flex items-center">
              <span className="mr-4 text-sm">
                {currentUser?.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 focus:outline-none"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 focus:outline-none"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 focus:outline-none"
              >
                Register
              </Link>
            </>
          )}
          <button
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <Link
                to="/"
                className={`block py-2 pr-4 pl-3 ${
                  isActive('/') 
                    ? 'text-white bg-blue-700 rounded lg:bg-transparent lg:text-blue-700' 
                    : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700'
                } lg:p-0`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block py-2 pr-4 pl-3 ${
                  isActive('/about') 
                    ? 'text-white bg-blue-700 rounded lg:bg-transparent lg:text-blue-700' 
                    : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700'
                } lg:p-0`}
              >
                About
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/dashboard"
                  className={`block py-2 pr-4 pl-3 ${
                    isActive('/dashboard') 
                      ? 'text-white bg-blue-700 rounded lg:bg-transparent lg:text-blue-700' 
                      : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700'
                  } lg:p-0`}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
