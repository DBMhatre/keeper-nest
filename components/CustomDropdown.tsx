import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DropdownItem {
  label: string;
  value: string;
  [key: string]: any;
}

interface CustomDropdownProps {
  data: DropdownItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  maxHeight?: number;
  onRefresh?: () => Promise<void> | void;
}

export default function CustomDropdown({
  data,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
  searchable = true,
  disabled = false,
  maxHeight = SCREEN_HEIGHT * 0.4,
  onRefresh,
}: CustomDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const dropdownRef = useRef<TouchableOpacity>(null);

  const selectedItem = data.find(item => item.value === selectedValue);
  const filteredData = searchable 
    ? data.filter(item => 
        item.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
    setSearchText('');
  };

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing dropdown:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selectedValue === item.value && styles.selectedItem,
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text
        style={[
          styles.itemText,
          selectedValue === item.value && styles.selectedItemText,
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
      {selectedValue === item.value && (
        <Icon name="check" size={18} color="#3b82f6" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        ref={dropdownRef}
        style={[
          styles.dropdownButton,
          disabled && styles.disabledButton,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedItem && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {selectedItem?.label || placeholder}
        </Text>
        <Icon
          name={modalVisible ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6b7280"
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setSearchText('');
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
            setSearchText('');
          }}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <Text style={styles.modalTitle}>{placeholder}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchText('');
                }}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Icon name="magnify" size={20} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  cursorColor="#3b82f6"
                />
                {searchText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchText('')}
                    style={styles.clearSearchButton}
                  >
                    <Icon name="close-circle" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {filteredData.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No options found</Text>
                <Text style={styles.emptySubtext}>
                  {searchText ? 'Try a different search term' : 'No options available'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                maxHeight={maxHeight}
                initialNumToRender={15}
                windowSize={5}
                getItemLayout={(data, index) => ({
                  length: 50,
                  offset: 50 * index,
                  index,
                })}
                refreshControl={
                  onRefresh ? (
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={handleRefresh}
                      colors={['#3b82f6']}
                      tintColor="#3b82f6"
                    />
                  ) : undefined
                }
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 52,
  },
  disabledButton: {
    backgroundColor: '#ffffff',
    opacity: 0.6,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginRight: 8,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: SCREEN_HEIGHT * 0.4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#f9fafb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  refreshButton: {
    padding: 6,
    marginLeft: 12,
  },
  refreshingIcon: {
    transform: [{ rotate: '45deg' }],
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 4,
  },
  clearSearchButton: {
    padding: 4,
  },
  listContainer: {
    maxHeight: 400,
  },
  listContent: {
    paddingBottom: 16,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  listHeaderText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedItem: {
    backgroundColor: '#eff6ff',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginRight: 12,
  },
  selectedItemText: {
    color: '#1d4ed8',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
});