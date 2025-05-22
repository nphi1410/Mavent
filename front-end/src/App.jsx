import { useEffect, useState } from 'react';
import { getGreeting } from './services/testService';
import Login from './pages/Login';

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
        <div className='h-screen w-screen'>
            {/* nhung div k can can giua thi ra ngoai nay */}

            <div className='w-full h-full flex flex-col items-center justify-center'>
                {/* nhung div can can giua thif vao day */}
                <Login />

            </div>
        </div>


    );
}

export default App;
