import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import { ID } from 'appwrite';
import { account, databases } from '../server/appwrite';
import { styles } from '../styles/assetFormStyles';
import { Asset } from './asset';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-neat-date-picker';

const DATABASE_ID = 'assetManagement';
const COLLECTION_ID = 'assets';

const AssetForm = () => {
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('');
  const [assetId, setAssetId] = useState('');
  const status = 'Available';
  const [description, setDescription] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [focusedInput, setFocusedInput] = useState('');
  const navigation = useNavigation();

  const showAlertBox = (title: string, message: string, type: 'success' | 'error') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const openDatePicker = () => setShowDatePicker(true);

  const onCancel = () => {
    setShowDatePicker(false);
  };

  const onConfirm = (output: any) => {
    setShowDatePicker(false);
    console.log(output);
    setPurchaseDate(output.dateString ?? '');
  };

  const handleCreateAsset = async () => {
    try {
      const user = await account.get();
    } catch (error) {
      console.log("Error: ", error);
      navigation.navigate('Login' as never);
    }
    if (!assetName || !assetType || !assetId || !status || !purchaseDate) {
      return showAlertBox('Missing Fields', 'Please fill all required fields.', 'error');
    }

    setLoading(true);

    const currentYear = new Date().getFullYear();
    const expiredAt = new Date(currentYear, 11, 31);

    try {
      const assetData: Asset = {
        assetName,
        assetType,
        assetId,
        status,
        description,
        purchaseDate: new Date(purchaseDate).toISOString(),
        expiredAt: expiredAt.toISOString()
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        assetData
      );

      console.log('Asset created:', response);
      showAlertBox('Success', 'Asset added successfully!', 'success');

      setAssetName('');
      setAssetType('');
      setAssetId('');
      setDescription('');
      setPurchaseDate('');
    } catch (error: any) {
      console.error('Create Asset Error:', error);
      showAlertBox('Error', error?.message || 'Failed to add asset.', 'error');
      navigation.navigate('Login' as never);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (fieldName: string) => {
    return focusedInput === fieldName ? styles.inputContainerFocused : null;
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select purchase date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <Icon name="plus-circle" size={26} color="#3b82f6" />
                <Text style={styles.headerTitle}>Add New Asset</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                Please fill in the details of the new asset
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Asset Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Asset Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputContainer, getInputStyle('assetName')]}>
                <Icon name="laptop" size={20} color="#3b82f6" style={styles.icon} />
                <TextInput
                  placeholder="e.g., Dell Inspiron Laptop"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  value={assetName}
                  onChangeText={setAssetName}
                  selectionColor="#3b82f6"
                  cursorColor="#3b82f6"
                />
              </View>
            </View>

            {/* Asset Type */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Asset Type <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                <Icon name="shape-outline" size={20} color="#3b82f6" style={styles.icon} />
                <Picker
                  selectedValue={assetType}
                  onValueChange={(value) => setAssetType(value)}
                  style={styles.picker}
                  dropdownIconColor="#3b82f6"
                >
                  <Picker.Item label="Select Asset Type" value="" color="#9ca3af" />
                  <Picker.Item label="Laptop" value="Laptop" color="#1f2937" />
                  <Picker.Item label="Mouse" value="Mouse" color="#1f2937" />
                  <Picker.Item label="Keyboard" value="Keyboard" color="#1f2937" />
                  <Picker.Item label="Other" value="Other" color="#1f2937" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Asset ID <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputContainer, getInputStyle('assetId')]}>
                <Icon name="identifier" size={20} color="#3b82f6" style={styles.icon} />
                <TextInput
                  placeholder="e.g., ASSET-001"
                  placeholderTextColor="#9ca3af"
                  style={styles.input}
                  value={assetId}
                  onChangeText={setAssetId}
                  selectionColor="#3b82f6"
                  cursorColor="#3b82f6"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>
                Purchase Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.inputContainer, getInputStyle('purchaseDate')]}
                onPress={openDatePicker}
              >
                <Icon name="calendar-today" size={20} color="#3b82f6" style={styles.icon} />
                <Text style={[styles.input, { color: purchaseDate ? '#1f2937' : '#9ca3af' }]}>
                  {formatDisplayDate(purchaseDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Description</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, getInputStyle('description')]}>
                <Icon name="file-document-outline" size={20} color="#3b82f6" style={[styles.icon, { marginTop: 12 }]} />
                <TextInput
                  placeholder="Optional description or notes..."
                  placeholderTextColor="#9ca3af"
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  selectionColor="#3b82f6"
                  cursorColor="#3b82f6"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
              onPress={handleCreateAsset}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[styles.buttonText, { marginLeft: 10 }]}>Adding Asset...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Add Asset</Text>
                  <Icon name="check-circle" size={20} color="#fff" style={styles.buttonIcon} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker - Exactly like the example */}
      <DatePicker
        isVisible={showDatePicker}
        mode={'single'}
        onCancel={onCancel}
        onConfirm={onConfirm}
        colorOptions={{
          headerColor: '#3b82f6',
          headerTextColor: '#ffffff',
          changeYearModalColor: '#3b82f6',
          changeYearModalTextColor: '#ffffff',
          selectedDateBackgroundColor: '#3b82f6',
          confirmButtonColor: '#3b82f6',
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
        onConfirmPressed={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
};

export default AssetForm;