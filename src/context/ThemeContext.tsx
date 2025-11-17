import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    if (!saved) return false;
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn('Failed to parse theme-mode from localStorage:', error);
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', JSON.stringify(isDarkMode));
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-mode');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark-mode');
      root.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
