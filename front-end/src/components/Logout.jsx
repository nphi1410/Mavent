import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const logout = async () => {
    const navigate = useNavigate();
    try {
        const response = await axios.post('http://localhost:8080/api/logout', {}, {
            withCredentials: true, // Very important to send cookies!
        });
        // Optionally clear user state in React
        if (response.status === 200) {
            console.log('Logged out successfully');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');

            // navigate('/login');
            // Redirect to home page
            window.location.href = '/';
        return (
            <div className='flex items-center justify-center min-h-screen w-full bg-blue-900'>
                <div className='flex w-8/12 h-9/12 bg-white rounded-[40px] overflow-hidden'>
                    <h1>Logout successful</h1>
                    <p>You have been logged out.</p>
                </div>
            </div>
        );
        }

        // Redirect to login page
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

export default logout;
