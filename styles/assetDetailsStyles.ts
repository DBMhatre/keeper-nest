import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export const createAssetDetailsStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    color: colors.isDark ? '#f87171' : '#ef4444',
    fontWeight: '500',
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginLeft: 35
  },
  formCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  assetsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  assignSection: {
    marginTop: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 50,
    color: colors.text,
  },
  assignButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.isDark ? '#4b5563' : '#9ca3af',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  columnAsset: {
    flex: 2,
  },
  columnId: {
    flex: 1,
  },
  columnAction: {
    flex: 1,
    alignItems: 'center',
  },
  tableBody: {
    maxHeight: 300,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  tableCell: {
    justifyContent: 'center',
  },
  unassignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.isDark ? '#7f1d1d30' : '#fef2f2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.isDark ? '#991b1b' : '#fecaca',
  },
  unassignText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.isDark ? '#f87171' : '#dc2626',
    marginLeft: 4,
  },
  historyContainer: {
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  historyDetails: {
    flex: 1,
  },
  historyAsset: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  dateContainer: {
    marginBottom: 6,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  currentAssignment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.isDark ? '#064e3b20' : '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.isDark ? '#065f46' : '#bbf7d0',
  },
  noAssignment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assignmentText: {
    fontSize: 14,
    color: colors.isDark ? '#34d399' : '#059669',
    marginLeft: 8,
    fontWeight: '500',
  },
  noAssignmentText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  columnName: {
    flex: 2,
  },
  columnEmployee: {
    flex: 1.5,
    paddingRight: 10,
  },
  columnDate: {
    flex: 1.2,
  },
  columnStatus: {
    flex: 1,
    alignItems: 'center',
  },
  employeeName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  employeeId: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 18,
    marginHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  updateButton: {
    backgroundColor: colors.isDark ? '#064e3b20' : '#f0fdf4',
    borderColor: colors.isDark ? '#065f46' : '#a0e4b9ff',
  },
  removeButton: {
    backgroundColor: colors.isDark ? '#7f1d1d30' : '#fef2f2',
    borderColor: colors.isDark ? '#991b1b' : '#fecaca',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  employeeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  employeeItem: {
    alignItems: 'center',
    flex: 1,
  },
  employeeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  employeeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },

  // Asset Card Styles
  assetCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },

  assetIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  assetIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },

  assetInfo: {
    flex: 1,
  },

  assetName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    paddingRight: 10,
  },

  assetId: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 3,
  },

  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  cardBody: {
    padding: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },

  detailColumn: {
    flex: 1,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 20,
  },

  descriptionSection: {
    marginBottom: 6
  },

  descriptionText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 20,
  },

  unassignedText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  assetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  assetType: {
    fontSize: 12.5,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: colors.isDark ? '#1e3a8a30' : '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 7,
    width: 70,
    textAlign: 'center',
  },

  maintenanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.isDark ? '#78350f30' : '#fefce8',
    borderWidth: 0.5,
    borderColor: colors.isDark ? '#fbbf24' : '#f59e0b',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 3,
    marginTop: 10,
  },
    
  maintenanceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.isDark ? '#fbbf24' : '#d97706',
  },
});

export const assetDetailsStyles = createAssetDetailsStyles({
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  primary: '#3b82f6',
  border: '#e5e7eb',
  isDark: false,
});