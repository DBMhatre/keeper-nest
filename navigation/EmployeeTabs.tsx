// src/navigation/EmployeeTabs.tsx
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { account } from '../server/appwrite';

import EmployeeDashboard from '../screen/EmployeeDashboard';
import Profile from '../screen/Profile';
import ExitAppModal from '../components/ExitAppModal';
import { useTheme } from '../contexts/ThemeContext';
const Tab = createBottomTabNavigator();

export default function EmployeeTabs() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [showExitModal, setShowExitModal] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setShowExitModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        backHandler.remove();
        setShowExitModal(false);
      };
    }, [])
  );

  const handleExitConfirm = () => {
    BackHandler.exitApp();
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.surface,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginBottom: 4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={EmployeeDashboard}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={focused ? "home" : "home-outline"}
                color={color}
                size={size}
              />
            ),
            tabBarLabel: 'Home',
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={focused ? "account" : "account-outline"}
                color={color}
                size={size}
              />
            ),
            tabBarLabel: 'Profile',
          }}
        />
      </Tab.Navigator>
      <ExitAppModal
        visible={showExitModal}
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
        title="Exit KeeperNest"
        message="Are you sure you want to exit the app?"
        confirmText="Exit"
        cancelText="Cancel"
      />
    </>
  );
}