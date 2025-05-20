import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import React from 'react';

// Định nghĩa interface cho route
interface RouteItem {
  path: string;
  element: React.ReactNode;
}

// Các route không yêu cầu đăng nhập
export const publicRoutes: RouteItem[] = [
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
