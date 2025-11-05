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

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('Male');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!name || !email || !employeeId || !gender) {
      Alert.alert('Please fill all details properly');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password must be at least 8 characters long');
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
      navigation.navigate('Login');
    } catch (error) {
      if (error?.code === 409) {
        Alert.alert(
        'Account already exists',
        'Please log in using your email and password.',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
      } else {
        Alert.alert('Signup failed', 'Please try again later.');
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
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Login</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
