import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { account, databases } from '../server/appwrite';
import { styles } from '../styles/loginStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Query } from 'appwrite';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

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
        const currentUser = await account.get();
        console.log("User is logged in:", currentUser);
        await account.deleteSession('current');
      } catch (error) {
        console.log("No active session found");
      }

      const session = await account.createEmailPasswordSession(email, password);

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
      const status = employeeData.status;
      console.log("User Role:", role);

      if (status !== 'active') {
        setAlertTitle('Account Inactive');
        setAlertMessage('Your account is not active. Please contact the administrator.');
        setAlertType('error');
        setShowAlert(true);
        await account.deleteSession('current');
        setLoading(false);
        return;
      }

      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        console.log("Remember is checked!");
      } else {
        await AsyncStorage.removeItem('rememberMe');
      }

      console.log('Logged in successfully:', session);

      setEmail('');
      setPassword('');

      if (role === 'admin') {
        navigation.navigate('AdminTabs' as never);
      } else {
        navigation.navigate('EmployeeTabs' as never);
      }

    } catch (err: any) {
      console.log('Error occurred:', err);
      setAlertTitle('Login Failed');
      setAlertMessage(err.message || 'Something went wrong, please try again.');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="shield-account" size={32} color="#fff" />
            </View>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your KeeperNest account</Text>
        </View>

        {/* Enhanced Form Card */}
        <View style={styles.formCard}>
          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Remember Me */}
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

          {/* Login Button */}
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

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Signup' as never)}
              >
                Create Account
              </Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 KeeperNest • Secure Access
          </Text>
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={alertTitle}
          message={alertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Okay"
          confirmButtonColor={alertType === 'success' ? '#4CAF50' : '#FF3B30'}
          onConfirmPressed={() => setShowAlert(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}