import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

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
  showSuccessTick?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  title = 'Alert',
  message = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmButtonColor = '#10b981', 
  showCancelButton = false,
  onConfirmPressed,
  onCancelPressed,
  showSuccessTick = false, 
}) => {
  
  return (
    <Modal visible={show} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {showSuccessTick && (
            <View style={styles.animationContainer}>
              <LottieView
                source={require('../assets/animations/success-tick.json')}
                autoPlay
                loop={false}
                style={styles.tickAnimation}
                resizeMode="cover"
              />
            </View>
          )}

          <Text style={styles.title}>{title}</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}
          
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
    alignItems: 'center',
  },
  animationContainer: {
    marginBottom: 16,
  },
  tickAnimation: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  confirmBtn: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
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