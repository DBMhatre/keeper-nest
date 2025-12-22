import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { styles } from './assetDetailsStyles'
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';

export default function EmployeeAssetDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { asset } = route.params as { asset: any };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAssetIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'laptop': return 'laptop';
      case 'keyboard': return 'keyboard';
      case 'mouse': return 'mouse';
      default: return 'package-variant';
    }
  };

  const getAssetColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'laptop': return '#3b82f6';
      case 'keyboard': return '#8b5cf6';
      case 'mouse': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const assignmentHistory = React.useMemo(() => {
    if (!asset?.historyQueue) return [];

    return asset.historyQueue.map((historyString: any) => {
      try {
        return JSON.parse(historyString);
      } catch (error) {
        console.error('Error parsing history:', error);
        return null;
      }
    }).filter(Boolean);
  }, [asset?.historyQueue]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>        
        <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Icon name="cog" size={26} color="#3b82f6" />
            <Text style={styles.headerTitle}>Asset Details</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Detailed information about the asset assigned
          </Text>
        </View>
      </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: getAssetColor(asset.assetType) + '15' }]}>
              <Icon
                name={getAssetIcon(asset.assetType)}
                size={28}
                color={getAssetColor(asset.assetType)}
              />
            </View>
            <View style={styles.cardTitleSection}>
              <Text style={styles.assetName} numberOfLines={2}>{asset.assetName}</Text>
              <Text style={styles.assetId}>#{asset.assetId}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsSection}>
            {/* Asset Type */}
            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Icon name="tag-outline" size={18} color="#6b7280" />
                <Text style={styles.detailLabel}>Asset Type</Text>
              </View>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{asset.assetType || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelContainer}>
                <Icon name="calendar-month-outline" size={18} color="#6b7280" />
                <Text style={styles.detailLabel}>Assigned Date</Text>
              </View>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{formatDate(assignmentHistory[0]?.assignDate)}</Text>
              </View>
            </View>

            <View style={styles.descriptionRow}>
              <View style={styles.detailLabelContainer}>
                <Icon name="text-box-outline" size={18} color="#6b7280" />
                <Text style={styles.detailLabel}>Description</Text>
              </View>
              <View style={styles.descriptionValueContainer}>
                <Text style={styles.descriptionValue}>
                  {asset.description || 'No description available'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}