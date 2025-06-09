// Environment variables
export const env = {
  API_URL: 'http://localhost:8080', // Temporarily hardcoded for testing
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Mavent App',
};

// Debug log to see what API URL is being used
console.log('Environment configuration:', {
  API_URL: env.API_URL,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: env.NODE_ENV
});
