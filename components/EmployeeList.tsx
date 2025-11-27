import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  RefreshControl,
} from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { account, databases } from '../server/appwrite';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Query } from 'appwrite';
import EmptyComponent from './EmptyComponent';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

export default function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchEmployees = useCallback(async () => {
    try {
      await account.get(); 
      const res = await databases.listDocuments(
        'user_info',
        'user_info',
        [Query.equal('role', 'employee'), Query.equal('status', 'active')]
      );
      return res.documents;
    } catch (error) {
      console.log("Error: ", error);
      navigation.navigate('Login' as never);
      throw error;
    }
  }, [navigation]); 

  const {
    data: employees = [],
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  // Filter employees based on search query using useMemo
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) {
      return employees;
    }
    
    const query = searchQuery.toLowerCase();
    return employees.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.employeeId?.toLowerCase().includes(query)
      );
    });
  }, [employees, searchQuery]);

  const onRefresh = () => {
    refetch();
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "Male": return "#3b82f6";
      case "Female": return "#ec4899";
      case "Other": return "#8b5cf6";
      default: return "#6b7280";
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "Male": return "face-man";
      case "Female": return "face-woman";
      case "Other": return "face";
      default: return "account";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EmployeeDetails' as never, { employeeId: item.employeeId } as never)}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconWithBadgeContainer}>
          <View style={[
            styles.bigIconContainer,
            {
              backgroundColor: '#ffffff',
              borderColor: "#3b82f6" + "40"
            }
          ]}>
            <Icon
              name={getGenderIcon(item.gender)}
              size={36}
              color="#3b82f6"
            />
          </View>
          
          <View style={styles.idBadge}>
            <Text style={styles.idText}>
              BBL-123456
            </Text>
          </View>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.employeeName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.employeeEmail} numberOfLines={2}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Icon name="calendar-month-outline" size={14} color="#6b7280" />
              <Text style={styles.detailLabel}>Joined</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>
                {new Date(item.$createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Icon name="account-plus-outline" size={14} color="#6b7280" />
              <Text style={styles.detailLabel}>Created By</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue} numberOfLines={1}>
                {item.creatorMail || 'BBL-1234'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Icon name="account-group" size={30} color="#3b82f6" />
            <Text style={styles.headerTitle}>Employee Directory</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Manage and view employee information
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search employees..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            cursorColor="#3b82f6"
          />
        </View>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading employees...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEmployees}
            keyExtractor={(item) => item.$id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={onRefresh}
                colors={['#3b82f6']}
                tintColor="#3b82f6"
              />
            }
            ListEmptyComponent={<EmptyComponent name='Employee' />}
          />
        )}
      </View>
    </View>
  );
}

// Styles remain exactly the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginLeft: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 43,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingTop: 1,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconWithBadgeContainer: {
    position: 'relative',
    marginRight: 16,
  },
  bigIconContainer: {
    width: 75,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  idBadge: {
    position: 'absolute',
    bottom: -7,
    left: '40%',
    transform: [{ translateX: -30 }],
    backgroundColor: '#3b82f6',
    paddingHorizontal: 2,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 75,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  idText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  employeeEmail: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardBody: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#f8fafc',
  },
  detailsGrid: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  detailValueContainer: {
    flex: 1,
    marginLeft: 16,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'left',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});