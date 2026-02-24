import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Check local storage or system preference
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('shopsphere_theme');
        return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('shopsphere_theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('shopsphere_theme', 'light');
        }

        // Handle storage events from other dashboards/tabs
        const handleStorageChange = (e) => {
            if (e.key === 'shopsphere_theme') {
                setIsDarkMode(e.newValue === 'dark');
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.addEventListener('storage', handleStorageChange);
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
