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
import UserEventsPage from './pages/UserEventsPage';
import React from 'react';


function App() {
  return (
    <Router>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/events" element={<UserEventsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<SuperAdminDashboard />} />
          <Route path="/event/1" element={<EventDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
