// Environment variables
export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // Use environment variable with fallback
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Mavent App',
};
