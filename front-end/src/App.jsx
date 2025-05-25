import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import CreateEvent from './pages/createEvent';
import SuperAdminSidebar from './components/SuperAdminSidebar';
import Register from './pages/Register';
import Login from './pages/Login';

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
    <div className='w-screen h-screen'>
{/* 
      <div className='w-full h-full flex justify-center items-center'>
      </div> */}
    </div>
  );
}

export default App;