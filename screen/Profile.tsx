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
import { account, databases } from '../server/appwrite';
import { Query, Role } from 'appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import EditModal from '../components/EditModal';
import AwesomeAlert from 'react-native-awesome-alerts';
import EditPasswordModal from '../components/EditPasswordModal';
import * as Keychain from 'react-native-keychain';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [id, setId] = useState('');
  const navigation = useNavigation();
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        
        const dbId = "user_info";
        const collectionId = "user_info";
        const response = await databases.listDocuments(
          dbId,
          collectionId,
          [Query.equal("employeeId", user.$id)]
        );
        const employeeData = response.documents[0];
        setEmail(user.email);
        setName(user.name);
        setRole(employeeData.role);
        setGender(employeeData.gender);
        setId(employeeData.employeeId);
      } catch (err) {
        console.log("Profile error: ", err);
        navigation.navigate('Login' as never);
      }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const user = await account.get();
      await account.deleteSession('current');
      // await AsyncStorage.setItem('rememberMe', 'false');
      // await AsyncStorage.removeItem('userEmail');
      // await Keychain.resetGenericPassword({ service: 'KeeperNestApp' });


      console.log("Logout session: ", user);
      navigation.navigate('Login' as never);
    } catch (err) {
      console.log("Logout error occurred:", err);
    }
  };

  interface updatedProps {
    name: string,
    gender: string
  }

  async function handleSaveProfile({ name, gender }: updatedProps) {
    try {
      await account.updateName(name);
      const user = await account.get();
      const dbId = "user_info";
      const collectionId = "user_info";

      const response = await databases.listDocuments(
        dbId,
        collectionId,
        [Query.equal("employeeId", user.$id)]
      );

      const userDoc = response.documents[0];

      await databases.updateDocument(
        dbId,
        collectionId,
        userDoc.$id,
        { gender: gender }
      );

      setName(name);
      setGender(gender);

      setAlertTitle('Profile Updated');
      setAlertMessage('Your profile information has been updated successfully.');
      setAlertType('success');
      setShowAlert(true);
    } catch (err) {
      console.log('Error updating profile:', err);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />

      {/* Professional Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Icon name="account-circle" size={24} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>
        </View>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://drive.google.com/uc?export=view&id=1CPY8C4qvoLeIyYIJjNDYOPC8vdI6ns_D',
            }}
            style={styles.avatar}
          />
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{role}</Text>
          </View>
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.employeeId}>ID: {id}</Text>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => setEditVisible(true)}>
            <Icon name="account-edit" size={16} color="#3b82f6" />
            <Text style={[styles.actionButtonText, styles.editText]}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.passwordButton]} onPress={() => setPasswordVisible(true)}>
            <Icon name="lock-reset" size={16} color="#3b82f6" />
            <Text style={[styles.actionButtonText, styles.passwordText]}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Icon name="email-outline" size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Icon name="card-account-details-outline" size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Employee ID</Text>
              <Text style={styles.infoValue}>{id}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Icon name="gender-male-female" size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{gender}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Icon name="account-cog" size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{role}</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <EditModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSave={handleSaveProfile}
        currentData={{ name: name, gender: gender }}
      />

      <EditPasswordModal
        visible={passwordVisible}
        onClose={() => setPasswordVisible(false)}
        onAlert={(title, message) => {
          setAlertTitle(title);
          setAlertMessage(message);
          setAlertType('success');
          setShowAlert(true);
        }}
      />

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="Got It"
        confirmButtonColor={alertType === 'success' ? '#10b981' : '#ef4444'}
        confirmButtonStyle={styles.alertButton}
        onConfirmPressed={() => {
          setShowAlert(false);
          setEditVisible(false);
        }}
      />
    </View>
  );
}