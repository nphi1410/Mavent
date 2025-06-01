import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const Layout = ({ children, activeItem }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Kiểm tra xem có phải đang ở trang member management không
  const isMemberManagementPage = location.pathname.includes('/members');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Nếu không phải trang member management, chỉ render children
  if (!isMemberManagementPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    );
  }

  // Nếu là trang member management, render với Sidebar và AdminNavbar
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeItem} 
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-w-0">
        <AdminNavbar onMenuClick={toggleSidebar} />
        <main className="p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;