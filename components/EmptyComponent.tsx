import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../contexts/ThemeContext';

interface EmptyProp{
    name: string
}

export default function EmptyComponent({name}: EmptyProp) {
  const {colors, isDark } = useTheme();  
  const styles = createEmptyComponentStyles({ ...colors, isDark });
  return (
    <View style={styles.container}>
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

export const createEmptyComponentStyles = (colors) => StyleSheet.create({
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.isDark ? '#78350f30' : '#fffbeb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.isDark ? '#92400e' : '#fef3c7',
    gap: 8,
    maxWidth: 300,
  },
  tipText: {
    fontSize: 14,
    color: colors.isDark ? '#fbbf24' : '#92400e',
    flex: 1,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export const emptyComponentStyles = createEmptyComponentStyles({
  background: '#f8fafc',
  text: '#1f2937',
  textSecondary: '#6b7280',
  primary: '#3b82f6',
  border: '#e5e7eb',
  isDark: false,
});