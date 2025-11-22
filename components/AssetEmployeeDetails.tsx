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
import { databases } from '../server/appwrite';
import { ID, Query } from 'appwrite';
import { setSelectedLog } from 'react-native/types_generated/Libraries/LogBox/Data/LogBoxData';
import AwesomeAlert from 'react-native-awesome-alerts';
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
            console.error('Error fetching asset data:', error);
            Alert.alert('Error', 'Failed to load asset details');
        } finally {
            setLoading(false);
        }
    };

    const showAlertBox = (title: string, message: string, type: 'success' | 'error') => {
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

                <View style={styles.employeeContainer}>
                    <View style={styles.employeeItem}>
                        <Text style={styles.employeeLabel}>Assigned Date</Text>
                        <Text style={styles.employeeValue}>{new Date(asset.$updatedAt).toLocaleDateString()}</Text>
                    </View>

                    <View style={styles.employeeItem}>
                        <Text style={styles.employeeLabel}>Expiry Date</Text>
                        <Text style={styles.employeeValue}>{new Date(asset.expiredAt).toLocaleDateString()}</Text>
                    </View>
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