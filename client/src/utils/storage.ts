import { USER_ID_KEY, THEME_KEY } from '@/config/constants';

/**
 * Generate or retrieve user ID from localStorage
 * @returns {string} User ID
 */
export const getUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

/**
 * Get saved theme from localStorage
 * @returns {string|null} Theme ('dark' or null)
 */
export const getSavedTheme = (): string | null => {
  return localStorage.getItem(THEME_KEY);
};

/**
 * Save theme to localStorage
 * @param {boolean} isDark - Whether dark mode is enabled
 */
export const saveTheme = (isDark: boolean): void => {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
};
