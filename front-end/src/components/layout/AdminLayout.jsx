import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

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
  const style = document.createElement('style');
  style.textContent = fadeInKeyframes + pulseKeyframes;
  document.head.appendChild(style);
};

// Execute once when the component is imported
addKeyframesToDocument();

const Layout = ({ children, activeItem }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  const location = useLocation();
  // Kiểm tra xem có phải đang ở trang quản lý (members hoặc departments)
  const isManagementPage = 
    location.pathname.includes('/members') || 
    (location.pathname.includes('/event') && location.pathname.includes('/members')) ||
    location.pathname.includes('/departments/manage');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Nếu không phải trang quản lý, chỉ render children
  if (!isManagementPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    );
  }

  // Nếu là trang quản lý, render với Sidebar và AdminNavbar
  return (    <div className="flex min-h-screen bg-gray-50">      {/* Mobile Sidebar Overlay with blur effect */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
          style={{ animation: 'fadeIn 0.2s ease-in-out' }}
          aria-label="Close sidebar overlay"
        />
      )}
      
      {/* Sidebar with Sticky Help Button on Mobile */}
      <div className="relative">
        <Sidebar 
          activeItem={activeItem} 
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
        
        {/* Floating help button for very small screens */}
        {!isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="lg:hidden fixed bottom-4 left-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ animation: isSidebarOpen ? undefined : 'pulse 2s infinite' }}
            aria-label="Open sidebar menu"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-w-0 transition-all duration-300">
        <AdminNavbar onMenuClick={toggleSidebar} />
        <main className="p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;