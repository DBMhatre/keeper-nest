import React, { useCallback, useEffect, useState } from 'react';
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
} from 'react-native';
import { account, databases } from '../server/appwrite';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStyles } from '../styles/adminDashboardStyles'; 
import { Query } from 'appwrite';
import sticker from '../assets/images/logo_app.png';
import { useTheme } from '../contexts/ThemeContext'; 

export default function AdminDashboard() {
  const { colors, isDark, toggleTheme } = useTheme(); 
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

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );
  const styles = createStyles(colors); 

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
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor='#3b82f6'
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.surface}
            title={refreshing ? "Refreshing..." : "Pull to refresh"}
            titleColor={colors.textSecondary}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
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
            <Text style={styles.userName} numberOfLines={2}>{name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{email}</Text>
          </View>
          <TouchableOpacity
            style={styles.welcomeIllustration}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Icon name="account-circle" size={65} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.overviewContainer}>
          <Text style={[styles.sectionTitle, { paddingBottom: 10 }]}>Overview</Text>

          <View style={styles.statsGrid}>
            <View style={styles.mainRow}>
              <View style={styles.leftStats}>
                <View style={styles.statsRow}>
                  <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('AssetList' as never, { filter: 'all' } as never)} activeOpacity={0.8}>
                    <View style={[styles.statIconWrapper, { backgroundColor: '#3b82f6' }]}>
                      <Icon name="package-variant" size={15} color="#fff" />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{stats.totalAssets}</Text>
                      <Text style={styles.statLabel}>Total</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.statItem} activeOpacity={0.8} onPress={() => navigation.navigate('AssetList' as never, { filter: 'assigned', label: 'Assigned' } as never)}>
                    <View style={[styles.statIconWrapper, isDark ? {backgroundColor: '#d97706'} : {backgroundColor: '#f59e0b'}]}>
                      <Icon name="package-variant-closed" size={15} color="#fff" />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{stats.assignedAssets || 0}</Text>
                      <Text style={styles.statLabel}>Assigned</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                  <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('AssetList' as never, { filter: 'available' } as never)} activeOpacity={0.8}>
                    <View style={[styles.statIconWrapper, { backgroundColor: '#10b981' }]}>
                      <Icon name="check-circle" size={15} color="#fff" />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{stats.availableAssets || 0}</Text>
                      <Text style={styles.statLabel}>Available</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('AssetList' as never, { filter: 'maintainance' } as never)} activeOpacity={0.8}>
                    <View style={[styles.statIconWrapper, { backgroundColor: '#8b5cf6' }]}>
                      <Icon name="wrench" size={15} color="#fff" />
                    </View>
                    <View style={styles.statContent}>
                      <Text style={styles.statNumber}>{stats.maintainanceAssets || 0}</Text>
                      <Text style={styles.statLabel}>Maintenance</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.employeeSection}>
                <TouchableOpacity style={styles.employeeItem} onPress={() => navigation.navigate('EmployeeList' as never)} activeOpacity={0.8}>
                  <View style={[styles.employeeIconWrapper, { backgroundColor: '#ec4899' }]}>
                    <Icon name="account-group" size={22} color="#fff" />
                  </View>
                  <View style={styles.employeeContent}>
                    <Text style={styles.employeeNumber}>{stats.totalEmployees}</Text>
                    <Text style={styles.employeeLabel}>Employees</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

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
              color={isDark ? '#d97706' : '#f59e0b'}
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
      </ScrollView>
    </SafeAreaView>
  );
}