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
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { account, databases } from '../server/appwrite';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Query } from 'appwrite';
import EmptyComponent from './EmptyComponent';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Dropdown, TwoDropdowns } from './Dropdown';
import CustomModal from './CustomModal';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

export default function AssetList() {
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [name, setName] = useState('');
    const [filteredAsset, setFilteredAsset] = useState([]);
    const navigation = useNavigation();
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success')
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [input, setInput] = useState('');
    const [fetchCount, setFetchCount] = useState(0);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'warning' | 'info',
        onConfirm: null as (() => void) | null,
        confirmText: 'OK',
        showCancel: false,
    });


    const toggleViewMode = () => {
        setViewMode(prevMode => prevMode === 'table' ? 'grid' : 'table');
    };

    const debouncedSearch = useMemo(
        () => debounce((query: string) => {
            setName(query);
        }, 500),
        []
    );

    const fetchAssets = useCallback(async () => {
        try {
            try {
                const user = await account.get();
            } catch (error) {
                console.log("Error: ", error);
                navigation.navigate('Login' as any);
            }
            const res = await databases.listDocuments(
                "assetManagement",
                "assets",
            );
            setFetchCount(prev => prev + 1);
            console.log(`Fetch count: ${fetchCount + 1} `);
            return res.documents;
        } catch (error) {
            console.log("Error: ", error);
            navigation.navigate('Login' as any);
            throw error;
        }
    }, [navigation]);

    const {
        data: assets = [],
        isLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ['assets'],
        queryFn: fetchAssets,
    });

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

    const statusOptions = [
        { label: 'All Status', value: 'all', icon: 'filter-variant', color: '#6b7280' },
        { label: 'Available', value: 'available', icon: 'check-circle', color: '#10b981' },
        { label: 'Assigned', value: 'assigned', icon: 'account-check', color: '#3b82f6' },
        { label: 'Maintenance', value: 'maintainance', icon: 'tools', color: '#f59e0b' },
    ];

    const typeOptions = [
        { label: 'All Types', value: 'all', icon: 'package-variant', color: '#6b7280' },
        { label: 'Laptop', value: 'laptop', icon: 'laptop', color: '#3b82f6' },
        { label: 'Keyboard', value: 'keyboard', icon: 'keyboard', color: '#8b5cf6' },
        { label: 'Mouse', value: 'mouse', icon: 'mouse', color: '#f59e0b' },
        { label: 'Other', value: 'other', icon: 'package-variant', color: '#6b7280' }
    ];

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    useEffect(() => {
        const text = name.toLowerCase();

        const result = assets.filter((item: any) => {
            return (
                item.assetName?.toLowerCase().includes(text)
            );
        });

        setFilteredAsset(result);
    }, [name, assets]);

    useEffect(() => {
        let result = [...assets];

        if (selectedStatus && selectedStatus.value !== 'all') {
            result = result.filter((item: any) =>
                item.status?.toLowerCase() === selectedStatus.value.toLowerCase()
            );
        }
        if (selectedType && selectedType.value !== 'all') {
            result = result.filter((item: any) =>
                item.assetType?.toLowerCase() === selectedType.value.toLowerCase()
            );
        }

        setFilteredAsset(result);
    }, [selectedStatus, selectedType, assets]);

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
        refetch();
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
                    refetch();
                } catch (error) {
                    console.log('Error removing asset:', error);
                    showModal('Error', 'Failed to remove asset', 'error');
                }
            },
            'Remove',
            true
        );
    };

    const handleSearch = (text: string) => {
        setInput(text);
        debouncedSearch(text);
    }

    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.titleContainer}>
                        <Icon name="package-variant" size={26} color="#3b82f6" />
                        <Text style={styles.headerTitle}>Asset Inventory</Text>
                    </View>
                    <Text style={styles.headerSubtitle}>
                        Manage and track company assets
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    <Icon name="magnify" size={20} color="#6b7280" style={styles.searchIcon} />
                    <TextInput
                        value={input}
                        onChangeText={handleSearch}
                        placeholder="Search assets by name..."
                        placeholderTextColor="#9ca3af"
                        style={styles.searchInput}
                        cursorColor="#3b82f6"
                        selectionColor="#3b82f6"
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
                        label="Type"
                        value={selectedType}
                        onValueChange={handleTypeChange}
                        options={typeOptions}
                        style={styles.dropdown}
                    />

                    <TouchableOpacity
                        style={[
                            styles.viewToggleButton,
                            viewMode === 'grid' && styles.viewToggleButtonActive
                        ]}
                        onPress={toggleViewMode}
                    >
                        <Icon
                            name={viewMode === 'table' ? 'view-grid' : 'table'}
                            size={20}
                            color={viewMode === 'grid' ? '#ffffff' : '#3b82f6'}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text style={styles.loadingText}>Loading assets...</Text>
                    </View>
                ) : viewMode === 'table' ? (
                    <View style={styles.tableContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={false}
                                    onRefresh={onRefresh}
                                    colors={['#3b82f6']}
                                    tintColor="#3b82f6"
                                    progressBackgroundColor="#ffffff"
                                />
                            }
                        >
                            <View style={styles.tableWrapper}>
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
                                                        <Text style={styles.assetName} numberOfLines={2}>{item.assetName}</Text>
                                                        <Text style={styles.assetId} numberOfLines={1}>#{item.assetId}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={[styles.cell, styles.typeCell]}>
                                                <Text style={styles.typeText} numberOfLines={2}>{item.assetType}</Text>
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
                                                        {item.status === 'Maintainance' ? "Maintenance" : item.status}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={[styles.cell, styles.assignedCell]}>
                                                <Text style={styles.assignedText} numberOfLines={1}>
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
                    </View>
                ) : (
                    <ScrollView
                        style={styles.gridContainer}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={onRefresh}
                                colors={['#3b82f6']}
                                tintColor="#3b82f6"
                                progressBackgroundColor="#ffffff"
                            />
                        }
                    >
                        {
                            filteredAsset.length === 0 && (
                                <View style={styles.Emptycontainer}>
                                    <Text style={styles.Emptymessage}>Assets not found</Text>
                                </View>
                            )
                        }
                        <View style={styles.grid}>
                            {filteredAsset.map((item) => (
                                <TouchableOpacity
                                    key={item.$id}
                                    style={styles.gridCard}
                                    onPress={() => navigation.navigate('AssetDetails', { assetId: item.assetId })}
                                    activeOpacity={0.9}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={[
                                            styles.cardIconContainer,
                                            { backgroundColor: getAssetColor(item.assetType) + "15" }
                                        ]}>
                                            <Icon
                                                name={getAssetIcon(item.assetType)}
                                                size={24}
                                                color={getAssetColor(item.assetType)}
                                            />
                                        </View>
                                        <View style={styles.cardTitleContainer}>
                                            <Text style={styles.cardAssetName} numberOfLines={1}>
                                                {item.assetName}
                                            </Text>
                                            <Text style={styles.cardAssetId}>#{item.assetId}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardBody}>
                                        <View style={styles.cardInfoRow}>
                                            <View style={styles.infoContent}>
                                                <Text style={styles.infoLabel}>Asset Type: </Text>
                                                <Text style={styles.cardInfoText}>{item.assetType}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.cardInfoRow}>
                                            <View style={styles.infoContent}>
                                                <Text style={styles.infoLabel}>Assignment: </Text>
                                                <Text style={styles.cardInfoText}>
                                                    {item.assignedTo === "unassigned" ? "Not assigned" : item.assignedTo}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.cardFooter}>
                                        <View style={[
                                            styles.cardStatusBadge,
                                            { backgroundColor: getStatusColor(item.status) + "15" }
                                        ]}>
                                            <View style={[
                                                styles.cardStatusDot,
                                                { backgroundColor: getStatusColor(item.status) }
                                            ]} />
                                            <Text style={[
                                                styles.cardStatusText,
                                                { color: getStatusColor(item.status) }
                                            ]}>
                                                {item.status === 'Maintainance' ? "Maintenance" : item.status}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.cardRemoveButton}
                                            onPress={() => handleRemoveAsset(item.$id, item.assetName, item.status)}
                                        >
                                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon name="link-off" size={16} color="#ef4444" />
                                                <Text style={styles.unassignText}> remove</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>

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
        </View>
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
        marginLeft: 2,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 13,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 41,
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
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
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
        marginBottom: 16,
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
        alignItems: 'center',
    },
    dropdown: {
        flex: 1,
    },
    viewToggleButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#dbeafe',
    },
    viewToggleButtonActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
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

    gridContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
        gap: 12,
    },
    gridCard: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginTop: -6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardTitleContainer: {
        flex: 1,
    },
    cardAssetName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    cardAssetId: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    cardBody: {
        marginBottom: 12,
    },
    cardInfoRow: {
        marginBottom: 10,
    },
    cardInfoText: {
        fontSize: 13,
        color: '#4b5563',
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 12,
    },
    cardStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    cardStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    cardStatusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardRemoveButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    infoIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    infoContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        marginRight: 4,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    typeIcon: {
        marginRight: 6,
    },
    assignedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
    },
    assignedIcon: {
        marginRight: 6,
    },
    dateContainer: {
        backgroundColor: '#f8fafc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    dateText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    descriptionContainer: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    descriptionText: {
        fontSize: 13,
        color: '#4b5563',
        lineHeight: 18,
    },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 8,
        gap: 4,
    },
    moreText: {
        fontSize: 12,
        color: '#3b82f6',
        fontWeight: '600',
    },
    Emptycontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginVertical: 20,
    },
    Emptymessage: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});