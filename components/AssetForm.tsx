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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ID, Query } from 'appwrite';
import { account, databases } from '../server/appwrite';
import { getFormStyles } from '../styles/assetFormStyles';
import { Asset } from './asset';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { set } from 'lodash';
import DatePicker from 'react-native-neat-date-picker';
import CustomModal from './CustomModal';
import CustomDropdown from './CustomDropdown';

const DATABASE_ID = 'assetManagement';
const COLLECTION_ID = 'assets';

const AssetForm = () => {
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('');
  const [assetId, setAssetId] = useState('');
  const status = 'Available';
  const [description, setDescription] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [osType, setOsType] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [success, setSuccess] = useState(false); // Added success state
  const [focusedInput, setFocusedInput] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [newTypeModalVisible, setNewTypeModalVisible] = useState(false);
  const [newAssetType, setNewAssetType] = useState('');
  const [addingType, setAddingType] = useState(false);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { colors } = useTheme();
  const styles = getFormStyles(colors);

  const showAlertBox = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
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

  const { data: assetTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ['asset-types'],
    queryFn: async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          'asset-type'
        );
        return response.documents.map(doc => ({
          label: doc.assetType,
          value: doc.assetType,
        }));
      } catch (error) {
        console.error('Error fetching asset types:', error);
        return [];
      }
    }
  });

  const handleCreateAssetType = async () => {
    if (!newAssetType.trim()) return;
    if (assetTypes.some(type => type.value === newAssetType.trim())) {
      showAlertBox('Error', 'Asset type already exists.', 'error');
      return;
    }

    try {
      setAddingType(true);
      await databases.createDocument(
        DATABASE_ID,
        'asset-type',
        ID.unique(),
        { assetType: newAssetType.trim() }
      );
      queryClient.invalidateQueries({ queryKey: ['asset-types'] });
      setNewTypeModalVisible(false);
      setNewAssetType('');
      // showAlertBox('Success', 'Asset type added successfully!', 'success');
    } catch (error: any) {
      console.error('Create Type Error:', error);
      showAlertBox('Error', error?.message || 'Failed to add asset type.', 'error');
    } finally {
      setAddingType(false);
    }
  };

  const handleCreateAsset = async () => {
    try {
      const user = await account.get();
    } catch (error) {
      console.log("Error: ", error);
      navigation.navigate('Login' as any);
      return;
    }
    if (!assetName || !assetType || !assetId || !status || !purchaseDate) {
      return showAlertBox('Missing Fields', 'Please fill all required fields.', 'error');
    }

    if (assetType === 'Laptop' && !osType) {
      return showAlertBox('Missing OS Type', 'Please select an OS type for Laptop.', 'error');
    }

    setLoading(true);

    const existingAssets = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal('assetId', assetId)
      ]
    );

    if (existingAssets.total > 0) {
      setSuccess(false);
      showAlertBox(
        'Duplicate Asset ID',
        `Asset ID "${assetId}" already exists. Please use a different ID.`,
        'error'
      );
      setLoading(false);
      return; // Stop here, don't create the asset
    }

    const currentYear = new Date().getFullYear();
    const expiredAt = new Date(currentYear, 11, 31);

    try {
      const newHistoryEntry = JSON.stringify({
        updation: "Created",
        date: new Date().toISOString(),
      });

      const assetData: Asset = {
        assetName,
        assetType,
        assetId,
        status,
        description,
        purchaseDate: new Date(purchaseDate).toISOString(),
        expiredAt: expiredAt.toISOString(),
        ...(assetType === 'Laptop' && { osType }),
        historyQueue: [newHistoryEntry]
      };

      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        assetData
      );
      setConfirm(true);
      console.log('Asset created:', response);

      setSuccess(true);
      showAlertBox('Success', 'Asset added successfully!', 'success');
    } catch (error: any) {
      console.error('Create Asset Error:', error);
      // Reset success on error
      setSuccess(false);
      showAlertBox('Error', error?.message || 'Failed to add asset.', 'error');
      navigation.navigate('Login' as any);
    } finally {
      setLoading(false);
      // setConfirm(false);
    }
  };

  const handleConfirmClose = () => {
    setAssetName('');
    setAssetType('');
    setAssetId('');
    setDescription('');
    setPurchaseDate('');
    setOsType('');
    setShowAlert(false);
    setSuccess(false);

    navigation.navigate('AssetList' as any);
  }
  // Handle modal close
  const handleModalClose = () => {
    setShowAlert(false);
    setSuccess(false);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
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
          <View style={styles.formCard}>
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
                <CustomDropdown
                  data={assetTypes}
                  selectedValue={assetType}
                  onValueChange={(value) => {
                    setAssetType(value);
                    if (value !== 'Laptop') {
                      setOsType('');
                    }
                  }}
                  placeholder="Select Asset Type"
                  searchable={true}
                  buttonText="Add New Type"
                  buttonIcon="plus"
                  buttonType="both"
                  onClickButton={() => setNewTypeModalVisible(true)}
                  // onRefresh={() => queryClient.invalidateQueries({ queryKey: ['asset-types'] })}
                />
              </View>
            </View>

            {assetType === 'Laptop' && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>
                  OS Type <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.pickerContainer}>
                  <Icon name="laptop" size={20} color="#3b82f6" style={styles.icon} />
                  <CustomDropdown
                    data={[
                      { label: "Windows", value: "Windows" },
                      { label: "Ubuntu", value: "Ubuntu" },
                      { label: "macOS", value: "macOS" },
                    ]}
                    selectedValue={osType}
                    onValueChange={(value) => setOsType(value)}
                    placeholder="Select OS Type"
                    searchable={false}
                  />
                </View>
              </View>
            )}

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
                <Text style={[styles.input, { color: purchaseDate ? colors.text : '#9ca3af' }]}>
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

      <Modal
        visible={newTypeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNewTypeModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 }}>Add New Asset Type</Text>
            <TextInput
              placeholder="e.g., Monitor, UPS"
              placeholderTextColor="#9ca3af"
              style={{
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                color: colors.text,
                marginBottom: 20
              }}
              cursorColor='#3b82f6'
              value={newAssetType}
              onChangeText={setNewAssetType}
              autoFocus
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity
                onPress={() => {
                  setNewTypeModalVisible(false);
                  setNewAssetType('');
                }}
                style={{ paddingHorizontal: 16, paddingVertical: 10 }}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateAssetType}
                disabled={addingType || !newAssetType.trim()}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                  opacity: addingType || !newAssetType.trim() ? 0.6 : 1
                }}
              >
                {addingType ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Add Type</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AssetForm;