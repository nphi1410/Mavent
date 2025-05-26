
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
import SuperAdminViewEvents from './pages/SuperAdminViewEvents';
import SuperAdminManageUsers from './pages/SuperAdminManageUsers';


function App() {
    return (
        <Router>
            <div className="min-h-screen w-full bg-gray-100">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile/*" element={<ProfilePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/superadmin" element={<SuperAdminDashboard />}/>
                    <Route path="/superadmin/events" element={<SuperAdminViewEvents />} />
                    <Route path="/superadmin/users" element={<SuperAdminManageUsers />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
