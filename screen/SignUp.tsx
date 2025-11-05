import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/signupStyles';
import { useNavigation } from '@react-navigation/native';
import { account } from '../server/appwrite';
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

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

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

    try {
      try {
        const currentUser = await account.get();
        if (currentUser) {
          await account.deleteSession('current');
        }
      } catch { }

      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      await account.updatePrefs({ role });

      try {
        const currentUser = await account.get();
        if (currentUser) {
          await account.deleteSession('current');
        }
      } catch { }

      setAlertTitle('Signup Successful');
      setAlertMessage('You can now login.');
      setAlertType('success');
      setShowAlert(true);

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
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Please fill in your details to sign up</Text>

        <View style={styles.inputContainer}>
          <Icon name="account-outline" size={22} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#777"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="email-outline" size={22} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#777"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="card-account-details-outline" size={22} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Employee ID"
            placeholderTextColor="#777"
            style={styles.input}
            value={employeeId}
            onChangeText={setEmployeeId}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={22} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#777"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>


        <View style={styles.pickerContainer}>
          <Icon name="gender-male-female" size={22} color="#777" style={styles.icon} />
          <Picker
            selectedValue={gender}
            onValueChange={(value) => setGender(value)}
            style={styles.picker}>
            <Picker.Item label="Select Gender" value="Select Gender" color="#aaa" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Icon name="account-cog" size={22} color="#666" style={styles.icon} />
          <Picker
            selectedValue={role}
            onValueChange={(value) => setRole(value)}
            style={styles.picker}>
            <Picker.Item label="Select Role" value="" color="#aaa" />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Employee" value="employee" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.link} onPress={() => navigation.navigate('Login' as never)}>Login</Text>
        </Text>
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
