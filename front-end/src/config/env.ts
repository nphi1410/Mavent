// Environment variables
export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Mavent App',
};
