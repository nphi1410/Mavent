import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Members from '../pages/Members/Members';

const AppRoutes = () => {
  // Luôn coi người dùng đã xác thực
  const isAuthenticated = true;
  
  // Route quản lý members
  const routes = [
    {
      path: '/',
      element: <Members />
    },
    {
      path: '/members',
      element: <Members />
    }
  ];

  return (
    <Routes>
      {/* Chỉ hiển thị trang quản lý thành viên */}
      {routes.map((route, index) => (
        <Route 
          key={index} 
          path={route.path} 
          element={route.element} 
        />
      ))}
      
      {/* Chuyển hướng cho bất kỳ route nào khác */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
