import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { account } from './server/appwrite';
import StackNavigation from './navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
export default function App() {

  // test connection 
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

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}
