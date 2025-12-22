import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { databases } from '../server/appwrite';
import { styles } from '../styles/updateModalStyles';
import CustomModal from './CustomModal';

const { width, height } = Dimensions.get('window');

export default function UpdateModal({ asset, visible, onClose }) {
    const [loading, setLoading] = useState(false);
    const [assetName, setAssetName] = useState('');
    const [assetId, setAssetId] = useState('');
    const [description, setDescription] = useState('');
    
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        if (asset) {
            setAssetName(asset.assetName || '');
            setAssetId(asset.assetId || '');
            setDescription(asset.description || '');
        }
    }, [asset, visible]);

    const showAlertBox = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const handleSubmit = async () => {
        if (!assetName.trim()) {
            showAlertBox('Error', 'Asset name is required', 'error');
            return;
        }

        if (!assetId.trim()) {
            showAlertBox('Error', 'Asset ID is required', 'error');
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                assetName: assetName.trim(),
                assetId: assetId.trim(),
                description: description.trim(),
            };

            await databases.updateDocument(
                'assetManagement',
                'assets',
                asset.$id,
                updateData
            );

            showAlertBox('Success', 'Asset updated successfully!', 'success');
            
            setTimeout(() => {
                onClose();
                setAssetName('');
                setAssetId('');
                setDescription('');
            }, 1000);
            
        } catch (error: any) {
            console.error('Update Asset Error:', error);
            showAlertBox('Error', error?.message || 'Failed to update asset', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowAlert(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleContainer}>
                                <Icon name="pencil" size={22} color="#3b82f6" />
                                <Text style={styles.modalTitle}>Update Asset</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Icon name="close" size={22} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            style={styles.modalContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>
                                    Asset Name <Text style={styles.required}>*</Text>
                                </Text>
                                <View style={[styles.inputContainer]}>
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

                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>
                                    Asset ID <Text style={styles.required}>*</Text>
                                </Text>
                                <View style={[styles.inputContainer]}>
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
                                <Text style={styles.inputLabel}>Description</Text>
                                <View style={[styles.inputContainer, styles.textAreaContainer]}>
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
                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.buttonDisabled]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <>
                                        <Icon name="check" size={20} color="#ffffff" />
                                        <Text style={styles.submitButtonText}>Update</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
            </SafeAreaView>

            <CustomModal
                show={showAlert}
                title={alertTitle}
                message={alertMessage}
                alertType={alertType}
                confirmText="OK"
                showCancelButton={false}
                onConfirmPressed={handleModalClose}
                onCancelPressed={handleModalClose}
                confirmButtonColor={alertType === 'success' ? '#10b981' :
                    alertType === 'error' ? '#ef4444' :
                    alertType === 'warning' ? '#f59e0b' : '#3b82f6'}
            />
        </Modal>
    );
}