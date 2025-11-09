"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check localStorage for theme preference
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    
    // Trigger crazy animation
    setTimeout(() => {
      setIsDark(!isDark);
      
      if (!isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      setTimeout(() => setIsAnimating(false), 600);
    }, 300);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-16 h-8 border-4 border-black rounded-full transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
        isDark ? 'bg-gray-900' : 'bg-yellow-400'
      } ${isAnimating ? 'animate-spin' : ''}`}
    >
      <div
        className={`absolute top-0.5 w-6 h-6 border-2 border-black rounded-full transition-all duration-300 flex items-center justify-center ${
          isDark ? 'right-0.5 bg-gray-100' : 'left-0.5 bg-white'
        } ${isAnimating ? 'scale-150' : 'scale-100'}`}
      >
        {isDark ? (
          <span className="text-xs">🌙</span>
        ) : (
          <span className="text-xs">☀️</span>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
