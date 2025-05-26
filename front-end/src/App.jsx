import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SuperAdminSidebar from './components/SuperAdminSidebar';
import SuperAdminHeader from './components/SuperAdminHeader';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
import SuperAdminViewEvents from './pages/SuperAdminViewEvents';
import SuperAdminManageUsers from './pages/SuperAdminManageUsers';

function App() {

    return (
        <Router>
            <div className="h-screen w-screen flex bg-amber-50">
                <SuperAdminSidebar />
                <div className="flex flex-col flex-1">
                    <SuperAdminHeader />

                    <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
                        <Routes>
                            <Route path="/superadmin" element={
                                <>
                                    <SuperAdminDashboard />
                                </>
                            }
                            />
                            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
                            <Route path="/superadmin/events" element={<SuperAdminViewEvents />} />
                            <Route path="/superadmin/events" element={<SuperAdminManageUsers />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;