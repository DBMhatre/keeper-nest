// src/navigation/AdminTabs.tsx
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { account } from '../server/appwrite';

import AdminDashboard from '../screen/AdminDashboard';
import Profile from '../screen/Profile';
import ExitAppModal from '../components/ExitAppModal';
const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  const navigation = useNavigation();
  const [showExitModal, setShowExitModal] = useState(false);
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await account.get();
        if (!user) {
          navigation.navigate('Login' as never);
        }
      } catch (error) {
        if (error.code === 409) {
          console.log("Session Expired!");
          navigation.navigate('Login' as never);
        }
      }
    };
    checkUserSession();
  }, [navigation]);

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
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          // Remove position: 'absolute' to prevent content hiding
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarLabel: 'Dashboard',
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