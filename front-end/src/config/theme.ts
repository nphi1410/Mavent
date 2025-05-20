// Cấu hình theme cho dark/light mode

type ThemeType = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
}

interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
  current: ThemeType;
}

const themeConfig: ThemeConfig = {
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
  current: 'light',
};

// Hàm lấy theme hiện tại
export const getCurrentTheme = (): ThemeColors => {
  const userPrefersDark = window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Lấy theme từ localStorage hoặc dùng theme hệ thống
  const savedTheme = localStorage.getItem('theme') as ThemeType || 
    (userPrefersDark ? 'dark' : 'light');
  
  themeConfig.current = savedTheme;
  return themeConfig[savedTheme];
};

// Hàm chuyển đổi theme
export const toggleTheme = (): ThemeColors => {
  const newTheme: ThemeType = themeConfig.current === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  themeConfig.current = newTheme;
  return themeConfig[newTheme];
};

export default themeConfig;
