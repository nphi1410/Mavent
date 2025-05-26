import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import SuperAdminSidebar from './components/SuperAdminSidebar';
import SuperAdminHeader from './components/SuperAdminHeader';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import AccountList from './components/AccountList';

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
      <div className="min-h-screen w-full bg-gray-100">
        {/* Show greeting message for testing */}
        {/* <div className="p-4 text-center text-blue-800 font-bold">
          {message}
        </div> */}
        <Routes>
          <Route path="/profile/*" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/accounts" element={<AccountList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
