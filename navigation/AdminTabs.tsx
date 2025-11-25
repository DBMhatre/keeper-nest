// src/navigation/AdminTabs.tsx
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { account } from '../server/appwrite';

import AdminDashboard from '../screen/AdminDashboard';
import Profile from '../screen/Profile';
import EmployeeCreate from '../components/EmployeeCreate';
import AssetForm from '../components/AssetForm';
import EmployeeList from '../components/EmployeeList';
import AssetList from '../components/AssetList';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  const navigation = useNavigation();

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

  // Back button handler for exit app
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit KeeperNest',
          'Are you sure you want to exit the app?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Exit',
              onPress: () => BackHandler.exitApp(),
              style: 'destructive',
            },
          ],
          { cancelable: true }
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  return (
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
  );
}