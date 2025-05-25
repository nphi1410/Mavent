import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import HomePage from './pages/HomePage';


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
      <HomePage/>
    </div>
  );
}

export default App;