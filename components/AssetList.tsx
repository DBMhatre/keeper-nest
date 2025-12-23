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
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Dropdown, TwoDropdowns } from './Dropdown';
import CustomModal from './CustomModal';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useTheme } from '../contexts/ThemeContext';
import { createAssetListStyles } from '../styles/assetListStyles';

export default function AssetList() {
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [name, setName] = useState('');
    const [filteredAsset, setFilteredAsset] = useState([]);
    const navigation = useNavigation();
    const route = useRoute(); // Get route object
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

    const { colors, isDark } = useTheme();
    const styles = createAssetListStyles({ ...colors, isDark });

    // Extract params from route
    const { label, filter } = route.params || {};

    // Initialize filter based on route params when component mounts
    useEffect(() => {
        if (filter) {
            if (filter === 'all') {
                setSelectedStatus({ label: 'All Status', value: 'all', icon: 'filter-variant', color: '#6b7280' });
            } else if (filter === 'assigned') {
                setSelectedStatus({
                    label: label || 'Assigned',
                    value: 'assigned',
                    icon: 'account-check',
                    color: '#3b82f6'
                });
            } else if (filter === 'available') {
                setSelectedStatus({
                    label: 'Available',
                    value: 'available',
                    icon: 'check-circle',
                    color: '#10b981'
                });
            } else if (filter === 'maintainance') {
                setSelectedStatus({
                    label: 'Maintenance',
                    value: 'maintainance',
                    icon: 'tools',
                    color: '#f59e0b'
                });
            }
        } else {
            // Default to all status if no filter
            setSelectedStatus({ label: 'All Status', value: 'all', icon: 'filter-variant', color: '#6b7280' });
        }
    }, [filter, label]);

    // Also update when route params change
    useFocusEffect(
        useCallback(() => {
            if (route.params?.filter) {
                const { filter, label } = route.params;
                if (filter === 'all') {
                    setSelectedStatus({ label: 'All Status', value: 'all', icon: 'filter-variant', color: '#6b7280' });
                } else if (filter === 'assigned') {
                    setSelectedStatus({
                        label: label || 'Assigned',
                        value: 'assigned',
                        icon: 'account-check',
                        color: '#3b82f6'
                    });
                } else if (filter === 'available') {
                    setSelectedStatus({
                        label: 'Available',
                        value: 'available',
                        icon: 'check-circle',
                        color: '#10b981'
                    });
                } else if (filter === 'maintainance') {
                    setSelectedStatus({
                        label: 'Maintenance',
                        value: 'maintainance',
                        icon: 'tools',
                        color: '#f59e0b'
                    });
                }
            }
        }, [route.params])
    );

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
                        {filteredAsset.length === 0 ? (
                            <View style={styles.Emptycontainer}>
                                <Text style={styles.Emptymessage}>Assets not found</Text>
                            </View>
                        ) : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={false}
                                        onRefresh={onRefresh}
                                        colors={[colors.primary]}
                                        tintColor={colors.primary}
                                        progressBackgroundColor={colors.background}
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
                        )}
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
                                refreshing={isRefetching}
                                onRefresh={onRefresh}
                                colors={[colors.primary]}
                                tintColor={colors.primary}
                                progressBackgroundColor={colors.background}
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