import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import SuperAdminSidebar from './components/SuperAdminSidebar';
import SuperAdminHeader from './components/SuperAdminHeader';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import AccountList from './components/AccountList';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-100">
        <Routes>
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/accounts" element={<AccountList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;