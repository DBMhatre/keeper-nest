import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    keyboardAvoid: {
        width: '100%',
        maxHeight: '80%',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 17,
        paddingVertical: 17,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    modalTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 12,
    },
    closeButton: {
        padding: 4,
    },
    modalContent: {
        padding: 20,
        maxHeight: height * 0.4,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    required: {
        color: '#ef4444',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
        padding: 0,
        height: Platform.OS === 'ios' ? 20 : 24,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
        minHeight: 120,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        gap: 12,
    },
    submitButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        gap: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});