import { ActivityIndicator, StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { account } from '../server/appwrite';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmployeeDashboard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
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
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      const user = await account.get();
      await account.deleteSession('current');
      await AsyncStorage.removeItem('rememberMe');
      console.log("Logout session: ", user); 
      navigation.navigate('Login' as never);
    } catch (err) {
      console.log("Logout error occurred:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emailText}>Employee: {email}</Text>
      <View style={styles.buttonContainer}>
        <Button title='Logout' onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emailText: { fontSize: 18, marginBottom: 10 },
  buttonContainer: { margin: 10 },
});
