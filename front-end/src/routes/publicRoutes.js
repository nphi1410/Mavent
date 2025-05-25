import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import React from 'react';

// Các route không yêu cầu đăng nhập
export const publicRoutes = [
  {
    path: '/',
    element: React.createElement(Home)
  },
  {
    path: '/about',
    element: React.createElement(About)
  },
  // Thêm các route không yêu cầu đăng nhập ở đây
];
