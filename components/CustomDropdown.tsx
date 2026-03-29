import React, { useState, useRef, useEffect } from 'react';
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
import { useTheme } from '../contexts/ThemeContext';
import SystemNavigationBar from 'react-native-system-navigation-bar';

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
  onClickButton?: () => void;
  onRefresh?: () => Promise<void> | void;
  buttonIcon?: string; // Optional: icon for the button
  buttonText?: string; // Optional: text for the button
  buttonType?: 'icon' | 'text' | 'both'; // Type of button to show
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
  onClickButton,
  buttonIcon = 'plus',
  buttonText = 'Add',
  buttonType = 'both',
}: CustomDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const dropdownRef = useRef<TouchableOpacity>(null);

  const { colors, isDark } = useTheme();
  const styles = createDropdownStyles({ ...colors, isDark });

  useEffect(() => {
    if (isDark) {
      SystemNavigationBar.setNavigationColor(colors.background, 'dark');
    } else {
      SystemNavigationBar.setNavigationColor('#FFFFFF', 'light');
    }
  }, [isDark, colors.background]);

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

  const handleButtonClick = () => {
    if (onClickButton) {
      onClickButton();
      setModalVisible(false);
      setSearchText('');
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

              <View style={styles.headerRight}>
                {/* Optional refresh button */}
                {onRefresh && (
                  <TouchableOpacity
                    onPress={handleRefresh}
                    style={styles.refreshButton}
                    disabled={refreshing}
                  >
                    <Icon
                      name="refresh"
                      size={22}
                      color={refreshing ? colors.primary : colors.textSecondary}
                      style={refreshing && styles.refreshingIcon}
                    />
                  </TouchableOpacity>
                )}

                {/* Action button
                {onClickButton && (
                  <TouchableOpacity
                    onPress={handleButtonClick}
                    style={styles.actionButton}
                  >
                    {(buttonType === 'icon' || buttonType === 'both') && (
                      <Icon name={buttonIcon} size={22} color={colors.primary} />
                    )}
                    {(buttonType === 'text' || buttonType === 'both') && (
                      <Text style={styles.actionButtonText}>{buttonText}</Text>
                    )}
                  </TouchableOpacity>
                )} */}

                {/* Close button */}
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
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Icon name="magnify" size={20} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor={colors.textSecondary}
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
                {/* <Icon name="folder-search-outline" size={48} color={colors.textSecondary} /> */}
                <Text style={styles.emptyText}>No options found</Text>
                <Text style={styles.emptySubtext}>
                  {searchText ? 'Try a different search term' : 'No options available'}
                </Text>

                {/* Show action button in empty state if provided */}
                {onClickButton && (
                  <TouchableOpacity
                    onPress={handleButtonClick}
                    style={styles.emptyStateButton}
                  >
                    <Icon name={buttonIcon} size={20} color="#ffffff" />
                    <Text style={styles.emptyStateButtonText}>
                      {buttonText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
                style={[styles.listContainer, { maxHeight }]}
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
                      colors={[colors.primary]}
                      tintColor={colors.primary}
                      progressBackgroundColor={colors.background}
                    />
                  ) : undefined
                }
                ListFooterComponent={
                  onClickButton ? (
                    <TouchableOpacity
                      onPress={handleButtonClick}
                      style={styles.footerButton}
                    >
                      <Icon name={buttonIcon} size={20} color={colors.primary} />
                      <Text style={styles.footerButtonText}>
                        {buttonText}
                      </Text>
                    </TouchableOpacity>
                  ) : null
                }
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const { width, height } = Dimensions.get('window');

const createDropdownStyles = (colors) => StyleSheet.create({
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 52,
  },
  disabledButton: {
    backgroundColor: colors.surface,
    opacity: 0.6,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  placeholderText: {
    color: colors.textSecondary,
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: height * 0.4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  refreshButton: {
    padding: 6,
    marginRight: 8,
  },
  refreshingIcon: {
    transform: [{ rotate: '45deg' }],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: colors.isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
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
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedItem: {
    backgroundColor: colors.isDark ? '#2d3748' : '#eff6ff',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
  },
  selectedItemText: {
    color: colors.primary,
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
    color: colors.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  footerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export const dropdownStyles = createDropdownStyles({
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  primary: '#3b82f6',
  border: '#e5e7eb',
  isDark: false,
});