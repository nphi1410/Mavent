import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faTimes,
  faSitemap,
  faFileAlt,
  faInbox,
  faHouse,
  faComments
} from "@fortawesome/free-solid-svg-icons";


// Sidebar component for admin dashboard
const Sidebar = ({ isOpen, onToggle, mainItems }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const pathSegments = location.pathname.split('/').filter(Boolean);
  // console.log("pathSegments: " + pathSegments);

  const activeItem = pathSegments[pathSegments.length - 1] || '';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`w-64 bg-white shadow-md h-screen fixed left-0 top-0 pt-16 z-30 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-4 py-6 h-full overflow-y-auto">
          <h2 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </h2>
          <ul className="space-y-1">
            {mainItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
                    activeItem === item.name.toLowerCase()
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-900"
                    }`}
                >
                  <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                  <span className="ml-3">{item.displayName || item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* {settingsItems.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <h2 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </h2>
              <ul className="space-y-1">
                {settingsItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
                        activeItem === item.name.toLowerCase()
                          ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                      <span className="ml-3">
                        {item.displayName || item.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )} */}
        </div>
      </aside>{" "}
      {/* Mobile Sidebar with improved visibility and accessibility */}
      <aside
        className={`
        lg:hidden fixed left-0 top-0 w-72 h-full bg-white shadow-xl transform transition-all duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Mobile Header with improved styling */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 mr-3">
              <FontAwesomeIcon icon={faSitemap} className="h-4 w-4" />
            </span>
            <h2 className="text-lg font-semibold text-gray-800">Admin Menu</h2>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>{" "}
        {/* Mobile Menu Content with help text */}{" "}
        <div className="px-4 py-6 h-full overflow-y-auto">
          <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </h3>
          <ul className="space-y-1">
            {mainItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  onClick={onToggle}
                  className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100 ${activeItem === item.name.toLowerCase()
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-900"
                    }`}
                >
                  <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                  <span className="ml-3">{item.displayName || item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* {settingsItems.length > 0 && (
            <>
              <hr className="my-6 border-gray-200" />
              <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </h3>
              <ul className="space-y-1">
                {settingsItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      onClick={onToggle}
                      className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-gray-100 ${
                        activeItem === item.name.toLowerCase()
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      <span className="w-5 h-5 text-gray-500">{item.icon}</span>
                      <span className="ml-3">
                        {item.displayName || item.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )} */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
