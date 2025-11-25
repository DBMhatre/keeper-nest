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
import { databases } from '../server/appwrite';
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
      const res = await databases.listDocuments(
        'user_info',
        'user_info',
        [Query.equal('role', 'employee'), Query.equal('status', 'active')]
      );
      setEmployees(res.documents as never);
      setFilteredEmployees(res.documents as never); 
    } catch (err) {
      console.error('Error in fetching employees: ', err);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EmployeeDetails' as never, { employeeId: item.employeeId } as never)}>
      <View style={styles.cardHeader}>
        <View style={styles.employeeInfo}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: getGenderColor(item.gender) + "15" }
          ]}>
            <Icon
              name={item.gender.toLowerCase() == 'male' ? "face-man" : "face-woman"}
              size={34}
              color={getGenderColor(item.gender)}
            />
          </View>
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <Text style={styles.employeeId}>{item.email}</Text>
          </View>
        </View>
        
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailsGrid}>
          {/* Employee ID */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Icon name="identifier" size={16} color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>EMPLOYEE ID</Text>
              <Text style={styles.detailValue}>{item.employeeId}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Icon name="gender-male-female" size={16} color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>GENDER</Text>
              <Text style={styles.detailValue}>{item.gender}</Text>
            </View>
          </View>

          {/* Joined Date */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Icon name="calendar-outline" size={16} color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>JOINED DATE</Text>
              <Text style={styles.detailValue}>
                {new Date(item.$createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Created By */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Icon name="account-check-outline" size={16} color="#6b7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>CREATED BY</Text>
              <Text style={styles.detailValue}>{item.creatorMail}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
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
    paddingTop: 4.5,
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
    fontSize: 16,
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
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  employeeId: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '48%',
    gap: 8,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    lineHeight: 18,
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