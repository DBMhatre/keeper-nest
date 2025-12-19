import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { account, databases } from '../server/appwrite';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Query } from 'appwrite';
import EmptyComponent from './EmptyComponent';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import MaleImage from '../assets/images/man.png';
import FemaleImage from '../assets/images/woman.png';

export default function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const navigation = useNavigation();
  const [fetchCount, setFetchCount] = useState(0);
  const pageSize = 5;
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
      setPage(1);
    }, 500),
    []
  );

  const fetchEmployees = useCallback(async () => {

    try {
      await account.get();

      const queries = [
        Query.equal('role', 'employee'),
        Query.equal('status', 'active')
      ];

      if (searchQuery.trim()) {
        queries.push(Query.or([
          Query.search('name', searchQuery),
          Query.search('employeeId', searchQuery),
          Query.search('email', searchQuery)
        ]));
        queries.push(Query.limit(100));
      } else {
        queries.push(Query.limit(pageSize));
        queries.push(Query.offset((page - 1) * pageSize));
      }

      const res = await databases.listDocuments(
        'user_info',
        'user_info',
        queries
      );

      const countQueries = [
        Query.equal('role', 'employee'),
        Query.equal('status', 'active')
      ];

      if (searchQuery.trim()) {
        countQueries.push(Query.search('name', searchQuery));
      }

      const countRes = await databases.listDocuments(
        'user_info',
        'user_info',
        countQueries
      );

      setFetchCount(prev => prev + 1);
      console.log(`Fetch count: ${fetchCount + 1} `);
      setTotalEmployees(countRes.total);
      return res.documents;
    } catch (error) {
      console.log("Error: ", error);

      if (error.message?.includes('Search') || error.message?.includes('index')) {
        console.log("Search index not available, using client-side filtering");

        const fallbackQueries = [
          Query.equal('role', 'employee'),
          Query.equal('status', 'active'),
          Query.limit(100)
        ];

        const res = await databases.listDocuments(
          'user_info',
          'user_info',
          fallbackQueries
        );

        setTotalEmployees(res.total);
        return res.documents;
      }

      navigation.navigate('Login' as never);
      throw error;
    }
  }, [navigation, page, searchQuery, pageSize]);

  const {
    data: employees = [],
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['employees', page, searchQuery],
    queryFn: fetchEmployees,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

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

  const totalPages = useMemo(() => {
    if (searchQuery.trim()) {
      const filteredCount = filteredEmployees.length;
      return Math.ceil(filteredCount / pageSize);
    } else {
      return Math.ceil(totalEmployees / pageSize);
    }
  }, [searchQuery, filteredEmployees.length, totalEmployees, pageSize]);

  const onRefresh = () => {
    refetch();
  };

  const handleSearchChange = (text: string) => {
    setInputValue(text);
    debouncedSearch(text);
  };

  // React.useEffect(() => {
  //   return () => {
  //     debouncedSearch.cancel();
  //   };
  // }, [debouncedSearch]);

  const paginatedData = useMemo(() => {
    if (searchQuery.trim()) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return filteredEmployees.slice(start, end);
    } else {
      return employees;
    }
  }, [searchQuery, page, pageSize, filteredEmployees, employees]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EmployeeDetails' as never, { employeeId: item.employeeId, name: item.name } as never)}
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
            <Image
              source={item.gender === 'Female' ? FemaleImage : MaleImage}
              style={styles.faceImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.idBadge}>
            <Text style={styles.idText}>
              {item.employeeId}
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

        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            value={inputValue}
            onChangeText={handleSearchChange}
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
            data={paginatedData}
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
            ListEmptyComponent={
              <EmptyComponent
                name='Employee'
                message={
                  searchQuery.trim()
                    ? `No employees found for "${searchQuery}"`
                    : 'No employees found'
                }
              />
            }
          />
        )}

        {totalPages > 0 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, page === 1 && styles.paginationButtonDisabled]}
              onPress={handlePrevPage}
              disabled={page === 1}
            >
              <Icon name="chevron-left" size={20} color={page === 1 ? "#9ca3af" : "#3b82f6"} />
              <Text style={[styles.paginationButtonText, page === 1 && styles.paginationButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.pageInfo}>
              <Text style={styles.pageText}>Page</Text>
              <Text style={styles.pageNumber}>{page}</Text>
              <Text style={styles.pageText}>of {totalPages}</Text>
            </View>

            <TouchableOpacity
              style={[styles.paginationButton, page === totalPages && styles.paginationButtonDisabled]}
              onPress={handleNextPage}
              disabled={page === totalPages}
            >
              <Text style={[styles.paginationButtonText, page === totalPages && styles.paginationButtonTextDisabled]}>
                Next
              </Text>
              <Icon name="chevron-right" size={20} color={page === totalPages ? "#9ca3af" : "#3b82f6"} />
            </TouchableOpacity>
          </View>
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
    position: 'relative',
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
  searchLoading: {
    marginLeft: 8,
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
    overflow: 'hidden',
  },
  faceImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  paginationButtonDisabled: {
    backgroundColor: '#f9fafb',
    borderColor: '#f3f4f6',
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  paginationButtonTextDisabled: {
    color: '#9ca3af',
  },
  pageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
});