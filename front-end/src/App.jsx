import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";
import Layout from "./layouts/AdminLayout.jsx";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

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

// Department, Documents, Members...
import DepartmentManagementPage from "./pages/Departments/DepartmentManagementPage";
import DocumentsPage from "./pages/DocumentsPage";
import EventDetailsByRoles from "./pages/events/eventDetailsByRoles.jsx";

// Auth
import ProtectedRoute from "./auth/ProtectedRoute";
import SuperAdminRoute from "./auth/SuperAdminRoute";
import EventMemberRoute from "./auth/EventMemberRoute";

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
import AdminViewExpense from "./pages/financeEvent/AdminViewExpense.jsx";

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
import ExpenseRequestHistory from "./pages/expense/ExpenseRequestHistory.jsx";
// import { EventRoleContext, EventRoleProvider } from "./context/EventRoleContext.jsx";
import EventWrapper from "./wrapper/EventWrapper.jsx";
import SponsorshipPackagesPage from "./pages/SponsorshipPackagesPage.jsx";
import SponsorshipPage from "./pages/SponsorshipPage.jsx";
import SubmitSponsorshipPage from "./pages/SubmitSponsorshipPage.jsx";
import EventMemberPage from "./pages/Members/EventMemberPage.jsx";
import SponsorPage from "./pages/SponsorPage.jsx";
import PendingEventView from "./pages/superadmin/PendingEventDetails.jsx";
import RejectTaskRequest from "./components/usercenter/RejectTaskRequest.jsx";
import RedirectPage from "./pages/UserAuthorization/UnauthorizedAccess.jsx";
import CreatedEventsPage from "./pages/events/AllCreatedEvents.jsx";
import CreatedEventLayout from "./layouts/CreatedEventLayout.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <Route path="unauthorized" element={<RedirectPage />} />

          {/* Meeting Routes */}
          <Route
            path="meetings"
            element={<ProtectedRoute isRequiredToHaveRole={true} />}
          >
            <Route index element={<MeetingListPage />} />
            <Route path="edit" element={<MeetingEditPage />} />
          </Route>
          {/* <Route path="event/:eventId/feedback" element={<ViewEventFeedback />} /> */}

          {/* Routes that requires user to have ROLE in event */}
          <Route path="event/:id" element={<EventWrapper />}>
            <Route path="staff" element={<Layout />}>
              {/* Route for all roles (PARTICIPANT, MEMBER, DEPARTMENT_MANAGER, ADMIN) */}
              <Route
                element={
                  <ProtectedRoute
                    isRequiredToHaveRole={true}
                    requiredRoles={[
                      "PARTICIPANT",
                      "MEMBER",
                      "DEPARTMENT_MANAGER",
                      "ADMIN",
                    ]}
                  />
                }
              >
                <Route index element={<EventDetailsByRoles />} />
                <Route path="details" element={<EventDetailsByRoles />} />
              </Route>

              {/* Routes for event staff only */}
              <Route
                element={
                  <ProtectedRoute
                    isRequiredToHaveRole={true}
                    requiredRoles={["MEMBER", "DEPARTMENT_MANAGER", "ADMIN"]}
                  />
                }
              >
                <Route path="tasks" element={<UserTasksPage />} />
                <Route path="tasks/history" element={<TaskHistory />} />
                <Route path="tasks/requests" element={<RejectTaskRequest />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route
                  path="expenses-requests"
                  element={<ExpenseRequestHistory />}
                />
                <Route path="requests" element={<RequestHistory />} />
                <Route path="sponsorships" element={<SponsorshipPage />} />
                <Route
                  path="sponsorships/create"
                  element={<SubmitSponsorshipPage />}
                />
                <Route
                  path="sponsorship-packages"
                  element={<SponsorshipPackagesPage />}
                />
                <Route path="sponsors" element={<SponsorPage />} />
              </Route>

              {/* Routes for event admin and department manager only */}
              <Route
                element={
                  <ProtectedRoute
                    isRequiredToHaveRole={true}
                    requiredRoles={["ADMIN", "DEPARTMENT_MANAGER"]}
                  />
                }
              >
                <Route path="members" element={<EventMemberPage />} />
                {/* <Route path="expenses" element={<EventExpense />} /> */}
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    isRequiredToHaveRole={true}
                    requiredRoles={["ADMIN"]}
                  />
                }
              >
                <Route path="feedback" element={<ViewEventFeedback />} />
                <Route
                  path="departments"
                  element={<DepartmentManagementPage />}
                />
                <Route path="income" element={<AdminViewIncome />} />
                <Route path="expenses" element={<AdminViewExpense />} />
              </Route>

              {/* Routes for participant only */}
              <Route
                element={
                  <ProtectedRoute
                    isRequiredToHaveRole={true}
                    requiredRoles={["PARTICIPANT"]}
                  />
                }
              >
                <Route
                  path="create-feedback"
                  element={<ParticipantFeedbackEvent />}
                />
              </Route>
            </Route>
          </Route>

          {/* Create Event-Protected Routes */}
          <Route path="create-event" element={<ProtectedRoute />}>
            <Route index element={<CreateEvent />} />
            <Route
              path=":eventId/create-proposal"
              element={<CreateProposal />}
            />
            <Route
              path=":eventId/create-timeline"
              element={<CreateTimeline />}
            />
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

            <Route path="created-events">
              <Route index element={<CreatedEventsPage />} />
              <Route path=":eventId" element={<CreatedEventLayout />}>
                <Route index element={<CreateEvent isUpdatePage={true} />} />
                <Route
                  path="proposal"
                  element={<CreateProposal isUpdatePage={true} />}
                />
                <Route
                  path="timeline"
                  element={<CreateTimeline isUpdatePage={true} />}
                />
                <Route
                  path="agenda"
                  element={<CreateAgenda isUpdatePage={true} />}
                />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Super Admin Routes */}
        <Route path="superadmin" element={<SuperAdminRoute />}>
          <Route element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="events" element={<SuperAdminManageEvents />} />
            <Route path="events/pending">
              <Route index element={<SuperAdminPendingEvents />} />
              <Route path=":eventId" element={<PendingEventView />} />
            </Route>
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
            <Route path="sponsors" element={<SponsorPage />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
