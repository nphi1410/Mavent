import React from 'react';
import Sidebar from './Sidebar';
import AdminNavbar from './AdminNavbar';

const Layout = ({ children, activeItem }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} />
      <div className="flex-1 ml-64">
        <AdminNavbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;