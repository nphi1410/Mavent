import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import SuperAdminSidebar from './components/SuperAdminSidebar';
import SuperAdminHeader from './components/SuperAdminHeader';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';

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
      <div className="min-h-screen">
        <Routes>
          <Route path="/profile/*" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
