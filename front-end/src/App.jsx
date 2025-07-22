import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";
import Layout from './components/layout/AdminLayout';

// Public
import Login from "./pages/UserAuthorization/Login";
import Register from "./pages/UserAuthorization/Register";
import Logout from "./components/Logout";
import ResetPassword from "./pages/UserAuthorization/ResetPassword";
import ChangePassword from "./pages/UserAuthorization/ChangePassword";
import HomePage from "./pages/HomePage";
import AllEvents from "./pages/AllEvents";
import EventDetails from "./pages/EventDetails";
import MeetingListPage from "./pages/meetingPages/MeetingListPage";

// Department, Documents, and Members
import DepartmentManagementPage from "./pages/Departments/DepartmentManagementPage";

import Members from "./pages/Members/EventMemberPage.jsx";
import DocumentsPage from "./pages/DocumentsPage";
import EventDetailsByRoles from "./pages/eventDetailsByRoles/eventDetailsByRoles.jsx";

// Auth
import ProtectedRoute from "./auth/ProtectedRoute";
import SuperAdminRoute from "./auth/SuperAdminRoute";


// User
import ProfilePage from "./pages/ProfilePage";
import UserEventsPage from "./pages/UserEventsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserTasksPage from "./pages/UserTasksPage";
import TaskHistory from "./components/usercenter/TaskHistory";
import TaskDetails from "./components/usercenter/TaskDetails";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import CreateTimeline from "./pages/CreateEvent/CreateTimeline";
import CreateAgenda from "./pages/CreateEvent/CreateAgenda";
import CreateProposal from "./pages/CreateEvent/CreateProposal";
import AdminViewIncome from "./pages/financeEvent/AdminViewIncome.jsx";

// Super Admin
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashBoard";
import SuperAdminManageEvents from "./pages/superadmin/SuperAdminManageEvents";
import SuperAdminPendingEvents from "./pages/superadmin/SuperAdminPendingEvents";
import SuperAdminManageUsers from "./pages/superadmin/SuperAdminManageUsers";
import SuperAdminViewEventDetails from "./pages/superadmin/SuperAdminViewEventDetails";
import SuperAdminEditEvent from "./pages/superadmin/SuperAdminEditEvent";
import SuperAdminViewUserDetails from "./pages/superadmin/SuperAdminViewUserDetails";

import MeetingEditPage from "./pages/meetingPages/EditMeetingPage";
import ViewEventFeedback from "./pages/ViewEventFeedback.jsx";
import ParticipantFeedbackEvent from "./pages/ParticipantFeedbackEvent.jsx";
import RequestHistory from "./pages/request/member/RequestHistory.jsx";
// import { EventRoleContext, EventRoleProvider } from "./context/EventRoleContext.jsx";
import EventWrapper from "./wrapper/EventWrapper.jsx";

// Higher Order Components for Route Protection
// const Protect = (Component) => <ProtectedRoute children={Component} />;
// const SuperAdmin = (Component) => <SuperAdminRoute children={Component} />;
// const EventMember = (Component) => <EventMemberRoute children={Component} />;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/reset-password-request" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<AllEvents />} />
          <Route path="events/:id" element={<EventDetails />} />

          <Route path="meetings" element={<MeetingListPage />} />
          <Route path="meetings/edit" element={<MeetingEditPage />} />
          {/* <Route path="event/:eventId/feedback" element={<ViewEventFeedback />} /> */}

          {/* Routes that requires user to have ROLE in event */}
          <Route path="event/:id" element={<EventWrapper />}>
            <Route path="staff" element={<Layout />}>
              <Route element={<ProtectedRoute isRequiredToHaveEventRole={true} />}>
                <Route index element={<EventDetailsByRoles />} />
                <Route path="details" element={(<EventDetailsByRoles />)} />
                <Route path="departments" element={<DepartmentManagementPage />} />
                <Route path="tasks" element={<UserTasksPage />} />
                <Route path="members" element={(<Members />)} />
                <Route path="documents" element={(<DocumentsPage />)} />
                <Route path="feedback" element={<ViewEventFeedback />} />
                <Route path="requests" element={(<RequestHistory />)} />
                <Route path="create-feedback" element={<ParticipantFeedbackEvent />} />
                <Route path="income" element={<AdminViewIncome />} />
              </Route>
            </Route>
          </Route>

          {/* Create Event-Protected Routes */}
          <Route path="create-event" element={<ProtectedRoute />}>
            <Route index element={<CreateEvent />} />
            <Route path=":eventId/create-proposal" element={<CreateProposal />} />
            <Route path=":eventId/create-timeline" element={<CreateTimeline />} />
            <Route path=":eventId/create-agenda" element={<CreateAgenda />} />
          </Route>

          {/* User Profile Routes */}
          <Route path="profile" element={<ProtectedRoute />}>
            <Route index element={<ProfilePage />} />
            <Route path="attended" element={<UserEventsPage />} />
            <Route path="dashboard" element={<UserDashboardPage />} />
            <Route path="tasks">
              <Route index element={<UserTasksPage />} />
              <Route path=":taskId" element={<TaskDetails />} />
              <Route path="history" element={<TaskHistory />} />
            </Route>
          </Route>
        </Route>

        {/* Super Admin Routes */}
        <Route path="superadmin" element={<SuperAdminRoute />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="events" element={<SuperAdminManageEvents />} />
          <Route path="events/pending" element={<SuperAdminPendingEvents />} />
          <Route path="users" element={<SuperAdminManageUsers />} />
          <Route path="event-detail/:eventId" element={<SuperAdminViewEventDetails />} />
          <Route path="edit-event/:eventId" element={<SuperAdminEditEvent />} />
          <Route path="user-detail/:id" element={<SuperAdminViewUserDetails />} />
        </Route>
      </Routes >
    </Router >

  );
}

export default App;