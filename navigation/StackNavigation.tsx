import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../screen/SignUp'; // import correctly
import Login from '../screen/Login';
import AdminDashboard from '../screen/AdminDashboard';
import EmployeeDashboard from '../screen/EmployeeDashboard';


const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator initialRouteName="Signup">
      <Stack.Screen
        name="Signup"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmployeeDashboard"
        component={EmployeeDashboard}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
