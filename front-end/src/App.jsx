import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import SuperAdminSidebar from './components/SuperAdminSidebar';
import SuperAdminHeader from './components/SuperAdminHeader';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SuperAdminViewEvents from './pages/SuperAdminViewEvents';



function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        getGreeting()
            .then(response => setMessage(response.data))
            .catch(error => {
                console.error('Error fetching greeting:', error);
                setMessage('Error to load message');
            });
    }, []);

    return (
        <Router>
            <div className="h-screen flex bg-amber-50">
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