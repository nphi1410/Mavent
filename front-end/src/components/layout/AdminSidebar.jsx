import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faTimes,
  faSitemap,
  faFileAlt,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
import { useUserPermissions } from "../../hooks/useUserPermissions";


// Sidebar component for admin dashboard
const Sidebar = ({ activeItem, isOpen, onToggle }) => {
  // const pathname = window.location.pathname;
  const { id } = useParams() || {};
  // console.log('Event ID:', id);
  const eventId = id;

  // Define all menu items
  const { userRole, loading, hasRole } = useUserPermissions(eventId);
  const isAdmin =
    userRole === "ADMIN" || (userRole && userRole.includes("ADMIN"));
  const isManagerOrAdmin = hasRole("DEPARTMENT_MANAGER") || isAdmin;

  // Additional debug for role checks
  console.log(
    'AdminSidebar - hasRole("DEPARTMENT_MANAGER"):',
    hasRole("DEPARTMENT_MANAGER")
  );
  console.log('AdminSidebar - hasRole("MEMBER"):', hasRole("MEMBER"));

  console.log("AdminSidebar - Current user role:", userRole);
  console.log("AdminSidebar - isAdmin:", isAdmin);
  console.log("AdminSidebar - isManagerOrAdmin:", isManagerOrAdmin);
  // If still loading role, use a safe default to prevent UI flicker
  const effectiveRole = loading ? null : userRole;
  console.log(
    "AdminSidebar - Effective role used for rendering:",
    effectiveRole
  );
  // Define all menu items with their permission requirements
  const allMenuItems = [
    {
      name: 'eventDetails',
      displayName: 'Event Details',
      icon: <FontAwesomeIcon icon={faSitemap} />,
      link: `details`,
      requiredRole: 'MEMBER' // Visible to all roles (MEMBER, DEPARTMENT_MANAGER, and ADMIN)
    },
    {
      name: "members",
      displayName: "Members",
      icon: <FontAwesomeIcon icon={faUsers} />,
      link: `members`,
      requiredRole: "DEPARTMENT_MANAGER", // Only visible to department managers and admins
    },
    {
      name: "departments",
      displayName: "Departments",
      icon: <FontAwesomeIcon icon={faSitemap} />,
      link: `departments`,
      requiredRole: 'ADMIN' // Only visible to department managers and admins
    },
    {
      name: "documents",
      displayName: "Documents",
      icon: <FontAwesomeIcon icon={faFileAlt} />,
      link: `documents`,
      requiredRole: 'MEMBER' // Visible to all roles (MEMBER, DEPARTMENT_MANAGER, and ADMIN)
    },
    {
      name: 'feedback',
      displayName: 'Feedback',
      icon: <FontAwesomeIcon icon={faFileAlt} />,
      link: `feedback`,
      requiredRole: 'ADMIN' // Visible to admin only (ADMIN)
    },
    {
      name: 'requests',
      displayName: 'Requests',
      icon: <FontAwesomeIcon icon={faFileAlt} />,
      link: `requests`,
      requiredRole: 'MEMBER' // Visible to all roles (MEMBER, DEPARTMENT_MANAGER, and ADMIN)
    },


  ];

  // Filter items based on user role
  const mainItems = allMenuItems.filter((item) => {
    // For items requiring ADMIN role (Members and Departments management)
    if (item.requiredRole === "ADMIN") {
      // Only show to DEPARTMENT_MANAGER or ADMIN users
      const visible = isAdmin;
      console.log(
        `Menu item "${item.name}" requires ADMIN user is ${userRole}, showing:`,
        visible
      );
      return visible;
    }
    // For items requiring DEPARTMENT_MANAGER role (Members and Departments management)
    if (item.requiredRole === "DEPARTMENT_MANAGER") {
    if (item.requiredRole === "DEPARTMENT_MANAGER") {
      // Only show to DEPARTMENT_MANAGER or ADMIN users
      const visible = isManagerOrAdmin;
      console.log(
        
        `Menu item "${item.name}" requires DEPARTMENT_MANAGER, user is ${userRole}, showing:`,
       
        visible
      
      );
      return visible;
    }
    }
    // For items requiring MEMBER role (Documents)
    else if (item.requiredRole === "MEMBER") {
      // These items are visible to all users with any valid role
      // (which includes MEMBER, DEPARTMENT_MANAGER, and ADMIN)
      console.log(
        `Menu item "${item.name}" visible to all roles (requires MEMBER role)`
      );
      return true;
    }
    // Default case - if no specific rule, don't show
    return false;
  }); // Không hiển thị phần Settings
  const settingsItems = [];

  // Debug: Log filtered menu items
  console.log(
    "Filtered menu items for user role",
    userRole,
    ":",
    mainItems.map((item) => item.name)
  );
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block w-64 bg-white shadow-md h-screen fixed left-0 top-0 pt-16 z-30`}
      >
        <div className="px-4 py-6 h-full overflow-y-auto">
          <h2 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </h2>
          <ul className="space-y-1">
            {mainItems.map((item) => (
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
                  <span className="ml-3">{item.displayName || item.name}</span>
                </a>
              </li>
            ))}
          </ul>

          {settingsItems.length > 0 && (
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
          )}
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
                  <span className="ml-3">{item.displayName || item.name}</span>
                </a>
              </li>
            ))}
          </ul>

          {settingsItems.length > 0 && (
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
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
