import axios from 'axios';

const logout = async () => {
  try {
    await axios.post('http://localhost:8080/api/logout', {}, {
      withCredentials: true, // Very important to send cookies!
    });
    // Optionally clear user state in React
    console.log('Logged out successfully');
    // Redirect to login page
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export default logout;
