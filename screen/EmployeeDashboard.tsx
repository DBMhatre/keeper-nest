import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { account } from '../server/appwrite';

export default function EmployeeDashboard() {
    const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      useEffect(() => {
        const fetchUser = async () => {
          setLoading(true);
          try {
            const user = await account.get();
            setEmail(user.email); // get the email
          } catch (error) {
            console.log('Error fetching user:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchUser();
      }, []);
    
      if (loading) {
        return <ActivityIndicator size="large" color="#007bff" />;
      }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Employee: {email}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})