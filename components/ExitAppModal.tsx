import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ExitAppModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

const ExitAppModal: React.FC<ExitAppModalProps> = ({
    visible,
    onConfirm,
    onCancel,
    title = "Exit App",
    message = "Are you sure you want to exit the application?",
    confirmText = "Exit",
    cancelText = "Cancel"
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>
                                {cancelText}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.buttonText, styles.confirmButtonText]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        width: width * 0.8,
        maxWidth: 320,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: '#fecaca',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 6,
    },
    message: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1.5,
    },
    cancelButton: {
        backgroundColor: '#f8fafc',
        borderColor: '#e5e7eb',
    },
    confirmButton: {
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#6b7280',
    },
    confirmButtonText: {
        color: '#ffffff',
    },
    buttonIcon: {
        marginRight: 6,
    },
});

export default ExitAppModal;