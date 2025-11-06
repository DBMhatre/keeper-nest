import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { account } from '../server/appwrite';

import SignUp from '../screen/SignUp';
import Login from '../screen/Login';
import AdminDashboard from '../screen/AdminDashboard';
import EmployeeDashboard from '../screen/EmployeeDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const rememberData = await AsyncStorage.getItem('rememberMe');

        if (rememberData === 'true') {
          const user = await account.get();
          if (user) {
            if (user.prefs.role === 'admin') {
              setInitialRoute('AdminDashboard');
            } else {
              setInitialRoute('EmployeeDashboard');
            }
            return;
          }
        }
      } catch (error) {
        console.log('Session check failed:', error);
      }

      setInitialRoute('Login');
      setLoading(false);
    };

    checkSession().finally(() => setLoading(false));
  }, []);

  if (loading || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Signup" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
