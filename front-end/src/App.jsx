import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import CreateEvent from './pages/createEvent';


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
    <div>
      <CreateEvent />
    </div>
  );
}

export default App;
