import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { account } from './server/appwrite';
import StackNavigation from './navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  // useEffect(() => {
  //   const testConnection = async () => {
  //     try {
  //       // const session = await account.createAnonymousSession();
  //       // console.log('Anonymous session created:', session);

  //       const user = await account.get();
  //       console.log('Current user:', user);
  //     } catch (err) {
  //       console.error('Connection failed:', err.message);
  //     }
  //   };

  //   testConnection();
  // }, []);

  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}
