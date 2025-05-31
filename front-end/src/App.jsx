import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';  // Keeping the leaflet CSS import
import React from 'react';

// Main pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Members from './pages/Members/Members';

// Profile related pages
import ProfilePage from './pages/ProfilePage';
import UserEventsPage from './pages/UserEventsPage';

// Event related pages
import EventDetails from './pages/EventDetails';

// Admin related pages
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
import SuperAdminManageUsers from './pages/SuperAdminManageUsers';
import SuperAdminViewEventDetails from './pages/SuperAdminViewEventDetails';
import SuperAdminEditEvent from './pages/SuperAdminEditEvent';
import SuperAdminManageEvents from './pages/SuperAdminManageEvents';

// Layout
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full">
        <Routes>
          {/* Public pages with Layout */}
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Member management */}
          <Route path="/members" element={
            <Layout>
              <Members />
            </Layout>
          } />
          
          {/* Profile related routes */}
          <Route path="/profile" element={
            <Layout>
              <ProfilePage />
            </Layout>
          } />
          <Route path="/profile/events" element={
            <Layout>
              <UserEventsPage />
            </Layout>
          } />
          
          {/* Event details */}
          <Route path="/event/1" element={
            <Layout>
              <EventDetails />
            </Layout>
          } />
          
          {/* SuperAdmin routes */}
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/events" element={<SuperAdminManageEvents />} />
          <Route path="/superadmin/users" element={<SuperAdminManageUsers />} />
          <Route path="/superadmin/event-detail/:eventId" element={<SuperAdminViewEventDetails />} />
          <Route path="/superadmin/edit-event/:eventId" element={<SuperAdminEditEvent />} />
          
          {/* Legacy Admin route (in case it's still used) */}
          <Route path="/admin" element={<SuperAdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;