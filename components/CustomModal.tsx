import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CustomModalProps {
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  showCancelButton?: boolean;
  onConfirmPressed?: () => void;
  onCancelPressed?: () => void;
  alertType?: 'success' | 'warning' | 'error' | 'info';
}

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  title = 'Alert',
  message = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmButtonColor = '#3b82f6',
  showCancelButton = false,
  onConfirmPressed,
  onCancelPressed,
  alertType = 'info'
}) => {
  
  const modalConfig = {
    success: { color: '#10b981', icon: 'check-circle' },
    warning: { color: '#f59e0b', icon: 'alert-circle' },
    error: { color: '#ef4444', icon: 'close-circle' },
    info: { color: '#3b82f6', icon: 'information' }
  };

  const { color, icon } = modalConfig[alertType] || modalConfig.info;

  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header with Icon */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Message */}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          {/* Buttons */}
          <View style={styles.buttons}>
            {showCancelButton && (
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancelPressed}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.confirmBtn, { backgroundColor: confirmButtonColor }]} 
              onPress={onConfirmPressed}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});

export default CustomModal;