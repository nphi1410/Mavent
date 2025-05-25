import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { getGreeting } from './services/testService';
import AppRoutes from './routes/index.jsx';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    getGreeting()
      .then(response => setMessage(response.data))
      .catch(error => {
        console.error('Error fetching greeting:', error);
        setMessage('Failed to load message');
      });
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AppRoutes />
        {message && <div className="text-center p-4 bg-blue-100">{message}</div>}
      </div>
    </Router>
  );
}

export default App;
