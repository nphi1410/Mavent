import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Dashboard from '../pages/Dashboard/Dashboard';

// Interface cho Route
interface RouteItem {
  path: string;
  element: React.ReactNode;
}

const AppRoutes = () => {
  // Giả sử bạn có một logic kiểm tra auth từ Redux store hoặc context
  const isAuthenticated = false; // Đây có thể là một hook hoặc state từ Redux

  // Định nghĩa routes công khai
  const publicRoutes: RouteItem[] = [
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/about',
      element: <About />
    }
  ];
  
  // Định nghĩa routes cần xác thực
  const privateRoutes: RouteItem[] = [
    {
      path: '/dashboard',
      element: isAuthenticated ? <Dashboard /> : <Navigate to="/" />
    }
  ];

  return (
    <Routes>
      {/* Public Routes - không yêu cầu đăng nhập */}
      {publicRoutes.map((route, index) => (
        <Route 
          key={index} 
          path={route.path} 
          element={route.element} 
        />
      ))}
      
      {/* Private Routes - yêu cầu đăng nhập */}
      {privateRoutes.map((route, index) => (
        <Route 
          key={index} 
          path={route.path} 
          element={route.element} 
        />
      ))}
      
      {/* Route mặc định */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
