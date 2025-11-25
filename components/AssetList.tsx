import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    RefreshControl
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { databases } from '../server/appwrite';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Query } from 'appwrite';
import EmptyComponent from './EmptyComponent';
import { useNavigation } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown, TwoDropdowns } from './Dropdown';
import CustomModal from './CustomModal';

export default function AssetList() {
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [name, setName] = useState('');
    const [filteredAsset, setFilteredAsset] = useState([]);
    const navigation = useNavigation();
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error'>('success')
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
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


    const statusOptions = [
        { label: 'All Status', value: 'all', icon: 'filter-variant', color: '#6b7280' },
        { label: 'Available', value: 'available', icon: 'check-circle', color: '#10b981' },
        { label: 'Assigned', value: 'assigned', icon: 'account-check', color: '#3b82f6' },
        { label: 'Maintenance', value: 'maintenance', icon: 'tools', color: '#f59e0b' },
    ];

    const typeOptions = [
        { label: 'All Types', value: 'all', icon: 'package-variant', color: '#6b7280' },
        { label: 'Laptop', value: 'laptop', icon: 'laptop', color: '#3b82f6' },
        { label: 'Keyboard', value: 'keyboard', icon: 'keyboard', color: '#8b5cf6' },
        { label: 'Mouse', value: 'mouse', icon: 'mouse', color: '#f59e0b' },
        { label: 'Other', value: 'other', icon: 'package-variant', color: '#6b7280' }
    ];

    const fetchAssets = async () => {
        try {
            setLoading(true);

            const res = await databases.listDocuments(
                "assetManagement",
                "assets",
            );

            setAssets(res.documents as never);
            setFilteredAsset(res.documents as never);
        } catch (err) {
            console.log("Error fetching assets:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    useEffect(() => {
        const text = name.toLowerCase();

        const result = assets.filter((item: any) => {
            return (
                item.assetName.toLowerCase().includes(text)
            );
        });

        setFilteredAsset(result);
    }, [name, assets]);

    useEffect(() => {
        let result = [...assets];

        if (selectedType && selectedType.value !== 'all') {
            result = result.filter((item: any) =>
                item.assetType.toLowerCase() === selectedType.value.toLowerCase()
            );
        }

        setFilteredAsset(result);
    }, [selectedType, assets]);

    useEffect(() => {
        let result = [...assets];

        if (selectedStatus && selectedStatus.value !== 'all') {
            result = result.filter((item: any) =>
                item.status.toLowerCase() === selectedStatus.value.toLowerCase()
            );
        }
        if (selectedType && selectedType.value !== 'all') {
            result = result.filter((item: any) =>
                item.assetType.toLowerCase() === selectedType.value.toLowerCase()
            );
        }

        setFilteredAsset(result);
    }, [selectedStatus, assets]);

    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption);
    };

    const handleTypeChange = (selectedOption) => {
        setSelectedType(selectedOption);
    };

    const getAssetIcon = (type: any) => {
        switch (type) {
            case "Laptop": return "laptop";
            case "Keyboard": return "keyboard";
            case "Mouse": return "mouse";
            case "Charger": return "power-plug";
            default: return "package-variant";
        }
    };

    const getAssetColor = (type: any) => {
        switch (type) {
            case "Laptop": return "#3b82f6";
            case "Keyboard": return "#8b5cf6";
            case "Mouse": return "#f59e0b";
            case "Charger": return "#10b981";
            default: return "#6b7280";
        }
    };

    const getStatusColor = (status: any) => {
        switch (status) {
            case "Available": return "#10b981";
            case "Assigned": return "#3b82f6";
            case "Maintenance": return "#f59e0b";
            case "Damaged": return "#ef4444";
            default: return "#6b7280";
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await fetchAssets(); // Your existing fetch function
        } catch (error) {
            console.error('Error refreshing assets:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleRemoveAsset = async (assetId, assetName, currentStatus) => {
        if (currentStatus === 'Assigned') {
            showModal(
                'Cannot Remove Asset',
                'This asset is currently assigned to an employee. Please unassign it first before removal.',
                'warning'
            );
            return;
        }
        showModal(
            "Remove Asset",
            `Are you sure you want to remove "${assetName}"?`,
            'error',
            async () => {
                try {
                    await databases.deleteDocument(
                        'assetManagement',
                        'assets',
                        assetId
                    );
                    showModal('Success', `${assetName} removed successfully`, 'success');
                    fetchAssets();
                } catch (error) {
                    console.error('Error removing asset:', error);
                    showModal('Error', 'Failed to remove asset', 'error');
                }
            },
            'Remove',
            true
        );
    };

    return (
        <ScrollView style={styles.container} refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#3b82f6']}
                tintColor="#3b82f6"
                progressBackgroundColor="#ffffff"
            />
        }>
            {/* Header Section - UNCHANGED */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.titleContainer}>
                        <Icon name="package-variant" size={28} color="#3b82f6" />
                        <Text style={styles.headerTitle}>Asset Inventory</Text>
                    </View>
                    <Text style={styles.headerSubtitle}>
                        Manage and track company assets
                    </Text>
                </View>

                {/* Search Bar - UNCHANGED */}
                <View style={styles.searchContainer}>
                    <Icon name="magnify" size={20} color="#6b7280" style={styles.searchIcon} />
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Search assets by name..."
                        placeholderTextColor="#9ca3af"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            <View style={styles.dropcontainer}>

                <View style={styles.dropdownsRow}>
                    <Dropdown
                        label="Status"
                        value={selectedStatus}
                        onValueChange={handleStatusChange}
                        options={statusOptions}
                        style={styles.dropdown}
                    />

                    <Dropdown
                        label="Asset Type"
                        value={selectedType}
                        onValueChange={handleTypeChange}
                        options={typeOptions}
                        style={styles.dropdown}
                    />
                </View>
            </View>

            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text style={styles.loadingText}>Loading assets...</Text>
                    </View>
                ) : filteredAsset.length === 0 ? (
                    <EmptyComponent name="Asset" />
                ) : (
                    <View style={styles.tableContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                                <View style={styles.tableWrapper}>
                                    {/* Fixed Header */}
                                    <View style={styles.tableHeader}>
                                        <View style={[styles.headerCell, styles.assetCell]}>
                                            <Text style={styles.headerText}>Asset</Text>
                                        </View>
                                        <View style={[styles.headerCell, styles.typeCell]}>
                                            <Text style={styles.headerText}>Type</Text>
                                        </View>
                                        <View style={[styles.headerCell, styles.notesCell]}>
                                            <Text style={styles.headerText}>Description</Text>
                                        </View>
                                        <View style={[styles.headerCell, styles.statusCell]}>
                                            <Text style={styles.headerText}>Status</Text>
                                        </View>
                                        <View style={[styles.headerCell, styles.assignedCell]}>
                                            <Text style={styles.headerText}>Assigned To</Text>
                                        </View>
                                        <View style={[styles.headerCell, styles.dateCell]}>
                                            <Text style={styles.headerText}>Purchase Date</Text>
                                        </View>
                                        <View style={[styles.headerCell, styles.dateCell]}>
                                            <Text style={styles.headerText}>Remove Asset</Text>
                                        </View>
                                    </View>
                                    
                                    {/* Table Body */}
                                    <ScrollView style={styles.tableBody}>
                                        {filteredAsset.map((item) => (
                                            <TouchableOpacity
                                                key={item.$id}
                                                style={styles.tableRow}
                                                onPress={() => navigation.navigate('AssetDetails', { assetId: item.assetId })}
                                            >
                                                <View style={[styles.cell, styles.assetCell]}>
                                                    <View style={styles.assetInfo}>
                                                        <View style={[
                                                            styles.iconContainer,
                                                            { backgroundColor: getAssetColor(item.assetType) + "15" }
                                                        ]}>
                                                            <Icon
                                                                name={getAssetIcon(item.assetType)}
                                                                size={20}
                                                                color={getAssetColor(item.assetType)}
                                                            />
                                                        </View>
                                                        <View style={styles.assetDetails}>
                                                            <Text style={styles.assetName}>{item.assetName}</Text>
                                                            <Text style={styles.assetId}>#{item.assetId}</Text>
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={[styles.cell, styles.typeCell]}>
                                                    <Text style={styles.typeText}>{item.assetType}</Text>
                                                </View>

                                                <View style={[styles.cell, styles.notesCell]}>
                                                    <Text style={styles.notesText} numberOfLines={2}>
                                                        {item.description || "No description"}
                                                    </Text>
                                                </View>

                                                <View style={[styles.cell, styles.statusCell]}>
                                                    <View style={[
                                                        styles.statusBadge,
                                                        { backgroundColor: getStatusColor(item.status) + "15" }
                                                    ]}>
                                                        <View style={[
                                                            styles.statusDot,
                                                            { backgroundColor: getStatusColor(item.status) }
                                                        ]} />
                                                        <Text style={[
                                                            styles.statusText,
                                                            { color: getStatusColor(item.status) }
                                                        ]}>
                                                            {item.status}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={[styles.cell, styles.assignedCell]}>
                                                    <Text style={styles.assignedText}>
                                                        {item.assignedTo === "unassigned" ? "-" : item.assignedTo}
                                                    </Text>
                                                </View>

                                                <View style={[styles.cell, styles.dateCell]}>
                                                    <Text style={styles.dateText}>
                                                        {new Date(item.purchaseDate).toLocaleDateString()}
                                                    </Text>
                                                </View>

                                                <View style={[styles.cell, styles.dateCell]}>
                                                    <TouchableOpacity
                                                        style={styles.unassignButton}
                                                        onPress={() => handleRemoveAsset(item.$id, item.assetName, item.status)}
                                                    >
                                                        <Icon name="link-off" size={16} color="#ef4444" />
                                                        <Text style={styles.unassignText}>Remove</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
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
                    </View>
                )}
            </View>

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


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    headerContent: {
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 10,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 34,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    tableContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 20,
        height: 450
    },
    horizontalScroll: {
        flex: 1,
    },
    tableWrapper: {
        minWidth: 1000,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        minWidth: 1000,
    },
    headerCell: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
        justifyContent: 'center',
        minHeight: 50,
    },
    tableBody: {
        // No flex: 1 here, let content determine height
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        minHeight: 70,
        minWidth: 1000,
    },
    cell: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRightWidth: 1,
        borderRightColor: '#f3f4f6',
        justifyContent: 'center',
        minHeight: 70,
    },
    assetCell: { width: 200 },
    typeCell: { width: 120 },
    statusCell: { width: 140 },
    assignedCell: { width: 180 },
    dateCell: { width: 140 },
    notesCell: { width: 200 },

    assetInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    assetDetails: {
        flex: 1,
    },
    assetName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 2,
    },
    assetId: {
        fontSize: 12,
        color: '#6b7280',
    },
    typeText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    assignedText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    assignedName: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    dateText: {
        fontSize: 13,
        color: '#6b7280',
    },
    notesText: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 18,
    },
    viewButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#f3f4f6',
        alignSelf: 'center',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    paginationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        gap: 6,
    },
    paginationButtonDisabled: {
        backgroundColor: '#f9fafb',
        borderColor: '#f3f4f6',
    },
    paginationButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3b82f6',
    },
    paginationButtonTextDisabled: {
        color: '#9ca3af',
    },
    pageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pageText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    pageNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3b82f6',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '500',
    },
    headerText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#374151',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dropcontainer: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    dropdownsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    dropdown: {
        flex: 1,
    },
    unassignButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        paddingHorizontal: 6,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fecaca',
        gap: 6,
        alignSelf: 'flex-start',
    },
    unassignText: {
        fontSize: 12,
        color: '#ef4444',
        fontWeight: '600',
    },
});