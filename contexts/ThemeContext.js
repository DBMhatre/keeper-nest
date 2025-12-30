import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform, StatusBar, useColorScheme, Alert } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const ThemeContext = createContext();

const darkThemeColors = {
  background: '#152030ff',
  surface: '#1f2937',
  headerBg: '#1a202c',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  primary: '#3b82f6',
  border: '#374151',
};

const lightThemeColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  headerBg: '#3b82f6',
  text: '#1f2937',
  textSecondary: '#6b7280',
  primary: '#3b82f6',
  border: '#e5e7eb',
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const colors = isDark ? darkThemeColors : lightThemeColors;

  // Load saved preference
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem('app_theme_mode');
        if (saved === 'force-dark') {
          setIsDark(true);
        } else if (saved === 'force-light') {
          setIsDark(false);
        } else {
          // Follow system
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.warn('Error loading theme preference:', error);
      }
    };
    loadPreference();
  }, [systemColorScheme]);

  const toggleAppTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    AsyncStorage.setItem('app_theme_mode', newDarkMode ? 'force-dark' : 'force-light');
  };

  const followSystemTheme = () => {
    setIsDark(systemColorScheme === 'dark');
    AsyncStorage.setItem('app_theme_mode', 'follow-system');
  };

  return (
    <ThemeContext.Provider value={{ 
      colors, 
      isDark,
      toggleAppTheme,
      followSystemTheme,
      isFollowingSystem: true, 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// // This function would need a native module implementation
// // For Android, you might use UIManager or create a native module
// const changeAndroidDarkMode = (enableDarkMode) => {
//   if (Platform.OS === 'android') {
//     // This is placeholder code - actual implementation requires native Android code
//     console.log('Would change Android system dark mode to:', enableDarkMode);
    
//     // Common approaches:
//     // 1. Use ADB command (requires rooted device or special permissions)
//     // 2. Use Settings.System API via Native Module
//     // 3. Use DevicePolicyManager for managed devices
//     Alert.alert(
//       'System Dark Mode',
//       `To implement system dark mode toggle:\n\n1. Create a native Android module\n2. Use Settings.System.putInt()\n3. Request WRITE_SETTINGS permission\n4. May not work on newer Android versions`,
//       [{ text: 'OK' }]
//     );
//   }
// };

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};