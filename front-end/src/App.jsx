import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';

function App() {

    return (
        <Router>
            <div className="h-screen w-screen flex bg-amber-50">
                <SuperAdminSidebar />
                <div className="flex flex-col flex-1">
                    <SuperAdminHeader />

                    <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
                        <Routes>
                            {/* Route for Dashboard */}
                            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

                            {/* Route for view events */}
                            <Route path="/superadmin/events" element={<SuperAdminViewEvents />} />

                            <Route path="/superadmin" element={
                                <>
                                    <SuperAdminDashboard />
                                </>
                            }
                            />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;