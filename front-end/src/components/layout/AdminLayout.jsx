import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { } from "@fortawesome/free-solid-svg-icons";
import {
  faBars,
  faUsers,
  faTimes,
  faSitemap,
  faFileAlt,
  faInbox,
  faHouse,
  faComments
} from "@fortawesome/free-solid-svg-icons";

import { useUserPermissions } from "../../hooks/useUserPermissions";

// Add CSS for animations
const fadeInKeyframes = `
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
`;

const pulseKeyframes = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
`;

// Add the keyframes to the document
const addKeyframesToDocument = () => {
  const style = document.createElement("style");
  style.textContent = fadeInKeyframes + pulseKeyframes;
  document.head.appendChild(style);
};

// Execute once when the component is imported
addKeyframesToDocument();

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); // Kiểm tra xem có phải đang ở trang quản lý (members, departments hoặc documents)
  const isManagementPage =
    location.pathname.includes("/members")
    || (location.pathname.includes("/event")
      && (location.pathname.includes("/members") || location.pathname.includes('/staff'))
    )
    || location.pathname.includes("/departments")
    || location.pathname.includes("/documents")
    || location.pathname.includes("/requests"); // Add this line

  const { id } = useParams() || {};
  // console.log('Event ID:', id);
  const eventId = id;

  // Define all menu items
  const { userRole, loading, hasRole } = useUserPermissions(eventId);
  const isAdmin =
    userRole === "ADMIN" || (userRole && userRole.includes("ADMIN"));
  const isManagerOrAdmin = hasRole("DEPARTMENT_MANAGER") || isAdmin;

  // Additional debug for role checks
  // console.log(
  //   'AdminSidebar - hasRole("DEPARTMENT_MANAGER"):',
  //   hasRole("DEPARTMENT_MANAGER")
  // );
  // console.log('AdminSidebar - hasRole("MEMBER"):', hasRole("MEMBER"));

  // console.log("AdminSidebar - Current user role:", userRole);
  // console.log("AdminSidebar - isAdmin:", isAdmin);
  // console.log("AdminSidebar - isManagerOrAdmin:", isManagerOrAdmin);
  // If still loading role, use a safe default to prevent UI flicker
  const effectiveRole = loading ? null : userRole;
  // console.log(
  //   "AdminSidebar - Effective role used for rendering:",
  //   effectiveRole
  // );
  // Define all menu items with their permission requirements
  const allMenuItems = [
    {
      name: "details",
      displayName: "Details",
      icon: <FontAwesomeIcon icon={faHouse} />,
      link: `details`,
      requiredRole: "PARTICIPANT", // Only visible to department managers and admins
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
      icon: <FontAwesomeIcon icon={faComments} />,
      link: `feedback`,
      requiredRole: 'ADMIN' // Visible to admin only (ADMIN)
    },
    {
      name: 'requests',
      displayName: 'Requests',
      icon: <FontAwesomeIcon icon={faInbox} />,
      link: `requests`,
      requiredRole: 'MEMBER' // Visible to all roles (MEMBER, DEPARTMENT_MANAGER, and ADMIN)
    }


  ];

  // Filter items based on user role
  const mainItems = allMenuItems.filter((item) => {
    // For items requiring ADMIN role (Members and Departments management)
    if (item.requiredRole === "ADMIN") {
      // Only show to DEPARTMENT_MANAGER or ADMIN users
      const visible = isAdmin;
      // console.log(
      //   `Menu item "${item.name}" requires ADMIN user is ${userRole}, showing:`,
      //   visible
      // );
      return visible;
    }
    // For items requiring DEPARTMENT_MANAGER role (Members and Departments management)
    if (item.requiredRole === "DEPARTMENT_MANAGER") {
      // Only show to DEPARTMENT_MANAGER or ADMIN users
      const visible = isManagerOrAdmin;
      // console.log(

      //   `Menu item "${item.name}" requires DEPARTMENT_MANAGER, user is ${userRole}, showing:`,

      //   visible

      // );
      return visible;
    }
    // For items requiring MEMBER role (Documents)
    else if (item.requiredRole === "MEMBER") {
      // These items are visible to all members 
      // (which includes MEMBER, DEPARTMENT_MANAGER, and ADMIN)
      const visible = isManagerOrAdmin || userRole === "MEMBER";
      // console.log(

      //   `Menu item "${item.name}" requires MEMBER, user is ${userRole}, showing:`,

      //   visible

      // );  
      return visible;
    }

    // Default case - if no specific rule, don't show
    return item.requiredRole === "PARTICIPANT";
  }); // Không hiển thị phần Settings
  const settingsItems = [];

  // Debug: Log filtered menu items
  // console.log(
  //   "Filtered menu items for user role",
  //   userRole,
  //   ":",
  //   mainItems.map((item) => item.name)
  // );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Nếu không phải trang quản lý, chỉ render children
  if (!isManagementPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    );
  }

  // Nếu là trang quản lý, render với Sidebar
  return (
    <div className="flex min-h-screen bg-gray-50">
      {" "}
      {/* Mobile Sidebar Overlay with blur effect */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
          style={{ animation: "fadeIn 0.2s ease-in-out" }}
          aria-label="Close sidebar overlay"
        />
      )}
      {/* Sidebar with Sticky Help Button on Mobile */}
      <div className="relative">
        <Sidebar
          // activeItem={activeItem}
          mainItems={mainItems}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />

        {/* Floating help button for very small screens */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed bottom-4 left-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{
              animation: isSidebarOpen ? undefined : "pulse 2s infinite",
            }}
            aria-label="Open sidebar menu"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
        )}
      </div>
      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-w-0 transition-all duration-300">
        <main className="p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
