import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    color: '#ef4444',
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Header Styles
  header: {
    backgroundColor: "#ffffff",
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
    color: '#1f2937',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 37,
  },

  formCard: {
    backgroundColor: '#ffffff',
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
    borderColor: '#f1f5f9',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetsCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },

  // Employee Profile Container
  employeeProfileContainer: {
    alignItems: 'center',
  },
  
  centeredImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 50, // Space for name/email below (increased for better spacing)
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
    borderColor: '#3b82f6' + '40',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#3b82f6',
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
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
    maxWidth: '90%',
  },
  
  employeeEmail: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: '90%',
  },
  
  employeeDetailsGrid: {
    width: '100%',
    gap: 12,
    marginTop: 30, // Reduced from 70 since name/email is already positioned
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
    color: '#6b7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  
  detailValueContainer: {
    flex: 1,
    marginLeft: 16,
  },
  
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 55,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  
  compactAssignButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
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
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#3b82f6',
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
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 12,
  },
  
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  
  tableContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    maxHeight: 400, 
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  tableBody: {
    maxHeight: 130, 
  },
  
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  assetName: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    lineHeight: 18,
  },
  
  assetType: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  assetId: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  
  unassignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 6,
    alignSelf: 'flex-start',
  },
  
  unassignText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  
  removeButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: '#ef4444',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingContainer: {
    backgroundColor: '#ffffff',
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
  },
  
  loadingMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  loadingSubMessage: {
    fontSize: 14,
    color: '#6b7280',
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 56,
  },
  
  picker: {
    flex: 1,
    color: '#1f2937',
    fontSize: 16,
  },
  
  logoutButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: '#ef4444',
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