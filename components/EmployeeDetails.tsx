import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/employeeDetailsStyles';
import { account, databases, functions } from '../server/appwrite';
import { ID, Query } from 'appwrite';
import AwesomeAlert from 'react-native-awesome-alerts';
import CustomModal from './CustomModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function EmployeeDetails() {
  const route = useRoute();
  const { employeeId } = route.params;
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [selectedAsset, setSelectedAsset] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [modalVisible, setModalVisible] = useState(false);
  const [removingEmployee, setRemovingEmployee] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    confirmText: 'OK',
    showCancel: false,
  });

  const showModal = (title, message, type = 'info', onConfirm = null, confirmText = 'OK', showCancel = false) => {
    setModalConfig({
      title,
      message,
      type,
      onConfirm,
      confirmText,
      showCancel,
    });
    setModalVisible(true);
  };

  const showAlertBox = (title: string, message: string, type: 'success' | 'error') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const { data: employee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: async () => {
      try {
        await account.get();
      } catch (error) {
        navigation.navigate('Login' as never);
        throw error;
      }

      const response = await databases.listDocuments(
        'user_info',
        'user_info',
        [Query.equal('employeeId', employeeId)]
      );
      
      if (response.documents.length === 0) {
        throw new Error('Employee not found');
      }
      
      return response.documents[0];
    },
  });

  const { data: assets = [], isLoading: isLoadingAssets } = useQuery({
    queryKey: ['available-assets'],
    queryFn: async () => {
      try {
        await account.get();
      } catch (error) {
        navigation.navigate('Login' as never);
        throw error;
      }

      const response = await databases.listDocuments(
        'assetManagement',
        'assets',
        [Query.equal('status', 'Available')]
      );
      return response.documents;
    },
  });

  const { 
    data: assignedAssets = [], 
    isLoading: isLoadingAssignedAssets, 
    refetch: refetchAssignedAssets,
    isRefetching: isRefetchingAssignedAssets 
  } = useQuery({
    queryKey: ['assigned-assets', employeeId],
    queryFn: async () => {
      try {
        await account.get();
      } catch (error) {
        navigation.navigate('Login' as never);
        throw error;
      }

      const response = await databases.listDocuments(
        'assetManagement',
        'assets',
        [Query.equal('assignedTo', employeeId)]
      );
      return response.documents;
    },
  });

  const isLoading = isLoadingEmployee || isLoadingAssets || isLoadingAssignedAssets;

  const handleAssignAsset = async () => {
    try {
      setAssigning(true);

      const assetDoc = assets.find(asset => asset.assetId === selectedAsset);
      if (!assetDoc) {
        Alert.alert('Error', 'Selected asset not found');
        return;
      }

      const newHistoryEntry = JSON.stringify({
        historyId: ID.unique(),
        employeeId: employeeId,
        assignDate: new Date().toISOString(),
      });
      
      const currentHistory = assetDoc.historyQueue || [];
      const updatedHistory = [newHistoryEntry, ...currentHistory];
      if (updatedHistory.length > 5) {
        updatedHistory.pop();
      }
      
      await databases.updateDocument(
        'assetManagement',
        'assets',
        assetDoc.$id,
        {
          status: 'Assigned',
          assignedTo: employeeId,
          historyQueue: updatedHistory
        }
      );

      queryClient.invalidateQueries({ queryKey: ['available-assets'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-assets', employeeId] });
      
      showAlertBox('Success', 'Asset assigned successfully', 'success');
      setSelectedAsset('');

    } catch (error) {
      console.error('Error assigning asset:', error);
      Alert.alert('Error', 'Failed to assign asset');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignAsset = async (assetId) => {
    try {
      await databases.updateDocument(
        'assetManagement',
        'assets',
        assetId,
        {
          status: 'Available',
          assignedTo: 'unassigned'
        }
      );

      queryClient.invalidateQueries({ queryKey: ['available-assets'] });
      queryClient.invalidateQueries({ queryKey: ['assigned-assets', employeeId] });
      
      showAlertBox('Success', 'Asset unassigned successfully', 'success');
    } catch (error) {
      console.error('Error unassigning asset:', error);
      showAlertBox('Error', 'Failed to unassign asset', 'error');
    }
  };

  const handleRemoveEmployee = async () => {
    if (assignedAssets.length > 0) {
      return showModal(
        'Cannot Remove Employee',
        `This employee has ${assignedAssets.length} assigned assets. Reassign first.`,
        'warning'
      );
    }

    showModal(
      "Remove Employee",
      `Are you sure you want to delete ${employee.name}?`,
      'error',
      async () => {
        try {
          setRemovingEmployee(true);

          const execution = await functions.createExecution(
            "delete-user",
            JSON.stringify({
              userId: employee.$id,
              documentId: employee.$id
            })
          );

          await databases.deleteDocument('user_info', 'user_info', employee.$id);

          queryClient.invalidateQueries({ queryKey: ['employees'] });
          
          console.log("Execution →", execution);
          showAlertBox("Success", `${employee.name} removed successfully`, "success");
          navigation.goBack();

        } catch (error) {
          console.log("Delete error:", error);
          showModal("Error", "Failed to delete employee.", "error");
        } finally {
          setRemovingEmployee(false);
        }
      },
      "Delete",
      true
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading employee details...</Text>
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Employee not found</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => queryClient.invalidateQueries({ queryKey: ['employee', employeeId] })}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingAssignedAssets}
            onRefresh={refetchAssignedAssets}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Icon name="account-details" size={28} color="#3b82f6" />
              <Text style={styles.headerTitle}>Asset Assignment</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Manage assets and information for {employee.name}
            </Text>
          </View>
        </View>

        {/* Assign Asset Section */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Assign New Asset</Text>

          <View style={styles.assignSection}>
            <View style={styles.pickerContainer}>
              <Icon name="package-variant" size={20} color="#3b82f6" style={styles.icon} />
              <Picker
                selectedValue={selectedAsset}
                onValueChange={(value) => setSelectedAsset(value)}
                style={styles.picker}
                dropdownIconColor="#3b82f6"
              >
                <Picker.Item label="Select Asset to Assign" value="" color="#9ca3af" />
                {assets.map((asset) => (
                  <Picker.Item
                    key={asset.$id}
                    label={`${asset.assetName} (${asset.assetId})`}
                    value={asset.assetId}
                    color="#1f2937"
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={[styles.assignButton, (!selectedAsset || assigning) && styles.buttonDisabled]}
              disabled={!selectedAsset || assigning}
              onPress={handleAssignAsset}
            >
              <View style={styles.buttonContent}>
                {assigning ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.assignButtonText}>Assign Asset</Text>
                    <Icon name="link" size={20} color="#fff" style={styles.buttonIcon} />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Assigned Assets</Text>
            <Text style={styles.assetsCount}>({assignedAssets.length})</Text>
          </View>

          {assignedAssets.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="package-variant" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No assets assigned</Text>
              <Text style={styles.emptySubtext}>Assign assets using the section above</Text>
            </View>
          ) : (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.columnAsset]}>Asset Name</Text>
                <Text style={[styles.tableHeaderText, styles.columnId]}>ID</Text>
                <Text style={[styles.tableHeaderText, styles.columnAction]}>Action</Text>
              </View>

              <ScrollView
                style={styles.tableBody}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {assignedAssets.map((asset) => (
                  <View key={asset.$id} style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.columnAsset]}>
                      <Text style={styles.assetName} numberOfLines={2}>{asset.assetName}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.columnId]}>
                      <Text style={styles.assetId} numberOfLines={1}>{asset.assetId}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.columnAction]}>
                      <TouchableOpacity
                        style={styles.unassignButton}
                        onPress={() => handleUnassignAsset(asset.$id)}
                      >
                        <Icon name="link-off" size={16} color="#ef4444" />
                        <Text style={styles.unassignText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            removingEmployee && styles.buttonDisabled
          ]}
          onPress={handleRemoveEmployee}
          disabled={removingEmployee}
        >
          {removingEmployee ? (
            <>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.logoutText}>Removing Employee...</Text>
            </>
          ) : (
            <>
              <Icon name="account-remove" size={20} color="#fff" />
              <Text style={styles.logoutText}>Remove Employee</Text>
            </>
          )}
        </TouchableOpacity>
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
        confirmButtonStyle={{ paddingHorizontal: 30, paddingVertical: 10, borderRadius: 8, }}
        onConfirmPressed={() => setShowAlert(false)}
      />

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        showCancel={modalConfig.showCancel}
      />

      <Modal
        visible={removingEmployee}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingMessage}>Removing Employee...</Text>
            <Text style={styles.loadingSubMessage}>Please wait while we remove {employee?.name}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}