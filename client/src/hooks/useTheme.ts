import { useState, useEffect } from 'react';
import { getSavedTheme, saveTheme } from '@/utils/storage';

interface UseThemeReturn {
  darkMode: boolean;
  toggleTheme: () => void;
}

/**
 * Custom hook for managing dark mode theme
 */
export function useTheme(): UseThemeReturn {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = getSavedTheme();
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = (): void => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    saveTheme(newDarkMode);
  };

  return { darkMode, toggleTheme };
}
