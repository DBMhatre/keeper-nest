import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface EmptyProp{
    name: string
}

export default function EmptyComponent({name}: EmptyProp) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="inbox" size={64} color="#d1d5db" />
      </View>
      <Text style={styles.title}>No {name}s Found</Text>
      <Text style={styles.subtitle}>
        {name === 'Asset' 
          ? 'No assets available in the inventory'
          : `No ${name.toLowerCase()} items found`
        }
      </Text>
      <View style={styles.tipContainer}>
        <Icon name="lightbulb-on-outline" size={16} color="#f59e0b" />
        <Text style={styles.tipText}>
          {name === 'Asset' 
            ? 'Try adding new assets or check your search criteria'
            : 'Try adjusting your search or filters'
          }
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
    gap: 8,
    maxWidth: 300,
  },
  tipText: {
    fontSize: 14,
    color: '#92400e',
    flex: 1,
    lineHeight: 18,
  },
})