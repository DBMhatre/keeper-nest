import React, { useState, useCallback } from 'react';
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
import { styles } from '../styles/assetDetailsStyles';
import { account, databases } from '../server/appwrite';
import { ID, Query } from 'appwrite';
import CustomModal from './CustomModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CustomDropdown from './CustomDropdown';

export default function AssetDetails() {
    const route = useRoute();
    const { assetId } = route.params;
    const navigation = useNavigation();
    const queryClient = useQueryClient();

    const [assignedEmployee, setAssignedEmployee] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'warning' | 'info',
        onConfirm: null as (() => void) | null,
        confirmText: 'OK',
        showCancel: false,
    });

    // Show modal function
    const showModal = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', onConfirm: (() => void) | null = null, confirmText: string = 'OK', showCancel: boolean = false) => {
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

    const fetchAssetData = useCallback(async () => {
        try {
            await account.get();
        } catch (error) {
            console.log("Error: ", error);
            navigation.navigate('Login' as any);
            throw error;
        }

        try {
            const assetResponse = await databases.listDocuments(
                'assetManagement',
                'assets',
                [Query.equal('assetId', assetId)]
            );

            if (assetResponse.documents.length === 0) {
                throw new Error('Asset not found');
            }

            return assetResponse.documents[0];
        } catch (error) {
            console.log("Error: ", error);
            throw error;
        }
    }, [assetId, navigation]);

    const {
        data: asset,
        isLoading: isLoadingAsset,
        error: assetError,
        refetch: refetchAsset
    } = useQuery({
        queryKey: ['asset', assetId],
        queryFn: fetchAssetData,
    });

    const fetchEmployees = useCallback(async () => {
        try {
            await account.get();
        } catch (error) {
            console.log("Error: ", error);
            navigation.navigate('Login' as any);
            throw error;
        }

        const employeesResponse = await databases.listDocuments(
            'user_info',
            'user_info',
            [Query.equal('role', 'employee')]
        );

        const availableEmployees = employeesResponse.documents
            .filter(emp => emp.employeeId !== asset?.assignedTo)
            .map(emp => ({
                employeeId: emp.employeeId,
                name: emp.name,
                email: emp.email
            }));

        return availableEmployees;
    }, [asset?.assignedTo, navigation]);

    const {
        data: employees = [],
        isLoading: isLoadingEmployees,
    } = useQuery({
        queryKey: ['employees', asset?.assignedTo],
        queryFn: fetchEmployees,
        enabled: !!asset,
    });

    const assignmentHistory = React.useMemo(() => {
        if (!asset?.historyQueue) return [];

        return asset.historyQueue.map(historyString => {
            try {
                return JSON.parse(historyString);
            } catch (error) {
                console.error('Error parsing history:', error);
                return null;
            }
        }).filter(Boolean);
    }, [asset?.historyQueue]);

    const showAlertBox = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const handleAssignEmployee = async () => {
        if (!asset || !assignedEmployee) return;

        try {
            const newHistoryEntry = JSON.stringify({
                historyId: ID.unique(),
                employeeId: assignedEmployee,
                assignDate: new Date().toISOString(),
            });

            const currentHistory = asset.historyQueue || [];
            const updatedHistory = [newHistoryEntry, ...currentHistory];

            if (updatedHistory.length > 5) {
                updatedHistory.pop();
            }

            await databases.updateDocument(
                'assetManagement',
                'assets',
                asset.$id,
                {
                    status: 'Assigned',
                    assignedTo: assignedEmployee,
                    historyQueue: updatedHistory
                }
            );

            queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            queryClient.invalidateQueries({ queryKey: ['assigned-assets'] });
            queryClient.invalidateQueries({ queryKey: ['available-assets'] });

            showAlertBox('Success', 'Asset assigned successfully', 'success');
            setAssignedEmployee('');
        } catch (error) {
            console.error('Error assigning asset:', error);
            Alert.alert('Error', 'Failed to assign asset');
        }
    };

    const handleMaintenance = async () => {
        if (!asset) return;

        try {
            if (asset.status === 'Assigned') {
                showAlertBox(
                    'Cannot Mark for Maintenance',
                    'This asset is currently assigned to an employee. Please unassign it first before marking for maintenance.',
                    'warning'
                );
                return;
            }

            const newStatus = asset.status === 'Maintainance' ? 'Available' : 'Maintainance';
            const successMessage = asset.status === 'Maintainance'
                ? 'Asset removed from Maintenance'
                : 'Asset marked for maintenance';

            await databases.updateDocument(
                'assetManagement',
                'assets',
                asset.$id,
                { status: newStatus }
            );

            queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
            queryClient.invalidateQueries({ queryKey: ['available-assets'] });

            showAlertBox('Success', successMessage, 'success');
        } catch (error) {
            console.error('Error marking asset for maintenance:', error);
            showAlertBox('Error', 'Failed to update asset status', 'error');
        }
    };

    const handleRemoveAsset = async () => {
        if (!asset) return;

        try {
            if (asset.status === 'Assigned') {
                showAlertBox(
                    'Cannot Remove Asset',
                    'This asset is currently assigned to an employee. Please unassign it first before removal.',
                    'warning'
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

                        queryClient.invalidateQueries({ queryKey: ['assets'] });
                        queryClient.invalidateQueries({ queryKey: ['available-assets'] });

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

    const getAssetIcon = (type: string) => {
        switch (type) {
            case "Laptop": return "laptop";
            case "Keyboard": return "keyboard";
            case "Mouse": return "mouse";
            case "Charger": return "power-plug";
            default: return "package-variant";
        }
    };

    const getAssetColor = (type: string) => {
        switch (type) {
            case "Laptop": return "#3b82f6";
            case "Keyboard": return "#8b5cf6";
            case "Mouse": return "#f59e0b";
            case "Charger": return "#10b981";
            default: return "#6b7280";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Available": return "#10b981";
            case "Assigned": return "#3b82f6";
            case "Maintenance": return "#f59e0b";
            case "Damaged": return "#ef4444";
            default: return "#6b7280";
        }
    };
    const isLoading = isLoadingAsset || isLoadingEmployees;

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading asset details...</Text>
            </View>
        );
    }

    if (assetError || !asset) {
        return (
            <View style={styles.errorContainer}>
                <Icon name="alert-circle" size={48} color="#ef4444" />
                <Text style={styles.errorText}>Asset not found</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => refetchAsset()}
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const AssetDetailsCard = () => (
        <View style={styles.assetCard}>
            <View style={styles.cardHeader}>
                <View style={styles.assetIdentity}>
                    <View style={[
                        styles.assetIconWrapper,
                        { backgroundColor: getAssetColor(asset.assetType) + "20" }
                    ]}>
                        <Icon
                            name={getAssetIcon(asset.assetType)}
                            size={28}
                            color={getAssetColor(asset.assetType)}
                        />
                    </View>
                    <View style={styles.assetInfo}>
                        <Text style={styles.assetName} numberOfLines={2}>{asset.assetName}</Text>
                        <View style={styles.assetMeta}>
                            <Text style={styles.assetId} numberOfLines={1}>#{asset.assetId}</Text>
                            <Text style={styles.assetType} numberOfLines={1}>{asset.assetType}</Text>
                        </View>
                    </View>
                </View>
                <View style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(asset.status) + "20" }
                ]}>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(asset.status) }
                    ]} />
                    <Text style={[
                        styles.statusLabel,
                        { color: getStatusColor(asset.status) }
                    ]}>
                        {asset.status === 'Maintainance' ? "Maintenance" : asset.status}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                    <View style={styles.detailColumn}>
                        <View style={styles.detailItem}>
                            <Icon name="calendar" size={16} color="#6b7280" />
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Purchase Date</Text>
                                <Text style={styles.detailValue}>
                                    {new Date(asset.purchaseDate).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.detailColumn}>
                        <View style={styles.detailItem}>
                            <Icon name="clock-outline" size={16} color="#6b7280" />
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Created Date</Text>
                                <Text style={styles.detailValue}>
                                    {new Date(asset.$createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.detailRow}>
                    <View style={styles.detailColumn}>
                        <View style={styles.detailItem}>
                            <Icon name="account" size={16} color="#6b7280" />
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Assigned To</Text>
                                <Text style={[
                                    styles.detailValue,
                                    asset.assignedTo === "unassigned" && styles.unassignedText
                                ]} numberOfLines={1}>
                                    {asset.assignedTo === "unassigned" ? "Not Assigned" : asset.assignedTo}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Description - Full Width */}
                <View style={styles.descriptionSection}>
                    <View style={styles.detailItem}>
                        <Icon name="text-box-outline" size={16} color="#6b7280" />
                        <View style={styles.detailContent}>
                            <Text style={styles.detailLabel}>Description</Text>
                            <Text style={[styles.descriptionText, asset.description === '' && styles.unassignedText]}>
                                {asset.description || "No description provided"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.titleContainer}>
                            <Icon name="cog" size={26} color="#3b82f6" />
                            <Text style={styles.headerTitle}>Asset Management</Text>
                        </View>
                        <Text style={styles.headerSubtitle}>
                            Manage asset assignments and details
                        </Text>
                    </View>
                </View>

                <AssetDetailsCard />
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Assign to Employee</Text>

                    <View style={styles.assignSection}>
                        <View style={styles.pickerContainer}>
                            <Icon name="account" size={20} color="#3b82f6" style={styles.icon} />
                            <CustomDropdown
                                data={employees.map(employee => ({
                                    label: `${employee.name} (${employee.employeeId})`,
                                    value: employee.employeeId,
                                    ...employee
                                }))}
                                selectedValue={assignedEmployee}
                                onValueChange={(value) => setAssignedEmployee(value)}
                                placeholder="Select Employee"
                                searchable={true}
                                disabled={employees.length === 0}
                                onRefresh={() => queryClient.invalidateQueries({ queryKey: ['employees'] })}
                            />
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
                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableHeaderText, styles.columnEmployee]}>Employee</Text>
                                <Text style={[styles.tableHeaderText, styles.columnDate]}>Assignment Date</Text>
                            </View>

                            <ScrollView
                                style={styles.tableBody}
                                showsVerticalScrollIndicator={true}
                                nestedScrollEnabled={true}
                            >
                                {assignmentHistory.map((record, index) => (
                                    <View key={record.historyId || index} style={styles.tableRow}>
                                        <View style={[styles.tableCell, styles.columnEmployee]}>
                                            <Text style={styles.employeeName} numberOfLines={2}>{record.employeeId}</Text>
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
                        <Icon
                            name={asset.status === 'Maintainance' ? "check-circle" : "wrench"}
                            size={16}
                            color="#f59e0b"
                        />
                        <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>
                            {asset.status === 'Maintainance' ? 'Available' : 'Maintenance'}
                        </Text>
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

            <CustomModal
                show={showAlert}
                title={alertTitle}
                message={alertMessage}
                alertType={alertType}
                confirmText="Got It"
                showCancelButton={false}
                onConfirmPressed={() => setShowAlert(false)}
                onCancelPressed={() => setShowAlert(false)}
                confirmButtonColor={alertType === 'success' ? '#10b981' :
                    alertType === 'error' ? '#ef4444' :
                        alertType === 'warning' ? '#f59e0b' : '#3b82f6'}
            />

            <CustomModal
                show={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                alertType={modalConfig.type}
                confirmText={modalConfig.confirmText}
                showCancelButton={modalConfig.showCancel}
                onConfirmPressed={() => {
                    modalConfig.onConfirm?.();
                    setModalVisible(false);
                }}
                onCancelPressed={() => setModalVisible(false)}
                confirmButtonColor={modalConfig.type === 'success' ? '#10b981' :
                    modalConfig.type === 'error' ? '#ef4444' :
                        modalConfig.type === 'warning' ? '#f59e0b' : '#3b82f6'}
            />
        </SafeAreaView>
    );
}