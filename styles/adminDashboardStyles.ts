import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, 
  },
  scrollView: {
    flex: 1,
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
    fontWeight: '500',
  },

  topHeader: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: height * 0.025,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageCircleContainer: {
  width: 50, 
  height: 42,
  borderRadius: 8, 
  justifyContent: 'center',
  alignItems: 'center',
  // backgroundColor: '#f3f4f6',
  borderWidth: 1,
  borderColor: '#3b82f6'
},
  
  circleImage: {
    width: 41, 
    height: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary, 
    marginLeft: 15,
    letterSpacing: 0.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface, // KEEP ORIGINAL
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary, // KEEP ORIGINAL
  },

  welcomeSection: {
    backgroundColor: colors.surface, // CHANGED
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border, 
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary, 
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text, 
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary, 
  },
  welcomeIllustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary, 
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text, 
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary, 
    fontWeight: '600',
  },

overviewContainer: {
  backgroundColor: 'transparent',
  paddingHorizontal: 15,
  marginTop: 25,
},
overviewTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: colors.text, 
  marginBottom: 20,
  textAlign: 'left',
},
statsGrid: {
  backgroundColor: colors.surface, 
  borderRadius: 20,
  padding: 6,
  paddingTop: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 5,
  borderWidth: 1,
  borderColor: colors.border, 
},

mainRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  gap: 8,
},

leftStats: {
  flex: 3,
},
statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 20,
},
statItem: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 11,
},
statIconWrapper: {
  width: 32,
  height: 32,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},
statContent: {
  flex: 1,
},
statNumber: {
  fontSize: 18,
  fontWeight: '800',
  color: colors.text, 
  marginBottom: 2,
},
statLabel: {
  fontSize: 10,
  color: colors.textSecondary, 
  fontWeight: '500',
},

employeeSection: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderLeftWidth: 1,
  borderLeftColor: colors.border, 
  paddingLeft: 4,
},
employeeItem: {
  alignItems: 'center',
},
employeeIconWrapper: {
  width: 42,
  height: 42,
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
},
employeeContent: {
  alignItems: 'center',
},
employeeNumber: {
  fontSize: 21,
  fontWeight: '800',
  color: colors.text, 
  marginBottom: 4,
},
employeeLabel: {
  fontSize: 11,
  color: colors.textSecondary, 
  fontWeight: '600',
  textAlign: 'center',
},

  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionCard: {
    backgroundColor: colors.surface, 
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border, 
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text, 
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary, 
    textAlign: 'center',
    lineHeight: 16,
  },

  // Activity Section
  activityCard: {
    backgroundColor: colors.surface, // CHANGED
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border, 
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border, 
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text, // CHANGED
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary, // CHANGED
  },

  // Logout Button - KEEP ORIGINAL COLORS
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2', // KEEP
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca', // KEEP
  },
  logoutText: {
    color: '#ef4444', // KEEP
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  refreshIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.background, // CHANGED
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border, // CHANGED
  },
  refreshText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary, // CHANGED
    fontWeight: '500',
  },
  mainStatCard: {
    flex: 1,
    backgroundColor: colors.surface, // CHANGED
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border, // CHANGED
  },
  mainStatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainStatIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mainStatText: {
    flex: 1,
  },
  mainStatValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text, // CHANGED
    marginBottom: 4,
  },
  mainStatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary, // CHANGED
  },
  mainStatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '10',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  mainStatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 6,
  },
});

export const styles = createStyles({
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  primary: '#3b82f6',
  border: '#e5e7eb',
});