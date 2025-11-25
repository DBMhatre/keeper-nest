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
import React, { useEffect, useState } from 'react';
import { account, databases } from '../server/appwrite';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Query } from 'appwrite';
import EmptyComponent from './EmptyComponent';
import { useNavigation } from '@react-navigation/native';

export default function EmployeeList() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const fetchEmployees = async () => {
    try {
      try {
        const user = await account.get();
      } catch (error) {
        console.log("Error: ", error);
        navigation.navigate('Login' as never);
      }
      const res = await databases.listDocuments(
        'user_info',
        'user_info',
        [Query.equal('role', 'employee'), Query.equal('status', 'active')]
      );
      setEmployees(res.documents as never);
      setFilteredEmployees(res.documents as never);
    } catch (error) {
      console.log("Error: ", error);
      navigation.navigate('Login' as never);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const text = name.toLowerCase();

    const result = employees.filter((item) => {
      return (
        item.name.toLowerCase().includes(text) ||
        item.email.toLowerCase().includes(text) ||
        item.employeeId.toLowerCase().includes(text)
      );
    });

    setFilteredEmployees(result);
  }, [name, employees]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
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
      {/* ID Card Header with Big Face Icon */}
      <View style={styles.cardHeader}>
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
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>{item.employeeId}</Text>
            </View>
          </View>
          <Text style={styles.employeeRole}>{item.email}</Text>
        </View>
      </View>

      {/* ID Card Body */}
      <View style={styles.cardBody}>
        <View style={styles.detailsGrid}>

          {/* Join Date */}
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

          {/* Created By */}
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
            <Icon name="account-group" size={28} color="#3b82f6" />
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
            value={name}
            onChangeText={setName}
            placeholder="Search employees..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            cursorColor="#3b82f6"
          />
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {loading ? (
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
                refreshing={refreshing}
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
    marginLeft: 34,
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
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  bigIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: -0.3,
    flex: 1,
  },
  idBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  idText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  employeeRole: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 0.5,
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
    width: 90, // Fixed width for labels
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  detailValueContainer: {
    flex: 1,
    marginLeft: 16, // Consistent spacing between label and value
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