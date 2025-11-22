import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Dropdown = ({ 
  label = "Select Option",
  value,
  onValueChange,
  options = [],
  style 
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.dropdownWrapper, style]}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(!visible)}
      >
        <View style={styles.selectedValue}>
          {value?.icon && (
            <Icon 
              name={value.icon} 
              size={18} 
              color={value.color || '#3b82f6'} 
              style={styles.valueIcon}
            />
          )}
          <Text style={styles.dropdownButtonText}>
            {value?.label || `Select ${label}`}
          </Text>
        </View>
        <Icon 
          name={visible ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#6b7280" 
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <ScrollView 
              style={styles.dropdownScroll}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    value?.value === option.value && styles.dropdownItemSelected
                  ]}
                  onPress={() => {
                    onValueChange(option);
                    setVisible(false);
                  }}
                >
                  {option.icon && (
                    <Icon 
                      name={option.icon} 
                      size={18} 
                      color={option.color || '#6b7280'} 
                      style={styles.optionIcon}
                    />
                  )}
                  <Text style={[
                    styles.dropdownItemText,
                    value?.value === option.value && styles.dropdownItemTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {value?.value === option.value && (
                    <Icon name="check" size={18} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const TwoDropdowns = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const statusOptions = [
    { label: 'All Status', value: 'all', icon: 'filter-variant', color: '#6b7280' },
    { label: 'Available', value: 'available', icon: 'check-circle', color: '#10b981' },
    { label: 'Assigned', value: 'assigned', icon: 'account-check', color: '#3b82f6' },
    { label: 'Maintenance', value: 'maintenance', icon: 'tools', color: '#f59e0b' },
  ];

  const typeOptions = [
    { label: 'All Types', value: 'all', icon: 'package-variant', color: '#6b7280' },
    { label: 'Laptop', value: 'laptop', icon: 'laptop', color: '#3b82f6' },
    { label: 'Keyboard', value: 'keyboard', icon: 'keyboard', color: '#8b5cf6' },
    { label: 'Mouse', value: 'mouse', icon: 'mouse', color: '#f59e0b' },
    { label: 'Other', value: 'other', icon: 'package-variant', color: '#6b7280' }
  ];

  return (
    <View style={styles.dropcontainer}>
      
      <View style={styles.dropdownsRow}>
        <Dropdown
          label="Status"
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          options={statusOptions}
          style={styles.dropdown}
        />
        
        <Dropdown
          label="Asset Type"
          value={selectedType}
          onValueChange={setSelectedType}
          options={typeOptions}
          style={styles.dropdown}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropcontainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dropdown: {
    flex: 1,
  },
  dropdownWrapper: {
    width: '100%',
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  valueIcon: {
    marginRight: 8,
  },
  dropdownButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownMenu: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxHeight: 300,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  dropdownScroll: {
    borderRadius: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemSelected: {
    backgroundColor: '#eff6ff',
  },
  optionIcon: {
    marginRight: 12,
    width: 20,
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export {    TwoDropdowns, Dropdown  };