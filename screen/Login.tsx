import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { account, databases } from '../server/appwrite';
import { styles } from '../styles/loginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Query } from 'appwrite';
import * as Keychain from 'react-native-keychain';
import CustomModal from '../components/CustomModal';
import ExitAppModal from '../components/ExitAppModal';

export default function Login() {
  const navigation = useNavigation();
  const [showExitModal, setShowExitModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'warning' | 'error' | 'info'>('info');

  useEffect(() => {
    checkStoredCredentials();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setShowExitModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        backHandler.remove();
        setShowExitModal(false);
      };
    }, [])
  );

  const handleExitConfirm = () => {
    BackHandler.exitApp();
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  const storeCredentials = async (email: string, password: string) => {
    try {
      await Keychain.setGenericPassword(email, password, {
        service: 'KeeperNestApp',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      console.log("Credentials stored securely in Keychain");
    } catch (error) {
      console.log('Error storing credentials in Keychain:', error);
    }
  };

  const getStoredCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'KeeperNestApp',
      });
      if (credentials) {
        return {
          email: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.log('Error retrieving credentials from Keychain:', error);
      return null;
    }
  };

  const clearStoredCredentials = async () => {
    try {
      await Keychain.resetGenericPassword({ service: 'KeeperNestApp' });
      await AsyncStorage.multiRemove(['rememberMe', 'userEmail']);
      console.log("Credentials cleared from Keychain");
    } catch (error) {
      console.log('Error clearing credentials from Keychain:', error);
    }
  };

  const checkStoredCredentials = async () => {
    try {
      const shouldRemember = await AsyncStorage.getItem('rememberMe');

      if (shouldRemember === 'true') {
        setRememberMe(true);

        const credentials = await getStoredCredentials();
        if (credentials) {
          setEmail(credentials.email);
          setPassword(credentials.password);
        }
      }
    } catch (error) {
      console.log('Error checking stored credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertTitle('Missing Fields');
      setAlertMessage('Please fill all fields before logging in.');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      try {
        await account.deleteSession('current');
        console.log("Cleared existing session");
      } catch (error) {
        console.log("No active session to clear");
      }

      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();

      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('userEmail', email);
        await storeCredentials(email, password);
        console.log("Credentials stored securely for remember me");
      } else {
        await AsyncStorage.setItem('rememberMe', 'false');
        await AsyncStorage.removeItem('userEmail');
        await clearStoredCredentials();
        console.log("Credentials not stored");
      }

      const dbId = "user_info";
      const collectionId = "user_info";

      const response = await databases.listDocuments(
        dbId,
        collectionId,
        [Query.equal("employeeId", user.$id)]
      );

      const employeeData = response.documents[0];
      const role = employeeData.role;
      const status = employeeData.status;
      console.log("User Role:", role);

      console.log('Logged in successfully:', session);

      if (role === 'admin') {
        navigation.navigate('AdminTabs' as any);
      } else {
        navigation.navigate('EmployeeTabs' as any);
      }

    } catch (err: any) {
      console.log('Error occurred:', err);
      setAlertTitle('Login Failed');
      setAlertMessage(err.message || 'Something went wrong, please try again.');
      setAlertType('error');
      setShowAlert(true);
      await clearStoredCredentials();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingBottom: 20
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Icon name="shield-account" size={32} color="#fff" />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your KeeperNest account</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Icon name="email-outline" size={22} color="#3b82f6" style={styles.icon} />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#3b82f6"
                  cursorColor="#3b82f6"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={22} color="#3b82f6" style={styles.icon} />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  style={styles.input}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  selectionColor="#3b82f6"
                  cursorColor="#3b82f6"
                />
              </View>
            </View>

            <View style={styles.rememberContainer}>
              <TouchableOpacity
                style={styles.rememberCheckbox}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <Icon
                  name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={rememberMe ? '#3b82f6' : '#94a3b8'}
                />
                <Text style={styles.rememberText}>Remember Me</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
              onPress={handleLogin}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[styles.buttonText, { marginLeft: 10 }]}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?{' '}
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate('Signup' as any)}
                >
                  Create Account
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 KeeperNest • Secure Access
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        show={showAlert}
        title={alertTitle}
        message={alertMessage}
        alertType={alertType}
        confirmText="Okay"
        showCancelButton={false}
        onConfirmPressed={() => setShowAlert(false)}
        onCancelPressed={() => setShowAlert(false)}
        confirmButtonColor={alertType === 'success' ? '#10b981' :
          alertType === 'error' ? '#ef4444' :
            alertType === 'warning' ? '#f59e0b' : '#3b82f6'}
      />

      <ExitAppModal
        visible={showExitModal}
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
        title="Exit KeeperNest"
        message="Are you sure you want to exit the app?"
        confirmText="Exit"
        cancelText="Cancel"
      />
    </SafeAreaView>
  );
}

const additionalStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});