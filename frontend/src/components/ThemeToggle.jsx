import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDarkMode ? 'translate-x-3' : '-translate-x-3'
        }`}
      >
        {isDarkMode ? (
          <Moon className="w-3 h-3 text-blue-500" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;