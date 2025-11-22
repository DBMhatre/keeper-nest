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
} from 'react-native';
import { account, databases } from '../server/appwrite';
import { useNavigation } from '@react-navigation/native';
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
      console.log('No active session found');
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

  const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <Icon name={icon} size={15} color="#fff" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const QuickAction = ({ title, icon, color, onPress, description }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
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
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Image 
            source={{uri: "https://drive.google.com/uc?export=view&id=1o1W4NVpNeMEGNnFmxg20799q6e0NI3pG"}}
            style={{width: 50, height: 50, borderRadius: 8}}
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
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
          <TouchableOpacity
            style={styles.welcomeIllustration}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Icon name="account-circle" size={70} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>

            <StatCard
              title="Total Assets"
              value={stats.totalAssets}
              icon="package-variant"
              color="#3b82f6"
            />
            <StatCard
              title="Available Assets"
              value={stats.availableAssets || 0}
              icon="check-circle"
              color="#10b981"
            />
            <StatCard
              title="Assigned Assets"
              value={stats.assignedAssets || 0}
              icon="package-variant-closed"
              color="#f59e0b"
            />
            <StatCard
              title="Maintenance"
              value={stats.maintainanceAssets || 0}
              icon="wrench"
              color="#8b5cf6"
            />
          </View>
          <View style={styles.mainStatCard}>
            <View style={styles.mainStatContent}>
              <View style={[styles.mainStatIconContainer, { backgroundColor: '#3b82f6' + '20' }]}>
                <Icon name="account-group" size={32} color="#3b82f6" />
              </View>
              <View style={styles.mainStatText}>
                <Text style={styles.mainStatValue}>{stats.totalEmployees}</Text>
                <Text style={styles.mainStatTitle}>Total Employees</Text>
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