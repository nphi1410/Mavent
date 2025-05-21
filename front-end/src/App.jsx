import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';

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
        <>
            <h1>{message}</h1>
        </>
    );
}

export default App;
