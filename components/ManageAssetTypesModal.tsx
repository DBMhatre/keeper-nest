import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { databases } from '../server/appwrite';
import { ID } from 'appwrite';
import { useTheme } from '../contexts/ThemeContext';
import CustomModal from './CustomModal';

const DATABASE_ID = 'assetManagement';
const COLLECTION_ID = 'asset-type';

interface AssetType {
    $id: string;
    assetType: string;
}

interface ManageAssetTypesModalProps {
    visible: boolean;
    assets: [];
    onClose: () => void;
}

const ManageAssetTypesModal: React.FC<ManageAssetTypesModalProps> = ({ visible, assets, onClose }) => {
    const [newAssetType, setNewAssetType] = useState('');
    const [addingType, setAddingType] = useState(false);
    const [deletingTypeId, setDeletingTypeId] = useState<string | null>(null);

    const { colors } = useTheme();
    const queryClient = useQueryClient();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        confirmText: 'OK',
        showCancel: false,
        onConfirm: () => setModalVisible(false),
        confirmButtonColor: '#3b82f6',
    });

    const showCustomAlert = (
        title: string,
        message: string,
        confirmText = 'OK',
        showCancel = false,
        onConfirm = () => setModalVisible(false),
        confirmButtonColor = '#3b82f6'
    ) => {
        setModalConfig({
            title,
            message,
            confirmText,
            showCancel,
            onConfirm: () => {
                onConfirm();
                setModalVisible(false);
            },
            confirmButtonColor,
        });
        setModalVisible(true);
    };

    const { data: assetTypes = [], isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['asset-types-raw'],
        queryFn: async () => {
            try {
                const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
                console.log('Asset types fetched:', response);
                console.log('Total documents:', response.total);

                response.documents.forEach((doc, index) => {
                    if (!doc.$id) {
                        console.warn(`Document at index ${index} has no $id:`, doc);
                    }
                });

                return response.documents as unknown as AssetType[];
            } catch (error) {
                console.error('Error fetching asset types:', error);
                return [];
            }
        },
        enabled: visible,
    });

    const handleAddType = async () => {
        if (!newAssetType.trim()) {
            showCustomAlert('Error', 'Please enter an asset type name', 'OK', false, () => { }, '#ef4444');
            return;
        }

        const typeExists = assetTypes.some(
            (type: AssetType) => type.assetType.toLowerCase() === newAssetType.trim().toLowerCase()
        );

        if (typeExists) {
            showCustomAlert('Error', 'This asset type already exists', 'OK', false, () => { }, '#ef4444');
            return;
        }

        try {
            setAddingType(true);
            await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                assetType: newAssetType.trim(),
            });
            setNewAssetType('');
            queryClient.invalidateQueries({ queryKey: ['asset-types-raw'] });
            queryClient.invalidateQueries({ queryKey: ['asset-types'] });
        } catch (error) {
            console.error('Error adding asset type:', error);
            showCustomAlert('Error', 'Failed to add asset type', 'OK', false, () => { }, '#ef4444');
        } finally {
            setAddingType(false);
        }
    };

    const handleDeleteType = async (id: string, name: string) => {
        const count = assets.some(prev => (prev as any).assetType === name);
        if (count) {
            showCustomAlert('Error', 'Asset Type currently working!', 'OK', false, () => { }, '#ef4444');
            return;
        }
        showCustomAlert(
            'Delete Asset Type',
            `Are you sure you want to delete "${name}"?`,
            'Delete',
            true,
            async () => {
                try {
                    setDeletingTypeId(id);
                    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
                    queryClient.invalidateQueries({ queryKey: ['asset-types-raw'] });
                    queryClient.invalidateQueries({ queryKey: ['asset-types'] });
                } catch (error) {
                    console.error('Error deleting asset type:', error);
                    showCustomAlert('Error', 'Failed to delete asset type', 'OK', false, () => { }, '#ef4444');
                } finally {
                    setDeletingTypeId(null);
                }
            },
            '#ef4444'
        );
    };

    const renderItem = ({ item, index }: { item: AssetType; index: number }) => (
        <View
            key={item.$id || `type-${index}`}
            style={[styles.typeItem, { borderColor: colors.border }]}
        >
            <Icon name="cube-outline" size={20} color={colors.primary} />
            <Text style={[styles.typeName, { color: colors.text }]}>
                {item.assetType}
            </Text>
            <TouchableOpacity
                onPress={() => handleDeleteType(item.$id, item.assetType)}
                disabled={deletingTypeId === item.$id}
                style={styles.deleteButton}
            >
                {deletingTypeId === item.$id ? (
                    <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                    <Icon name="trash-can-outline" size={20} color="#ef4444" />
                )}
            </TouchableOpacity>
        </View>
    );

    console.log('Asset types to render:', assetTypes);
    console.log('Asset types count:', assetTypes.length);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.surface }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Manage Asset Types
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.addSection}>
                        <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Enter asset type..."
                                placeholderTextColor={colors.textSecondary}
                                value={newAssetType}
                                cursorColor='#3b82f6'
                                onChangeText={setNewAssetType}
                                onSubmitEditing={handleAddType}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.addButton,
                                    { backgroundColor: colors.primary, opacity: newAssetType.trim() ? 1 : 0.6 }
                                ]}
                                onPress={handleAddType}
                                disabled={addingType || !newAssetType.trim()}
                            >
                                {addingType ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.addButtonText}>Add</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.listSection}>
                        <Text style={[styles.listTitle, { color: colors.text }]}>
                            Existing Types ({assetTypes.length})
                        </Text>

                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                                    Loading...
                                </Text>
                            </View>
                        ) : assetTypes.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Icon name="package-variant" size={50} color={colors.textSecondary} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    No asset types found
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={assetTypes}
                                keyExtractor={(item, index) => item.$id || `type-${index}`} // Updated with fallback
                                renderItem={renderItem}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={10}
                                maxToRenderPerBatch={10}
                                windowSize={5}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefetching}
                                        onRefresh={refetch}
                                        colors={[colors.primary]}
                                        tintColor={colors.primary}
                                    />
                                }
                            />
                        )}
                    </View>
                </View>
            </View>

            <CustomModal
                show={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                showCancelButton={modalConfig.showCancel}
                onConfirmPressed={modalConfig.onConfirm}
                onCancelPressed={() => setModalVisible(false)}
                confirmButtonColor={modalConfig.confirmButtonColor}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        height: '80%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    addSection: {
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    addButton: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    listSection: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    listContent: {
        paddingBottom: 20,
    },
    typeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
    },
    typeName: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    deleteButton: {
        padding: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default ManageAssetTypesModal;