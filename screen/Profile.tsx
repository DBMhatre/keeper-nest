import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../styles/profileStyles';
import { account } from '../server/appwrite';
import { Role } from 'appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import EditModal from '../components/EditModal';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [id, setId] = useState('');
  const navigation = useNavigation();
  const [editVisible, setEditVisible] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        setEmail(user.email);
        setName(user.name);
        setRole(user.prefs.role);
        setGender(user.prefs.gender);
        setId(user.prefs.employeeId);
      } catch (err) {
        console.log("Profile error: ", err);
      }
    }
    fetchData();
  }, []);

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

  interface updatedProps {
    name: string,
    gender: string,
    email: string
  }

  async function handleSaveProfile({ name, gender }: updatedProps) {
    try {
      await account.updateName(name);
      await account.updatePrefs({
        gender: gender
      });

      setName(name);
      setGender(gender);

      setAlertTitle('Updation successful');
      setAlertMessage('Data is succesfully updated.');
      setAlertType('success');
      setShowAlert(true);
    } catch (err) {
      console.log('Error updating profile:', err);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#007bff" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Icon name="account-circle" size={28} color="#fff" />
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

        </View>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUthyPYYztH6YOkS-gkq1VFOLUw0MDQFwr4QqbBvc8NXpMWErpwezy1T5_EBYbL1SXRJs&usqp=CAU',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>

        <TouchableOpacity style={styles.editProfileBtn} onPress={() => setEditVisible(true)}>
          <Icon name="account-edit" size={18} color="#007bff" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="email-outline" size={22} color="#007bff" />
            <Text style={styles.infoText}>Email: {email}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="card-account-details-outline" size={22} color="#007bff" />
            <Text style={styles.infoText}>Employee ID: {id}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="gender-male" size={22} color="#007bff" />
            <Text style={styles.infoText}>Gender: {gender}</Text>
          </View>

          <View style={styles.row}>
            <Icon name="account-cog" size={22} color="#007bff" />
            <Text style={styles.infoText}>Role: {role}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <EditModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSave={handleSaveProfile}
        currentData={{ name: name, gender: gender, email: email }}
      />

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
        onConfirmPressed={() => {
          setShowAlert(false);
          setEditVisible(false);
        }}
      />
    </ScrollView>
  );
}

