import React from 'react'
import { Outlet } from 'react-router-dom'
import SuperAdminHeader from './../components/superadmin/SuperAdminHeader';
import SuperAdminSidebar from '../components/superadmin/SuperAdminSidebar';

const SuperAdminLayout = () => {
  return (
    <div className="flex  min-h-screen">
      <SuperAdminHeader />
      <SuperAdminSidebar />

        <main className="flex-1  p-10 bg-gray-100">
          <Outlet />
        </main>
    </div>
  )
}

export default SuperAdminLayout