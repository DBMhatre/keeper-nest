import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { account } from '../server/appwrite';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await account.get();
        setEmail(user.email);
      } catch (error) {
        console.log('No active session found');
        navigation.navigate('Login' as never); 
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  const handleLogout = async () => {
      try {
        const user = await account.get();
        if (user) {
          await account.deleteSession('current');
          await AsyncStorage.removeItem('rememberMe');
          console.log("Logout session: ", user); 
        }

        navigation.navigate('Login' as never)
      } catch (err) {
        console.log("Logout error occured: ", err);
      }
    }

  return (
    <View>
      <Header />
    </View>
  )
}