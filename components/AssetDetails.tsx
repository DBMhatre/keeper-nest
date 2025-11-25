import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/assetDetailsStyles';
import { account, databases } from '../server/appwrite';
import { ID, Query } from 'appwrite';
import { setSelectedLog } from 'react-native/types_generated/Libraries/LogBox/Data/LogBoxData';
import AwesomeAlert from 'react-native-awesome-alerts';
import CustomModal from './CustomModal';

export default function AssetDetails() {
    const route = useRoute();
    const { assetId } = route.params;
    const navigation = useNavigation();

    let currentEmployee = null;
    const [asset, setAsset] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [assignedEmployee, setAssignedEmployee] = useState('');
    const [loading, setLoading] = useState(false);
    const [assignmentHistory, setAssignmentHistory] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');

    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info',
        onConfirm: null,
        confirmText: 'OK',
        showCancel: false,
    });

    // Show modal function
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


    useEffect(() => {
        fetchAssetData();
    }, [assetId]);

    const fetchAssetData = async () => {
        setLoading(true);
        try {
            const user = await account.get();
        } catch (error) {
            console.log("Error: ", error);
            navigation.navigate('Login' as never);
        }
        try {
            const assetResponse = await databases.listDocuments(
                'assetManagement',
                'assets',
                [Query.equal('assetId', assetId)]
            );

            let assetData = null;
            if (assetResponse.documents.length > 0) {
                assetData = assetResponse.documents[0];
                setAsset(assetData);
            } else {
                Alert.alert('Error', 'Asset not found');
                return;
            }

            const employeesResponse = await databases.listDocuments(
                'user_info',
                'user_info',
                [Query.equal('role', 'employee')]
            );

            currentEmployee = employeesResponse.documents.filter(emp => emp.employeeId === assetData.assignedTo)[0];
            console.log('Current Employee:', currentEmployee);
            const availableEmployees = employeesResponse.documents
                .filter(emp => emp.employeeId !== assetData.assignedTo)
                .map(emp => ({
                    employeeId: emp.employeeId,
                    name: emp.name,
                    email: emp.email
                }));

            setEmployees(availableEmployees);
            await fetchAssignmentHistory();

        } catch (error) {
            console.log("Error: ", error);
            navigation.navigate('Login' as never);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignmentHistory = async () => {
        const historyResponse = await databases.listDocuments(
            'assetManagement',
            'history',
            [Query.equal('assetId', assetId), Query.orderDesc('assignDate')]
        );
        setAssignmentHistory(historyResponse.documents.slice(0, 5));
        console.log('Assignment History:', historyResponse.documents);
    };

    const showAlertBox = (title: string, message: string, type: 'success' | 'error') => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const handleAssignEmployee = async () => {
        try {
            await databases.updateDocument(
                'assetManagement',
                'assets',
                asset.$id,
                {
                    status: 'Assigned',
                    assignedTo: assignedEmployee
                }
            );

            await databases.createDocument(
                'assetManagement',
                'history',
                ID.unique(),
                {
                    assetId: asset.assetId,
                    employeeId: assignedEmployee,
                    assignDate: new Date().toISOString()
                }
            );

            showAlertBox('Success', 'Asset assigned successfully', 'success');
            setAssignedEmployee('');
            fetchAssetData();
        } catch (error) {
            console.error('Error assigning asset:', error);
            Alert.alert('Error', 'Failed to assign asset');
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading asset details...</Text>
            </View>
        );
    }

    if (!asset) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={48} color="#ef4444" />
                <Text style={styles.errorText}>Asset not found</Text>
            </View>
        );
    }

    const handleMaintenance = async () => {
        try {
            if (asset.status === 'Assigned') {
                showAlertBox(
                    'Cannot Mark for Maintenance',
                    'This asset is currently assigned to an employee. Please unassign it first before marking for maintenance.',
                    'error'
                );
                return;
            }

            if (asset.status === 'Maintainance') {
                showAlertBox(
                    'Already in Maintenance',
                    'This asset is already marked for maintenance.',
                    'error'
                );
                return;
            }

            await databases.updateDocument(
                'assetManagement',
                'assets',
                asset.$id,
                {
                    status: 'Maintainance',
                }
            );

            showAlertBox('Success', 'Asset marked for maintenance', 'success');
            fetchAssetData();
        } catch (error) {
            console.error('Error marking asset for maintenance:', error);
            showAlertBox('Error', 'Failed to update asset status', 'error');
        }
    };

    const handleRemoveAsset = async () => {
        try {
            if (asset.status === 'Assigned') {
                showAlertBox(
                    'Cannot Remove Asset',
                    'This asset is currently assigned to an employee. Please unassign it first before removal.',
                    'error'
                );
                return;
            }

            showModal(
                'Remove Asset',
                `Are you sure you want to remove "${asset.assetName}"? This action cannot be undone.`,
                'error',
                async () => {
                    try {
                        await databases.deleteDocument(
                            'assetManagement',
                            'assets',
                            asset.$id
                        );
                        navigation.goBack();
                    } catch (error) {
                        console.error('Error removing asset:', error);
                        showModal('Error', 'Failed to remove asset', 'error');
                    }
                },
                'Remove',
                true
            );
        } catch (error) {
            console.error('Error in remove process:', error);
            showAlertBox('Error', 'Failed to remove asset', 'error');
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.titleContainer}>
                            <Icon name="cog" size={28} color="#3b82f6" />
                            <Text style={styles.headerTitle}>Asset Management</Text>
                        </View>
                        <Text style={styles.headerSubtitle}>
                            Manage assignments for {asset.assetName}
                        </Text>
                    </View>
                </View>

                {/* Assign Employee Section */}
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Assign to Employee</Text>

                    <View style={styles.assignSection}>
                        <View style={styles.pickerContainer}>
                            <Icon name="account" size={20} color="#3b82f6" style={styles.icon} />
                            <Picker
                                selectedValue={assignedEmployee}
                                onValueChange={(value) => setAssignedEmployee(value)}
                                style={styles.picker}
                                dropdownIconColor="#3b82f6"
                            >
                                <Picker.Item label="Select Employee" value="" color="#9ca3af" style={{fontSize: 14}} />
                                {employees.map((employee) => (
                                    <Picker.Item
                                        key={employee.employeeId}
                                        label={`${employee.name} (${employee.employeeId})`}
                                        value={employee.employeeId}
                                        style={{fontSize: 14}}
                                        color="#1f2937"
                                    />
                                ))}
                            </Picker>
                        </View>

                        <TouchableOpacity
                            style={[styles.assignButton, !assignedEmployee && styles.buttonDisabled]}
                            disabled={!assignedEmployee}
                            onPress={handleAssignEmployee}
                        >
                            <View style={styles.buttonContent}>
                                <Text style={styles.assignButtonText}>Assign Employee</Text>
                                <Icon name="link" size={20} color="#fff" style={styles.buttonIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Assignment History Section */}
                <View style={styles.formCard}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Assignment History</Text>
                        <Text style={styles.assetsCount}>(Last 5)</Text>
                    </View>

                    {assignmentHistory.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Icon name="history" size={32} color="#d1d5db" />
                            <Text style={styles.emptyText}>No assignment history</Text>
                        </View>
                    ) : (
                        <View style={styles.tableContainer}>
                            {/* Table Header */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, styles.columnEmployee]}>Employee</Text>
                                <Text style={[styles.tableHeaderText, styles.columnDate]}>Assignment Date</Text>
                            </View>

                            {/* Scrollable Table Body */}
                            <ScrollView
                                style={styles.tableBody}
                                showsVerticalScrollIndicator={true}
                                nestedScrollEnabled={true}
                            >
                                {assignmentHistory.map((record) => (
                                    <View key={record.$id} style={styles.tableRow}>
                                        <View style={[styles.tableCell, styles.columnEmployee]}>
                                            <Text style={styles.employeeName}>{record.employeeId}</Text>
                                        </View>
                                        <View style={[styles.tableCell, styles.columnDate]}>
                                            <Text style={styles.historyDate}>
                                                {record.assignDate ? new Date(record.assignDate).toLocaleDateString() : 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.maintenanceButton]}
                        onPress={handleMaintenance}
                    >
                        <Icon name="wrench" size={16} color="#f59e0b" />
                        <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>Maintenance</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.removeButton]}
                        onPress={handleRemoveAsset}
                    >
                        <Icon name="trash-can-outline" size={16} color="#ef4444" />
                        <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Remove</Text>
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
        </SafeAreaView>
    );
}