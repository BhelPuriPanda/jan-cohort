import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
        relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
        ${theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 text-yellow-400 border border-white/10'
                    : 'bg-black/5 hover:bg-black/10 text-purple-600 border border-black/10'
                }
        hover:scale-105 active:scale-95
      `}
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    size={20}
                    className={`absolute inset-0 transition-transform duration-500 ease-spring ${theme === 'light' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
                        }`}
                />
                <Moon
                    size={20}
                    className={`absolute inset-0 transition-transform duration-500 ease-spring ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0'
                        }`}
                />
            </div>
        </button>
    );
};

export default ThemeToggle;
