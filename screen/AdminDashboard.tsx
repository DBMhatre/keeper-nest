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
  BackHandler,
  Alert,
  StatusBar,
} from 'react-native';
import { account, databases } from '../server/appwrite';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../styles/adminDashboardStyles';
import { Query } from 'appwrite';

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    maintainanceAssets: 0,
  });
  const navigation = useNavigation();
  const route = useRoute();

  const fetchUserAndStats = async () => {
    try {
      const user = await account.get();
      setEmail(user.email);
      setName(user.name);

      const employeesResponse = await databases.listDocuments(
        'user_info',
        'user_info',
        [Query.equal('role', 'employee'), Query.equal('status', 'active')]
      );

      const assetsResponse = await databases.listDocuments(
        'assetManagement',
        'assets'
      );

      const assets = assetsResponse.documents;
      const availableAssets = assets.filter(asset => asset.status === 'Available').length;
      const assignedAssets = assets.filter(asset => asset.status === 'Assigned').length;
      const maintainanceAssets = assets.filter(asset => asset.status === 'Maintainance').length;

      setStats({
        totalEmployees: employeesResponse.total,
        totalAssets: assetsResponse.total,
        availableAssets,
        assignedAssets,
        maintainanceAssets,
      });

    } catch (error) {
      console.log("Error: ", error);
      navigation.navigate('Login' as never);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchUserAndStats();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const QuickAction = ({ title, icon, color, onPress, description }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.actionIconContainer, { backgroundColor: color }]}>
        <Icon name={icon} size={28} color="#fff" />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
    </TouchableOpacity>
  );

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
    
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: "https://drive.google.com/uc?export=view&id=1o1W4NVpNeMEGNnFmxg20799q6e0NI3pG" }}
            style={{ width: 50, height: 50, borderRadius: 8 }}
          />
          <Text style={styles.appTitle}>KeeperNest</Text>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
            progressBackgroundColor="#ffffff"
            title={refreshing ? "Refreshing..." : "Pull to refresh"}
            titleColor="#6b7280"
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName} numberOfLines={2}>{name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{email}</Text>
          </View>
          <TouchableOpacity
            style={styles.welcomeIllustration}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Icon name="account-circle" size={65} color="#3b82f6" />
          </TouchableOpacity>
        </View>
        <View style={styles.overviewContainer}>
          <Text style={[styles.sectionTitle, { paddingBottom: 10 }]}>Overview</Text>

          <View style={styles.statsGrid}>
            <View style={styles.mainRow}>
              {/* Left Side - 2x2 Grid */}
              <View style={styles.leftStats}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, { backgroundColor: '#3b82f6' }]}>
                      <Icon name="package-variant" size={15} color="#fff" />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{stats.totalAssets}</Text>
                      <Text style={styles.statLabel}>Total</Text>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, { backgroundColor: '#f59e0b' }]}>
                      <Icon name="package-variant-closed" size={15} color="#fff" />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{stats.assignedAssets || 0}</Text>
                      <Text style={styles.statLabel}>Assigned</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, { backgroundColor: '#10b981' }]}>
                      <Icon name="check-circle" size={15} color="#fff" />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{stats.availableAssets || 0}</Text>
                      <Text style={styles.statLabel}>Available</Text>
                    </View>
                  </View>

                  <View style={styles.statItem}>
                    <View style={[styles.statIconWrapper, { backgroundColor: '#8b5cf6' }]}>
                      <Icon name="wrench" size={15} color="#fff" />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{stats.maintainanceAssets || 0}</Text>
                      <Text style={styles.statLabel}>Maintenance</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Right Side - Employees spanning 2 rows */}
              <View style={styles.employeeSection}>
                <View style={styles.employeeItem}>
                  <View style={[styles.employeeIconWrapper, { backgroundColor: '#ec4899' }]}>
                    <Icon name="account-group" size={22} color="#fff" />
                  </View>
                  <View style={styles.employeeContent}>
                    <Text style={styles.employeeNumber}>{stats.totalEmployees}</Text>
                    <Text style={styles.employeeLabel}>Employees</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>


        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              title="Add Employee"
              icon="account-plus"
              color="#3b82f6"
              description="Create new employee account"
              onPress={() => navigation.navigate('EmployeeCreate' as never)}
            />
            <QuickAction
              title="Add Asset"
              icon="plus-circle"
              color="#10b981"
              description="Register new company asset"
              onPress={() => navigation.navigate('AssetForm' as never)}
            />
            <QuickAction
              title="View Assets"
              icon="format-list-bulleted"
              color="#f59e0b"
              description="Browse all assets"
              onPress={() => navigation.navigate('AssetList' as never)}
            />
            <QuickAction
              title="Employees"
              icon="account-group"
              color="#8b5cf6"
              description="Manage team members"
              onPress={() => navigation.navigate('EmployeeList' as never)}
            />
          </View>
        </View>

        {refreshing && (
          <View style={styles.refreshIndicator}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.refreshText}>Updating dashboard...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}