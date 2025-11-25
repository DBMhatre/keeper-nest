// src/navigation/EmployeeTabs.tsx
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { account } from '../server/appwrite';

import EmployeeDashboard from '../screen/EmployeeDashboard';
import Profile from '../screen/Profile';

const Tab = createBottomTabNavigator();

export default function EmployeeTabs() {
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
          {
            cancelable: true,
            userInterfaceStyle: 'light'
          }
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
      borderTopWidth: 0,
      height: 60,
      paddingBottom: 4,
      elevation: 15,
      shadowColor: '#007bff',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      position: 'absolute',
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
    },
    tabBarIconStyle: {
      marginTop: 4,
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
  );
}