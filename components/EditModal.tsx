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
  
  const [name, setName] = useState(currentData.name);
  const [gender, setGender] = useState(currentData.gender);

  useEffect(() => {
    setName(currentData.name);
    setGender(currentData.gender);
  }, [currentData]);

  const handleSave = () => {
    onSave({ name, gender });
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
                dropdownIconColor="#007bff"
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Icon name="content-save" size={20} color="#fff" />
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 15,
    padding: 20,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#007bff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
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
    color: '#555',
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    color: '#333',
  },
});
