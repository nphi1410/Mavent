
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import 'leaflet/dist/leaflet.css';  // Add this line
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
import EventDetails from "./pages/EventDetails";
import SuperAdminManageEvents from './pages/SuperAdminManageEvents';
import SuperAdminManageUsers from './pages/SuperAdminManageUsers';
import SuperAdminViewEventDetails from './pages/SuperAdminViewEventDetails';
import SuperAdminViewUserDetails from './pages/SuperAdminViewUserDetails';
import SuperAdminEditEvent from './pages/SuperAdminEditEvent';
import UserEventsPage from './pages/UserEventsPage';
import React from 'react';
import Register from './pages/Register';
import Logout from './components/Logout';


import UserTasksPage from "./pages/UserTasksPage";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Members from './pages/Members/Members';
import Layout from './components/layout/AdminLayout';


function App() {
    return (
        <Router>
            <div className="min-h-screen w-full">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/account" element={<ProfilePage />} />
                    <Route path="/profile/events" element={<UserEventsPage />} />
                    <Route path="/profile/tasks" element={<UserTasksPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/reset-password-request" element={<ResetPassword />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/superadmin" element={<SuperAdminDashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/superadmin/events"
                        element={<SuperAdminManageEvents />}
                    />
                    <Route path="/superadmin/users" element={<SuperAdminManageUsers />} />
                    <Route
                        path="/superadmin/event-detail/:eventId"
                        element={<SuperAdminViewEventDetails />}
                    />
                    <Route path="/superadmin/user-detail/:id" element={<SuperAdminViewUserDetails />} />
                    <Route
                        path="/superadmin/edit-event/:eventId"
                        element={<SuperAdminEditEvent />}
                    />
                    <Route path="/event/1" element={<EventDetails />} />

                     <Route path="/event/9/members" element={<Members />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
