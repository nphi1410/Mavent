import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for handling theme (dark/light mode)
 * @returns {object} Theme state and toggle function
 */
const useTheme = () => {
  // Check if user has a theme preference in localStorage or prefer dark mode in system
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return savedTheme || (prefersDark ? 'dark' : 'light');
  };
  
  const [theme, setTheme] = useState(getInitialTheme);
  
  // Apply theme to document
  const applyTheme = useCallback((newTheme) => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    
    localStorage.setItem('theme', newTheme);
  }, []);
  
  // Effect to apply theme on mount and change
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      return newTheme;
    });
  };
  
  return { theme, toggleTheme };
};

export default useTheme;
