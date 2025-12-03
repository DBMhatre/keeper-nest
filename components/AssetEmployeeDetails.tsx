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
import CustomModal from './CustomModal';

export default function AssetEmployeeDetails() {
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

    useEffect(() => {
        fetchAssetData();
    }, [assetId]);

    const fetchAssetData = async () => {
        setLoading(true);
        try {
            try {
                const user = await account.get();
            } catch (error) {
                console.log("Error: ", error);
                navigation.navigate('Login' as any);
            }
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
        } catch (error) {
            console.log("Error: ", error);
            navigation.navigate('Login' as any);
        } finally {
            setLoading(false);
        }
    };

    const showAlertBox = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
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
                <View>
                    <View>
                        <Text>Issue Date</Text>
                    </View>
                    <View>
                        <Text>{asset.$modifiedAt}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Replace AwesomeAlert with CustomModal */}
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