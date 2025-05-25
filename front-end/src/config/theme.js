// Cấu hình theme cho dark/light mode

const themeConfig = {
  light: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529',
    border: '#dee2e6',
  },
  dark: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    background: '#212529',
    text: '#f8f9fa',
    border: '#495057',
  },
  current: 'light', // default theme
};

// Kiểm tra và áp dụng theme từ localStorage
export const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    themeConfig.current = savedTheme;
    applyTheme(savedTheme);
  } else {
    // Kiểm tra theme ưa thích của system
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      themeConfig.current = 'dark';
      applyTheme('dark');
    }
  }
};

// Thay đổi theme
export const toggleTheme = () => {
  const newTheme = themeConfig.current === 'light' ? 'dark' : 'light';
  themeConfig.current = newTheme;
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
  return newTheme;
};

// Áp dụng theme vào document
export const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const getCurrentTheme = () => themeConfig.current;

export const getThemeColors = () => themeConfig[themeConfig.current];

export default themeConfig;
