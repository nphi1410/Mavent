import Dashboard from "../pages/Dashboard/Dashboard";
import React from 'react';

// Định nghĩa interface cho route
interface RouteItem {
  path: string;
  element: React.ReactNode;
}

// Các route yêu cầu đăng nhập
export const privateRoutes: RouteItem[] = [
  {
    path: '/dashboard',
    element: React.createElement(Dashboard)
  },
  // Thêm các route khác yêu cầu đăng nhập ở đây
];
