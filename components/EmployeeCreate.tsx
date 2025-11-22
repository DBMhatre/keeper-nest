import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { account, databases } from '../server/appwrite';
import { styles } from '../styles/employeeFormStyles';
import { ID } from 'appwrite';
import { sendMail } from '../server/emailSender';

const EmployeeCreate = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [gender, setGender] = useState('No');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  const navigation = useNavigation();

  const showAlertBox = (title: string, message: string, type: 'success' | 'error') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const handleCreateEmployee = async () => {
    if (!name || !email || !employeeId) {
      return showAlertBox('Missing Fields', 'Please fill all required fields.', 'error');
    }

    if (gender === 'No') {
      return showAlertBox('Invalid Gender', 'Please select a valid gender.', 'error');
    }

    setLoading(true);

    try {
      const password = `EMPLOYEE_${employeeId}`;
      const user = await account.get();
      const adminEmail = user.email;
      const newUser = await account.create(employeeId, email, password, name);
      console.log("Created employee auth user:", newUser);

      const dbId = "user_info";
      const collectionId = "user_info";
      const employeeDoc = await databases.createDocument(
        dbId,
        collectionId,
        employeeId,
        {
          employeeId,
          name,
          email,
          gender,
          role: "employee",
          creatorMail: adminEmail
        }
      );

      await sendMail({
        to: email,
        subject: `Welcome to KeeperNest — Your Employee Account Details`,
        html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fb 0%, #eef1f9 100%); padding: 40px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(79,70,229,0.15);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); color: #fff; padding: 30px 20px;">
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

      setName('');
      setEmail('');
      setEmployeeId('');
      setGender('No');
    } catch (error: any) {
      console.error('Create Employee Error:', error);
      showAlertBox(
        'Error',
        error?.message || 'Failed to create employee. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Icon name="account-plus" size={28} color="#3b82f6" />
              <Text style={styles.headerTitle}>Create Employee</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Please fill in the details of the new employee
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Full Name */}
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

          {/* Email Address */}
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

          {/* Employee ID */}
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
              <Picker
                selectedValue={gender}
                onValueChange={(value) => setGender(value)}
                style={styles.picker}
                dropdownIconColor="#3b82f6"
              >
                <Picker.Item label="Select Gender" value="No" color="#9ca3af" />
                <Picker.Item label="Male" value="Male" color="#1f2937" />
                <Picker.Item label="Female" value="Female" color="#1f2937" />
                <Picker.Item label="Other" value="Other" color="#1f2937" />
              </Picker>
            </View>
          </View>

          {/* Create Button */}
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
        onConfirmPressed={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
};

export default EmployeeCreate;