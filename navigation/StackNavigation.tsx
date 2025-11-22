import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account, databases } from '../server/appwrite';

import SignUp from '../screen/SignUp';
import Login from '../screen/Login';
import AdminTabs from './AdminTabs';
import EmployeeTabs from './EmployeeTabs';
import { Query } from 'appwrite';
import Profile from '../screen/Profile';
import AssetForm from '../components/AssetForm';
import EmployeeCreate from '../components/EmployeeCreate';
import AssetList from '../components/AssetList';
import EmployeeList from '../components/EmployeeList';
import EmployeeDetails from '../components/EmployeeDetails';
import AssetDetails from '../components/AssetDetails';
import AssetEmployeeDetails from '../components/AssetEmployeeDetails';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        try {
          const allDocuments = await databases.listDocuments(
            'AssetManagement',
            'assets'
          );
          const currentDate = new Date();
          const expiredDate = new Date(allDocuments.documents[0].expiredAt);
          if (currentDate >= expiredDate) {
          for (const doc of allDocuments.documents) {
            const newExpiredAt = new Date(expiredDate.getFullYear() + 1, 11, 31);

            await databases.updateDocument(
              'AssetManagement',
              'assets',
              doc.$id,
              {
                expiredAt: newExpiredAt.toISOString(),
                assignedTo: 'unassigned',
                status: 'Available'
              }
            );
            console.log(`Extended ${doc.$id} from ${expiredDate.getFullYear()} to ${newExpiredAt.getFullYear()}`);
          }
        }
        } catch (error) {
          console.log('No active session found');
        }
        const rememberData = await AsyncStorage.getItem('rememberMe');
        if (rememberData === 'true') {
          const user = await account.get();
          const dbId = "user_info";
          const collectionId = "user_info";

          const response = await databases.listDocuments(
            dbId,
            collectionId,
            [Query.equal("employeeId", user.$id)]
          );
          const employeeData = response.documents[0];
          const role = employeeData.role;
          console.log("User Role:", role);

          if (user) {
            if (role === 'admin') {
              setInitialRoute('AdminTabs');
            } else {
              setInitialRoute('EmployeeTabs');
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
    <View style={styles.loadingContainer}>
      <Image 
        source={{uri: "https://drive.google.com/uc?export=view&id=1hlW_8inXI5vgSmzF2O7BIUrl1hb1E4Zr"}}
        style={styles.logo}
      />
      <Text style={styles.loadingText}>KeeperNest</Text>
      <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />
    </View>
  );
}

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Signup" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AssetForm" component={AssetForm} options={{ headerShown: false }} />
      <Stack.Screen name="EmployeeCreate" component={EmployeeCreate} options={{ headerShown: false }} />
      <Stack.Screen name="AssetList" component={AssetList} options={{ headerShown: false }} />
      <Stack.Screen name="EmployeeList" component={EmployeeList} options={{ headerShown: false }} />
      <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="EmployeeDetails" component={EmployeeDetails} options={{ headerShown: false }} />
      <Stack.Screen name="AssetDetails" component={AssetDetails} options={{ headerShown: false }} />
      <Stack.Screen name="AssetEmployeeDetails" component={AssetEmployeeDetails} options={{ headerShown: false }} />
    
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 30,
  },
  spinner: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});