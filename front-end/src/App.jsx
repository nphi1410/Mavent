import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Public (Auth)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./components/Logout";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

// Pages
import HomePage from "./pages/HomePage";
import AllEvents from "./pages/AllEvents";
import EventDetails from "./pages/EventDetails";

// User
import ProfilePage from "./pages/ProfilePage";
import UserEventsPage from "./pages/UserEventsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserTasksPage from "./pages/UserTasksPage";

// Super Admin
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashBoard";
import SuperAdminManageEvents from "./pages/superadmin/SuperAdminManageEvents";
import SuperAdminManageUsers from "./pages/superadmin/SuperAdminManageUsers";
import SuperAdminViewEventDetails from "./pages/superadmin/SuperAdminViewEventDetails";
import SuperAdminEditEvent from "./pages/superadmin/SuperAdminEditEvent";
import SuperAdminViewUserDetails from "./pages/superadmin/SuperAdminViewUserDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/reset-password-request" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Main App Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<AllEvents />} />
          <Route path="events/:id" element={<EventDetails />} />

          {/* User Routes */}
          <Route path="profile">
            <Route index element={<ProfilePage />} />
            <Route path="attended" element={<UserEventsPage />} />
            <Route path="dashboard" element={<UserDashboardPage />} />
            <Route path="tasks" element={<UserTasksPage />} />
          </Route>

          {/* Super Admin Routes */}
          <Route path="superadmin">
            <Route index element={<SuperAdminDashboard />} />
            <Route path="events" element={<SuperAdminManageEvents />} />
            <Route path="users" element={<SuperAdminManageUsers />} />
            <Route
              path="event-detail/:eventId"
              element={<SuperAdminViewEventDetails />}
            />
            <Route
              path="edit-event/:eventId"
              element={<SuperAdminEditEvent />}
            />
            <Route
              path="user-detail/:id"
              element={<SuperAdminViewUserDetails />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
