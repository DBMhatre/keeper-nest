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
import { account } from '../server/appwrite';
import { styles } from '../styles/loginStyles';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // for awesome alerts only
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
        if (currentUser) {
          await account.deleteSession('current');
        }
      } catch { }
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      const role = user.prefs.role;
      console.log("User Role:", role);
      console.log('Logged in successfully:', session);

      setAlertTitle('Login Successful');
      setAlertMessage('Welcome back to KeeperNest!');
      setAlertType('success');
      setShowAlert(true);

      if (role === 'admin') {
        navigation.navigate('AdminDashboard' as never);
      } else {
        navigation.navigate('EmployeeDashboard' as never);
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
        <View style={styles.card}>
          <Text style={styles.title}>
            Login for <Text style={styles.brand}>KeeperNest</Text>
          </Text>
          <Text style={styles.subtitle}>Access your personalized workspace</Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={22} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={22} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
            onPress={handleLogin}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>Logging in...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Don’t have an account?{' '}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Signup' as never)}
            >
              Sign Up
            </Text>
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

