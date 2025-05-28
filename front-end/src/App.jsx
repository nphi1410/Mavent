
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
import SuperAdminManageEvents from './pages/SuperAdminManageEvents';
import SuperAdminManageUsers from './pages/SuperAdminManageUsers';
import SuperAdminViewEventDetails from "./pages/SuperAdminViewEventDetails";


function App() {
    return (
        <Router>
            <div className="min-h-screen w-full bg-gray-100">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile/*" element={<ProfilePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/superadmin" element={<SuperAdminDashboard />}/>
                    <Route path="/superadmin/events" element={<SuperAdminManageEvents />} />
                    <Route path="/superadmin/users" element={<SuperAdminManageUsers />} />
                    <Route path="/superadmin/event-details/" element={<SuperAdminViewEventDetails />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
