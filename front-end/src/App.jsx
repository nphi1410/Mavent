import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import SuperAdminDashboard from "./pages/SuperAdminDashBoard";
import EventDetails from "./pages/EventDetails";
import AllEvents from "./pages/AllEvents";
import SuperAdminManageUsers from "./pages/SuperAdminManageUsers";
import SuperAdminViewEventDetails from "./pages/SuperAdminViewEventDetails";
import SuperAdminEditEvent from "./pages/SuperAdminEditEvent";
import SuperAdminManageEvents from "./pages/SuperAdminManageEvents";

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route
            path="/superadmin/events"
            element={<SuperAdminManageEvents />}
          />
          <Route path="/superadmin/users" element={<SuperAdminManageUsers />} />
          <Route
            path="/superadmin/event-detail/:eventId"
            element={<SuperAdminViewEventDetails />}
          />
          <Route
            path="/superadmin/edit-event/:eventId"
            element={<SuperAdminEditEvent />}
          />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/events" element={<AllEvents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
