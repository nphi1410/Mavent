import React from 'react'
import { Outlet } from 'react-router-dom'
import SuperAdminHeader from './../components/superadmin/SuperAdminHeader';

const SuperAdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SuperAdminHeader />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default SuperAdminLayout