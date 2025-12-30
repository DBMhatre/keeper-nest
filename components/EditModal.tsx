import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../contexts/ThemeContext';
import CustomDropdown from './CustomDropdown';
import SystemNavigationBar from 'react-native-system-navigation-bar';

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { name: string; gender: string; }) => void;
  currentData: { name: string; gender: string; };
}

export default function EditModal({
  visible,
  onClose,
  onSave,
  currentData,
}: EditModalProps) {
  const { colors, isDark } = useTheme();
  const styles = createEditModalStyles({ ...colors, isDark });

  const [name, setName] = useState(currentData.name);
  const [gender, setGender] = useState(currentData.gender);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setName(currentData.name);
    setGender(currentData.gender);
  }, [currentData]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave({ name, gender });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            cursorColor="#007bff"
          />
          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <CustomDropdown
                data={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                selectedValue={gender}
                onValueChange={(value) => setGender(value)}
                placeholder="Select Gender"
                searchable={false}
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.saveButton, loading && styles.disabledButton]} onPress={handleSave} disabled={loading}>
            <Icon name="content-save" size={20} color="#fff" />
            <Text style={styles.saveText}>{loading ? 'Updating Changes...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export const createEditModalStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    width: '85%',
    borderRadius: 15,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 6,
  },
  pickerContainer: {
    marginVertical: 8,
  },
  pickerLabel: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 5,
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  picker: {
    color: colors.text,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: colors.textSecondary,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: colors.isDark ? '#f87171' : '#ef4444',
    marginTop: 2,
    marginLeft: 4,
  },
});

export const editModalStyles = createEditModalStyles({
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  primary: '#3b82f6',
  border: '#e5e7eb',
  isDark: false,
});
