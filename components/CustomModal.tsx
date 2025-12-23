import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '../contexts/ThemeContext';

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

  const { colors, isDark } = useTheme();
  const styles = createModalStyles({ ...colors, isDark });
  
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

export const createModalStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});

export const modalStyles = createModalStyles({
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  primary: '#3b82f6',
  border: '#e5e7eb',
  isDark: false,
});

export default CustomModal;