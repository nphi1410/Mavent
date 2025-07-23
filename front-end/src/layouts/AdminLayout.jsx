import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUsers,
  faTimes,
  faSitemap,
  faFileAlt,
  faInbox,
  faHouse,
  faComments,
  faMoneyBill1Wave,
  faHandHoldingDollar,
  faCrown,
  faMoneyBillTrendUp
} from "@fortawesome/free-solid-svg-icons";
import { EventRoleProvider, useEventRole } from "../context/EventRoleContext";
import { set } from "react-hook-form";

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
  const { roleLoading, user } = useEventRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user) {
      console.log("✅ User is loaded:", user);
      setLoading(false);
    }
    setLoading(false);
  }, [ user]);

  // While loading, show a spinner or nothing
  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading user info...</div>
      </div>
    );
  }

  // console.log('AdminLayout: ', user)
  const userRole = user.role;
  const sponsorManageable = user.sponsorManageable;

  // Kiểm tra xem có phải đang ở trang quản lý (members, departments hoặc documents)
  // const isManagementPage =
  //   location.pathname.includes("/members")
  //   || (location.pathname.includes("/event")
  //     && (location.pathname.includes("/members") || location.pathname.includes('/staff'))
  //   )
  //   || location.pathname.includes("/departments")
  //   || location.pathname.includes("/documents")
  //   || location.pathname.includes("/requests"); // Add this line

  const isManagementPage = [
    "members",
    "departments",
    "documents",
    "requests",
    "feedback",
  ].some((segment) => location.pathname.includes(segment));

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
      requiredRole: "ADMIN", // Only visible to department managers and admins
    },
    {
      name: "documents",
      displayName: "Documents",
      icon: <FontAwesomeIcon icon={faFileAlt} />,
      link: `documents`,
      requiredRole: "MEMBER", // Visible to all roles (MEMBER, DEPARTMENT_MANAGER, and ADMIN)
    },
    {
      name: "feedback",
      displayName: "Feedback",
      icon: <FontAwesomeIcon icon={faComments} />,
      link: `feedback`,
      requiredRole: "ADMIN", // Visible to admin only (ADMIN)
    },
    {
      name: "requests",
      displayName: "Requests",
      icon: <FontAwesomeIcon icon={faInbox} />,
      link: `requests`,
      requiredRole: "MEMBER", // Visible to all roles (MEMBER, DEPARTMENT_MANAGER, and ADMIN)
    },
    {
      name: "sponsorship packages",
      displayName: "Sponsorship Packages",
      icon: <FontAwesomeIcon icon={faCrown} />,
      link: `sponsorship-packages`,
      requiredRole: "MEMBER",
    },
    {
      name: "sponsorship",
      displayName: "Sponsorship",
      icon: <FontAwesomeIcon icon={faHandHoldingDollar} />,
      link: `sponsorship`,
      requiredRole: "MEMBER",
    },
    {
      name: "tasks",
      displayName: "Tasks",
      icon: <FontAwesomeIcon icon={faFileAlt} />,
      link: `tasks`,
      requiredRole: "MEMBER", // Visible to all roles
    },
    {
      name: "income",
      displayName: "Income",
      icon: <FontAwesomeIcon icon={faMoneyBillTrendUp} />,
      link: `income`,
      requiredRole: "ADMIN",
    },
    {
      name: "expenses",
      displayName: "Expenses",
      icon: <FontAwesomeIcon icon={faMoneyBill1Wave} />,
      link: `expenses`,
      requiredRole: "ADMIN",
    },
  ];

  // Filter items based on user role
  const mainItems = allMenuItems.filter((item) => {
    if (item.requiredRole === "ADMIN") return userRole.includes("ADMIN");
    if (item.requiredRole === "DEPARTMENT_MANAGER") {
      if (item.name === "sponsorship" || item.name === "sponsorship packages") {
        return sponsorManageable || userRole.includes("ADMIN");
      }
      return ["ADMIN", "DEPARTMENT_MANAGER"].some((role) =>
        userRole.includes(role)
      );
    }
    if (item.requiredRole === "MEMBER") {
      if (item.name === "sponsorship" || item.name === "sponsorship packages") {
        return sponsorManageable || userRole.includes("ADMIN");
      }
      return ["ADMIN", "DEPARTMENT_MANAGER", "MEMBER"].some((role) =>
        userRole.includes(role)
      );
    }
    return item.requiredRole === "PARTICIPANT";
  });

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
  if (!isManagementPage && userRole.includes("PARTICIPANT")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    );
  }

  // Nếu là trang quản lý, render với Sidebar

  return (
    // <EventRoleProvider>
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
            className="fixed bottom-4 left-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{
              animation: isSidebarOpen ? undefined : "pulse 2s infinite",
            }}
            aria-label="Open sidebar menu"
          >
            <FontAwesomeIcon
              icon={faBars}
              className="h-5 w-5 transition-transform duration-200"
            />
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
