import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

// We export a function instead of a constant
export const getStyles = (colors: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background // Dynamic
  },

  // Header Styles
  header: {
    backgroundColor: '#3b82f6', // Dynamic
    paddingTop: height * 0.02,
    paddingBottom: 50,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary, // Dynamic
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff', // Keep white for header text usually
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Profile Card Styles
  profileCard: {
    backgroundColor: colors.surface, // Dynamic
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border, // Dynamic
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary, // Dynamic
  },
  roleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary, // Dynamic
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.surface, // Dynamic
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text, // Dynamic
    marginBottom: 2,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary, // Dynamic
    marginBottom: 2,
    textAlign: 'center',
  },
  employeeId: {
    fontSize: 12,
    color: colors.textSecondary, // Dynamic (9ca3af equivalent)
    marginBottom: 6,
    textAlign: 'center',
    opacity: 0.7
  },

  // Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 10,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.primary, // Dynamic
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary, // Dynamic
  },

  // Information Section
  cardContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text, // Dynamic
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: colors.surface, // Dynamic
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border, // Dynamic
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 40,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.isDark ? '#374151' : '#eff6ff', // Conditional logic inside style
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary, // Dynamic
    marginBottom: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text, // Dynamic
  },
  divider: {
    height: 1,
    backgroundColor: colors.border, // Dynamic
    marginVertical: 2,
  },

  logoutButton: {
    backgroundColor: '#ef4444', // Usually stays red
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 10,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
});