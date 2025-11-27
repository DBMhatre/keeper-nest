import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/signupStyles';
import { useNavigation } from '@react-navigation/native';
import { account, databases } from '../server/appwrite';
import { ID } from 'appwrite';
import AwesomeAlert from 'react-native-awesome-alerts';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Select Gender');
  const [role, setRole] = useState('Select Role');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // EXACT SAME FUNCTIONALITY - NO CHANGES
  const handleSignUp = async () => {
      if (!name || !email || !employeeId) {
        setAlertTitle('Missing Fields');
        setAlertMessage('Please fill all fields before signing up.');
        setAlertType('error');
        setShowAlert(true);
        return;
      }
  
      if (!gender || gender === 'Select Gender') {
        setAlertTitle('Invalid Gender');
        setAlertMessage('Please select a valid gender.');
        setAlertType('error');
        setShowAlert(true);
        return;
      }
  
      if (!role || role === 'Select Role') {
        setAlertTitle('Invalid Role');
        setAlertMessage('Please select a valid role.');
        setAlertType('error');
        setShowAlert(true);
        return;
      }
  
      if (password.length < 8) {
        setAlertTitle('Invalid Password');
        setAlertMessage('Password must be at least 8 characters.');
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
  
        await account.create(employeeId, email, password, name);
  
        const dbId = "user_info";
        const collectionId = "user_info";
  
        await databases.createDocument(
          dbId,
          collectionId,
          employeeId,
          {
            employeeId,
            name,
            email,
            gender,
            role,
            creatorMail: employeeId
          }
        );
  
        navigation.navigate('Login' as never);
  
      } catch (error: any) {
        if (error?.code === 409) {
          setAlertTitle('Account Already Exists');
          setAlertMessage('Please log in using your email and password.');
          setAlertType('error');
          setShowAlert(true);
        } else {
          setAlertTitle('Signup Failed');
          setAlertMessage(error?.message || 'Please try again later.');
          setAlertType('error');
          setShowAlert(true);
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="account-plus" size={32} color="#fff" />
            </View>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Please fill in your details to sign up</Text>
        </View>

        <View style={styles.formCard}>
          {/* Full Name Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Icon name="account-outline" size={22} color="#3b82f6" style={styles.icon} />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#999"
                style={styles.input}
                value={name}
                onChangeText={setName}
                selectionColor="#3b82f6"
                cursorColor="#3b82f6"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={22} color="#3b82f6" style={styles.icon} />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#999"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                selectionColor="#3b82f6"
                cursorColor="#3b82f6"
              />
            </View>
          </View>

          {/* Employee ID Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Employee ID</Text>
            <View style={styles.inputContainer}>
              <Icon name="card-account-details-outline" size={22} color="#3b82f6" style={styles.icon} />
              <TextInput
                placeholder="Employee ID"
                placeholderTextColor="#999"
                style={styles.input}
                value={employeeId}
                onChangeText={setEmployeeId}
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
                placeholder="Password"
                placeholderTextColor="#999"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                selectionColor="#3b82f6"
                cursorColor="#3b82f6"
              />
            </View>
            <Text style={styles.passwordHint}>Must be at least 8 characters</Text>
          </View>

          {/* Gender Picker */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Icon name="gender-male-female" size={22} color="#3b82f6" style={styles.icon} />
              <Picker
                selectedValue={gender}
                onValueChange={(value) => setGender(value)}
                style={styles.picker}
                dropdownIconColor="#3b82f6"
              >
                <Picker.Item label="Select Gender" value="Select Gender" color="#999" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                {/* <Picker.Item label="Other" value="Other" /> */}
              </Picker>
            </View>
          </View>

          {/* Role Picker */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Role</Text>
            <View style={styles.pickerContainer}>
              <Icon name="account-cog" size={22} color="#3b82f6" style={styles.icon} />
              <Picker
                selectedValue={role}
                onValueChange={(value) => setRole(value)}
                style={styles.picker}
                dropdownIconColor="#3b82f6"
              >
                <Picker.Item label="Select Role" value="Select Role" color="#999" />
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Employee" value="employee" />
              </Picker>
            </View>
          </View>

          {/* Sign Up Button - Same functionality */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            disabled={loading} 
            onPress={handleSignUp}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>Signing...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login Link - Same functionality */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Login' as never)}>
              Login
            </Text>
          </Text>
        </View>

      </ScrollView>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="Okay"
        confirmButtonColor={alertType === 'success' ? '#4CAF50' : '#FF3B30'}
        onConfirmPressed={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
};

export default SignUp;