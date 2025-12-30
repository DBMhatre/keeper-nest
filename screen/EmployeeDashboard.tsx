import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Image,
  StatusBar,
  BackHandler,
  Alert,
} from 'react-native';
import { account, databases } from '../server/appwrite';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Query } from 'appwrite';
import sticker from '../assets/images/logo_app.png'
import { useTheme } from '../contexts/ThemeContext';

export default function EmployeeDashboard() {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [assignedAssets, setAssignedAssets] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = require('../styles/employeeDashboardStyles').createDashboardStyles(colors);
  const fetchUserAndAssets = async () => {
    try {
      const user = await account.get();

      const employeeDetails = await databases.getDocument(
        'user_info',
        'user_info',
        user.$id
      );
      setEmployeeDetails(employeeDetails);

      const assignedResponse = await databases.listDocuments(
        'assetManagement',
        'assets',
        [Query.equal('assignedTo', `${user.name} (${user.$id})`)]
      );

      setAssignedAssets(assignedResponse.documents);

    } catch (error) {
      console.log('EmployeeDashboardError: ', error);
      navigation.navigate('Login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndAssets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserAndAssets();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };



  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.background}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.imageCircleContainer}>
              <Image
                source={sticker}
                style={styles.circleImage}
              />
            </View>
            <Text style={styles.appTitle}>KeeperNest</Text>
          </View>
          {/* <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
            <TouchableOpacity onPress={toggleTheme}>
              <Icon
                name={isDark ? 'white-balance-sunny' : 'weather-night'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName} numberOfLines={2}>{employeeDetails?.name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{employeeDetails?.email}</Text>
          </View>
          <TouchableOpacity style={styles.welcomeIllustration} onPress={() => navigation.navigate('Profile' as never)}>
            <Icon name="account-circle" size={65} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Assigned Assets</Text>
            <Text style={styles.assetsCount}>({assignedAssets.length})</Text>
          </View>

          <View style={styles.assetsTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.columnAsset]}>Asset Name</Text>
              <Text style={[styles.tableHeaderText, styles.columnType]}>Type</Text>
              <Text style={[styles.tableHeaderText, styles.columnStatus]}>Status</Text>
            </View>

            <ScrollView style={styles.tableBody}>
              {assignedAssets.length === 0 ? (
                <View style={styles.emptyAssets}>
                  <Text style={styles.emptyAssetsText}>No assets assigned to you</Text>
                  <Text style={styles.emptyAssetsSubtext}>Assets assigned to you will appear here</Text>
                </View>
              ) : (
                assignedAssets.map((asset) => (
                  <TouchableOpacity
                    key={asset.$id}
                    style={styles.tableRow}
                    onPress={() => navigation.navigate('EmployeeAssetDetails' as never, { asset } as never)}
                  >
                    <View style={[styles.tableCell, styles.columnAsset]}>
                      <Text style={styles.assetName} numberOfLines={1}>{asset.assetName}</Text>
                      <Text style={styles.assetId} numberOfLines={1}>#{asset.assetId}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.columnType]}>
                      <Text style={styles.assetType} numberOfLines={1}>{asset.assetType}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.columnStatus]}>
                      <View style={[styles.statusBadge, { backgroundColor: '#10b98115' }]}>
                        <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                        <Text style={[styles.statusText, { color: '#10b981' }]}>
                          Assigned
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}