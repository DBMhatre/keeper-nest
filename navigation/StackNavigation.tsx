import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Animated,
  Easing
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { account, databases } from '../server/appwrite';
import sticker from '../assets/images/logo_app.png'

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
import EmployeeAssetDetails from '../components/employee/AssetDetails';
import { useTheme } from '../contexts/ThemeContext';
import SystemNavigationBar from 'react-native-system-navigation-bar';
const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { colors, isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (isDark) {
      SystemNavigationBar.setNavigationColor(colors.background, 'dark');
    } else {
      SystemNavigationBar.setNavigationColor('#FFFFFF', 'light');
    }
  }, [isDark, colors.background]);

  const styles = createLoadingStyles(colors);
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const checkSession = async () => {
      try {
        try {
          const user = await account.get();
          console.log('User session found:', user.email);

          const response = await databases.listDocuments(
            'user_info',
            'user_info',
            [Query.equal("email", user.email)]
          );

          if (response.documents && response.documents.length > 0) {
            const employeeData = response.documents[0];
            const role = employeeData.role;
            const status = employeeData.status;

            if (status === 'active') {
              console.log('User is active, navigating to:', role === 'admin' ? 'AdminTabs' : 'EmployeeTabs');
              setInitialRoute(role === 'admin' ? 'AdminTabs' : 'EmployeeTabs');
              setLoading(false);
              return;
            } else {
              console.log('User is not active, redirecting to Login');
              try {
                await account.deleteSession('current');
              } catch (err) {
                console.log('Error deleting session:', err.message);
              }
            }
          } else {
            console.log('User not found in database');
            try {
              await account.deleteSession('current');
            } catch (err) {
              console.log('Error deleting session:', err.message);
            }
          }
        } catch (err) {
          console.log('No valid session found, redirecting to Login:', err.message);
        }

        setInitialRoute('Login');
      } catch (error) {
        console.log('Unexpected error in checkSession:', error);
        setInitialRoute('Login');
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.imageContainer}>
          <Animated.View
            style={[
              styles.continuousLoader,
              {
                transform: [
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.circularPath} />
          </Animated.View>

          <Image
            source={sticker}
            style={styles.logo}
          />
        </View>
        <Text style={styles.loadingText}>KeeperNest</Text>
      </View>
    );
  }

  const routeToUse = initialRoute || 'Login';

  return (
    <Stack.Navigator initialRouteName={routeToUse}>
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
      <Stack.Screen name="EmployeeAssetDetails" component={EmployeeAssetDetails} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const createLoadingStyles = (colors) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  continuousLoader: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularPath: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: colors.primary,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
});

const loadingStyles = createLoadingStyles({
  background: '#f8fafc',
  primary: '#3b82f6',
});