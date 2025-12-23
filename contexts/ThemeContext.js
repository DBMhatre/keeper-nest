import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const darkThemeColors = {
  background: '#152030ff',      // Lighter dark background
  surface: '#1f2937',         // Surface color
  headerBg: '#1a202c',        // Same as background for header
  text: '#f9fafb',            // Main text
  textSecondary: '#d1d5db',   // Secondary text  
  primary: '#60a5fa',         // Primary color for buttons
  border: '#374151',          // Borders
};

const lightThemeColors = {
  background: '#f8fafc',      // Light background
  surface: '#ffffff',         // Surface color  
  headerBg: '#3b82f6',        // Blue for header
  text: '#1f2937',            // Main text
  textSecondary: '#6b7280',   // Secondary text
  primary: '#3b82f6',         // Blue for buttons
  border: '#e5e7eb',          // Borders
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    AsyncStorage.getItem('keepernest_theme').then(saved => {
      if (saved === 'dark') {
        setIsDark(true);
        StatusBar.setBackgroundColor(darkThemeColors.primary);
        StatusBar.setBarStyle('light-content');
      }
    });
  }, []);
  
  const toggleTheme = useCallback(() => {
    const newMode = !isDark;
    setIsDark(newMode);
    
    const newColors = newMode ? darkThemeColors : lightThemeColors;
    
    StatusBar.setBackgroundColor(newColors.primary);
    StatusBar.setBarStyle('light-content');
    
    AsyncStorage.setItem('keepernest_theme', newMode ? 'dark' : 'light')
      .catch(error => console.warn('Theme save warning:', error));
  }, [isDark]); 
  
  const colors = isDark ? darkThemeColors : lightThemeColors;
  
  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);