import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { account, databases } from '../server/appwrite';
import { createFormStyles } from '../styles/employeeFormStyles';
import { Query } from 'appwrite';
import { sendMail } from '../server/emailSender';
import CustomModal from './CustomModal';
import CustomDropdown from './CustomDropdown';
import { useTheme } from '../contexts/ThemeContext';
import { encrypt } from '../server/encrypt_decrypt_password';

const EmployeeCreate = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [gender, setGender] = useState('No');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();
  const [confirm, setConfirm] = useState(false);

  const { colors, isDark } = useTheme();
  const styles = createFormStyles({ ...colors, isDark });

  const showAlertBox = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const validateForm = (): boolean => {
    if (!name || name.trim().length === 0) {
      showAlertBox('Validation Error', 'Please enter employee name.', 'error');
      return false;
    }
    
    if (name.trim().length < 2) {
      showAlertBox('Validation Error', 'Name must be at least 2 characters.', 'error');
      return false;
    }
    
    if (name.trim().length > 100) {
      showAlertBox('Validation Error', 'Name cannot exceed 100 characters.', 'error');
      return false;
    }

    if (!email || email.trim().length === 0) {
      showAlertBox('Validation Error', 'Please enter email address.', 'error');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlertBox('Validation Error', 'Please enter a valid email address.', 'error');
      return false;
    }

    if (!employeeId || employeeId.trim().length === 0) {
      showAlertBox('Validation Error', 'Please enter employee ID.', 'error');
      return false;
    }
    
    if (employeeId.trim().length < 3) {
      showAlertBox('Validation Error', 'Employee ID must be at least 3 characters.', 'error');
      return false;
    }
    
    if (employeeId.trim().length > 50) {
      showAlertBox('Validation Error', 'Employee ID cannot exceed 50 characters.', 'error');
      return false;
    }
    
    const idRegex = /^[A-Za-z0-9_-]+$/;
    if (!idRegex.test(employeeId)) {
      showAlertBox('Validation Error', 'Employee ID can only contain letters, numbers, hyphens, and underscores.', 'error');
      return false;
    }

    if (gender === 'No') {
      showAlertBox('Validation Error', 'Please select gender.', 'error');
      return false;
    }
    
    if (gender !== 'Male' && gender !== 'Female') {
      showAlertBox('Validation Error', 'Please select a valid gender (Male or Female).', 'error');
      return false;
    }

    return true;
  };

  const handleCreateEmployee = async () => {
    if (!validateForm()) {
      return;
    }

    const dbId = "user_info";
    const collectionId = "user_info";

    try {
      const existingEmp = await databases.listDocuments(
        dbId,
        collectionId,
        [Query.equal('employeeId', employeeId)]
      );

      if (existingEmp.total > 0) {
        showAlertBox(
          'Duplicate Employee ID',
          `Employee ID "${employeeId}" already exists. Please use a different ID.`,
          'error'
        );
        return; 
      }
    } catch (error) {
      console.error("Error checking duplicate ID:", error);
      showAlertBox('Error', 'Failed to check employee ID. Please try again.', 'error');
      return;
    }

    try {
      const existingEmail = await databases.listDocuments(
        dbId,
        collectionId,
        [Query.equal('email', email)]
      );

      if (existingEmail.total > 0) {
        showAlertBox(
          'Duplicate Email',
          `Email "${email}" is already registered. Please use a different email.`,
          'error'
        );
        return;
      }
    } catch (error) {
      console.error("Error checking duplicate email:", error);
      showAlertBox('Error', 'Failed to check email. Please try again.', 'error');
      return;
    }

    setLoading(true);

    try {
      const password = `EMPLOYEE_${employeeId}`;
      let user = null;
      try {
        user = await account.get();
      } catch (error) {
        console.log("Error: ", error);
        navigation.navigate('Login' as any);
        return;
      }
      const adminId = user.$id;
      const adminName = user?.name;
      const newUser = await account.create(employeeId, email, password, name);
      console.log("Created employee auth user:", newUser);

      const employeeDoc = await databases.createDocument(
        dbId,
        collectionId,
        employeeId,
        {
          employeeId,
          name: name.trim(),
          email: email.trim(),
          password: encrypt(password),
          gender,
          role: "employee",
          creatorMail: `${adminName} (${adminId})`
        }
      );
      setConfirm(true);
      setSuccess(true);

      await sendMail({
        to: email,
        subject: `Welcome to KeeperNest — Your Employee Account Details`,
        html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fb 0%, #eef1f9 100%); padding: 40px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(79,70,229,0.15);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: #fff; padding: 30px 20px;">
        <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.5px;">Welcome to KeeperNest</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px 25px; text-align: left;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          We're excited to have you on board at <strong>KeeperNest</strong>!<br>
          Your employee account has been created successfully. Below are your login credentials — please use them to access your account.
        </p>

        <!-- Login Details Card -->
        <div style="background: #f8fafc; border: 1px solid #e5e7eb; padding: 18px 20px; border-radius: 10px; margin: 25px 0;">
          <p style="margin: 0; font-weight: bold; color: #111;">Username (Email):</p>
          <p style="margin: 6px 0 12px; color: #333;">${email}</p>

          <p style="margin: 0; font-weight: bold; color: #111;">Password:</p>
          <p style="margin: 6px 0; color: #333;">${password}</p>
        </div>

        <!-- Instructions -->
        <p style="color: #444; font-size: 15px; line-height: 1.6;">
          <strong>Important:</strong> Please change your password after your first login to keep your account secure.
        </p>

        <p style="color: #444; font-size: 15px; line-height: 1.6;">
          If you face any issues while signing in, our IT support team is here to help — just reply to this email or reach out via the support portal.
        </p>

        <!-- Divider -->
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <!-- Signature -->
        <p style="color: #333; font-size: 15px;">
          Cheers,<br>
          <strong>The KeeperNest Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 15px;">
        <p style="color: #aaa; font-size: 13px; margin: 0;">
          © ${new Date().getFullYear()} KeeperNest. All rights reserved.
        </p>
      </div>
    </div>
  </div>
  `,
      });

      console.log("Employee details stored in DB:", employeeDoc);
      showAlertBox(
        'Success',
        `Employee ${name} created successfully!`,
        'success'
      );
      
    } catch (error: any) {
      console.log("Error: ", error);
      
      if (error.code === 409) {
        showAlertBox(
          'Account Already Exists',
          'An account with this email or username already exists.',
          'error'
        );
      } else if (error.code === 401) {
        navigation.navigate('Login' as any);
        return;
      } else {
        showAlertBox(
          'Error',
          error?.message || 'Failed to create employee. Please try again.',
          'error'
        );
      }
      
      setSuccess(false);
    } finally {
      // setConfirm(false);
      setLoading(false);
    }
  };
  const handleConfirmClose = () => {
      setShowAlert(false);
      setName('');
      setEmail('');
      setEmployeeId('');
      setGender('No');
      setSuccess(false);
      navigation.navigate('EmployeeList' as any);
  }

  const handleModalClose = () => {
    setShowAlert(false);
    setSuccess(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Icon name="account-plus" size={26} color="#3b82f6" />
                <Text style={styles.headerTitle}>Create Employee</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                Please fill in the details of the new employee
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="account-outline" size={20} color="#3b82f6" style={styles.icon} />
                <TextInput
                  placeholder="Enter employee's full name"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  selectionColor="#3b82f6"
                  cursorColor="#3b82f6"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Email Address <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="email-outline" size={20} color="#3b82f6" style={styles.icon} />
                <TextInput
                  placeholder="Enter employee's email address"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  selectionColor="#3b82f6"
                  cursorColor="#3b82f6"
                />
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Employee ID <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="card-account-details-outline" size={20} color="#3b82f6" style={styles.icon} />
                <TextInput
                  placeholder="Enter unique employee ID"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  selectionColor="#3b82f6"
                  cursorColor="#3b82f6"
                />
              </View>
            </View>

            {/* Gender */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Gender <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Icon name="gender-male-female" size={20} color="#3b82f6" style={styles.icon} />
                <CustomDropdown
                  data={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                  selectedValue={gender}
                  onValueChange={(value) => setGender(value)}
                  placeholder="Select Gender"
                  searchable={false}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
              onPress={handleCreateEmployee}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[styles.buttonText, { marginLeft: 10 }]}>Creating Employee...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Create Employee</Text>
                  <Icon name="account-check" size={20} color="#fff" style={styles.buttonIcon} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal
        show={showAlert}
        title={alertTitle}
        message={alertMessage}
        alertType={alertType}
        confirmText="Got It"
        showCancelButton={false}
        onConfirmPressed={confirm ? handleConfirmClose : handleModalClose}
        onCancelPressed={handleModalClose}
        confirmButtonColor={alertType === 'success' ? '#10b981' :
          alertType === 'error' ? '#ef4444' :
            alertType === 'warning' ? '#f59e0b' : '#3b82f6'}
        showSuccessTick={success && alertType === 'success'}
      />
    </SafeAreaView>
  );
};

export default EmployeeCreate;