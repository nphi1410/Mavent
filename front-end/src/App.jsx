import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Public
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./components/Logout";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import HomePage from "./pages/HomePage";
import AllEvents from "./pages/AllEvents";
import EventDetails from "./pages/EventDetails";

// Auth
import ProtectedRoute from "./auth/ProtectedRoute";
import SuperAdminRoute from "./auth/SuperAdminRoute";

// User
import ProfilePage from "./pages/ProfilePage";
import UserEventsPage from "./pages/UserEventsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserTasksPage from "./pages/UserTasksPage";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import CreateTimeline from "./pages/CreateEvent/CreateTimeline";
import CreateAgenda from "./pages/CreateEvent/CreateAgenda";

// Super Admin
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashBoard";
import SuperAdminManageEvents from "./pages/superadmin/SuperAdminManageEvents";
import SuperAdminPendingEvents from "./pages/superadmin/SuperAdminPendingEvents";
import SuperAdminManageUsers from "./pages/superadmin/SuperAdminManageUsers";
import SuperAdminViewEventDetails from "./pages/superadmin/SuperAdminViewEventDetails";
import SuperAdminEditEvent from "./pages/superadmin/SuperAdminEditEvent";
import SuperAdminViewUserDetails from "./pages/superadmin/SuperAdminViewUserDetails";
import ViewEventFeedback from "./pages/ViewEventFeedback.jsx";

// Higher Order Components for Route Protection
const Protect = (Component) => <ProtectedRoute children={Component} />;
const SuperAdmin = (Component) => <SuperAdminRoute children={Component} />;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/reset-password-request" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<AllEvents />} />
          <Route path="events/:id" element={<EventDetails />} />

          <Route path="/event/:eventId/feedback" element={<ViewEventFeedback />} />

          {/* Create Event-Protected Routes */}
          <Route path="create-event">
            <Route index element={Protect(<CreateEvent />)} />
            <Route path=":eventId/create-timeline" element={Protect(<CreateTimeline />)} />
            <Route path=":eventId/create-agenda" element={Protect(<CreateAgenda />)} />
          </Route>

          {/* User-Protected Routes */}
          <Route path="profile">
            <Route index element={Protect(<ProfilePage />)} />
            <Route path="attended" element={Protect(<UserEventsPage />)} />
            <Route path="dashboard" element={Protect(<UserDashboardPage />)} />
            <Route path="tasks" element={Protect(<UserTasksPage />)} />
          </Route>

          {/* Super Admin Routes */}
          <Route path="superadmin">
            <Route index element={SuperAdmin(<SuperAdminDashboard />)} />
            <Route path="events" element={SuperAdmin(<SuperAdminManageEvents />)} />
            <Route path="events/pending" element={SuperAdmin(<SuperAdminPendingEvents />)} />
            <Route path="users" element={SuperAdmin(<SuperAdminManageUsers />)} />
            <Route
              path="event-detail/:eventId"
              element={SuperAdmin(<SuperAdminViewEventDetails />)}
            />
            <Route
              path="edit-event/:eventId"
              element={SuperAdmin(<SuperAdminEditEvent />)}
            />
            <Route
              path="user-detail/:id"
              element={SuperAdmin(<SuperAdminViewUserDetails />)}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
