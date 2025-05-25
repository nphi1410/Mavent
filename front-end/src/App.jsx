import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import SuperAdminSidebar from './components/SuperAdminSidebar';
import SuperAdminHeader from './components/SuperAdminHeader';
import SuperAdminDashboard from './pages/SuperAdminDashBoard';
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
    <div className="h-screen flex bg-amber-50">
      <SuperAdminSidebar />
      <div className="flex flex-col flex-1">
        <SuperAdminHeader />

        <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
            <SuperAdminDashboard />
            {/* <SuperAdminViewEvents /> */}
        </main>
      </div>
    </div>
  );
}

export default App;