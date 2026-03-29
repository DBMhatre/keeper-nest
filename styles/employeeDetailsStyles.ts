import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const createEmployeeDetailsStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    color: colors.isDark ? '#f87171' : '#ef4444',
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Header Styles
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
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
    marginLeft: 37,
  },

  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 25,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Employee Profile Container
  employeeProfileContainer: {
    alignItems: 'center',
  },
  
  centeredImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 50,
  },
  
  employeeInfoBottom: {
    position: 'absolute',
    bottom: 105,
    alignItems: 'center',
    width: '100%',
  },
  
  bigIconContainer: {
    width: 105,
    height: 95,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary + '40',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  
  faceImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },
  
  idBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    minWidth: 105,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  
  employeeName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: '90%',
  },
  
  employeeEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: '90%',
  },
  
  employeeDetailsGrid: {
    width: '100%',
    gap: 12,
    marginTop: 30,
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
  },
  
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginLeft: 8,
  },
  
  detailValueContainer: {
    flex: 1,
    marginLeft: 16,
  },
  
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },

  // Compact Assign Section
  compactAssignSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  
  compactPickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 55,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  
  compactAssignButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  icon: {
    marginRight: 12,
  },
  assignButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  
  emptyState: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 12,
  },
  
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  
  tableContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    maxHeight: 400,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  tableBody: {
    maxHeight: 130,
  },
  
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    minHeight: 70,
  },
  
  tableCell: {
    justifyContent: 'center',
  },
  
  // Column widths
  columnAsset: {
    flex: 3,
    paddingRight: 8,
  },
  
  columnType: {
    flex: 2,
    paddingRight: 8,
  },
  
  columnId: {
    flex: 2,
    paddingRight: 8,
  },
  
  columnAction: {
    flex: 2,
  },
  
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  assetName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 18,
  },
  
  assetType: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  assetId: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  
  unassignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.isDark ? '#7f1d1d30' : '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.isDark ? '#991b1b' : '#fecaca',
    gap: 6,
    alignSelf: 'flex-start',
  },
  
  unassignText: {
    fontSize: 12,
    color: colors.isDark ? '#f87171' : '#ef4444',
    fontWeight: '600',
  },
  
  removeButton: {
    backgroundColor: colors.isDark ? '#dc2626' : '#ef4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: colors.isDark ? '#dc2626' : '#ef4444',
    width: '90%',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    alignSelf: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  
  removeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  
  loadingOverlay: {
    flex: 1,
    backgroundColor: colors.isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingContainer: {
    backgroundColor: colors.surface,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 250,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  loadingMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  loadingSubMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Remove duplicate or conflicting styles
  employeeInfo: {
    gap: 16,
  },
  
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  employeeDetails: {
    flex: 1,
  },
  
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    gap: 8,
  },
  
  assignSection: {
    gap: 16,
  },
  
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  
  picker: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  
  logoutButton: {
    backgroundColor: colors.isDark ? '#dc2626' : '#ef4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: colors.isDark ? '#dc2626' : '#ef4444',
    width: '90%',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    alignSelf: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
});

export const employeeDetailsStyles = createEmployeeDetailsStyles({
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  primary: '#3b82f6',
  border: '#e5e7eb',
  isDark: false,
});