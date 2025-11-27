import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { account } from './server/appwrite';
import StackNavigation from './navigation/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export default function App() {

  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, 
      gcTime: 15 * 60 * 1000, 
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
    </QueryClientProvider>
  );
}
