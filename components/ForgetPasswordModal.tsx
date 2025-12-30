import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from './CustomModal';
import { sendMail } from '../server/emailSender';
import { databases } from '../server/appwrite';
import { Query } from 'appwrite';
import { decrypt, encrypt } from '../server/encrypt_decrypt_password';
import { account } from '../server/appwrite'; // Make sure this is imported correctly
import { useTheme } from '../contexts/ThemeContext';

export default function ForgetPasswordModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const [step, setStep] = React.useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'warning' | 'error' | 'info'>('info');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpSent, setOtpSend] = useState(false);
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { colors, isDark, toggleTheme } = useTheme();
    const styles = createForgetStyles({ ...colors, isDark });
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const showAlertMessage = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info') => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const checkEmailExistsInAuth = async (email: string) => {
        try {
            const data = await databases.listDocuments(
                'user_info',
                'user_info',
                [Query.equal('email', email)]
            );
            return data.total > 0;
        } catch (error) {
            console.error('Error checking email in auth:', error);
            return false;
        }
    };

    const otp_generator = () => {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < 6; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    };

    const handleVerifyOTP = () => {
        if (otp.length !== 6) {
            showAlertMessage('Error', 'Please enter 6-digit OTP', 'error');
            return;
        }

        if (otp !== generatedOtp) {
            showAlertMessage('Error', 'Invalid OTP code', 'error');
            return;
        }

        if (timer <= 0) {
            showAlertMessage('Error', 'OTP has expired. Please request a new one.', 'error');
            return;
        }

        showAlertMessage('Success', 'OTP verified successfully!', 'success');
        setStep(3);
    };

    const handleResetPassword = async () => {
        if (newPassword.length < 8) {
            showAlertMessage('Error', 'Password must be at least 8 characters long', 'error');
            return;
        }

        if (confirmPassword !== newPassword) {
            showAlertMessage('Error', 'Passwords do not match', 'error');
            return;
        }

        setLoading(true);

        try {
            const data = await databases.listDocuments('user_info', 'user_info', [Query.equal('email', email)]);

            if (!data || data.documents.length === 0) {
                showAlertMessage('Error', 'User not found', 'error');
                setLoading(false);
                return;
            }

            const userDoc = data.documents[0];
            console.log("Found user:", userDoc.email);

            let session;
            const currentPassword = decrypt(userDoc.password);
            try {
                session = await account.createEmailPasswordSession(email, currentPassword);
                console.log("Session created successfully");
            } catch (sessionError: any) {
                console.log("Session creation failed:", sessionError.message);
                showAlertMessage(
                    'Error',
                    'Cannot reset password. Please contact support.',
                    'error'
                );
                setLoading(false);
                return;
            }

            await account.updatePassword(newPassword, currentPassword);

            const encryptedNewPassword = encrypt(newPassword);
            await databases.updateDocument('user_info', 'user_info', userDoc.$id, {
                password: encryptedNewPassword
            });

            await account.deleteSession(session.$id);

            showAlertMessage("Success", "Password recovery is successful", 'success');

            setTimeout(() => {
                onClose();
                // Reset the form
                setStep(1);
                setEmail('');
                setNewPassword('');
                setConfirmPassword('');
                setOtp('');
                setGeneratedOtp('');
                setOtpSend(false);
                setTimer(0);
            }, 2000);
        } catch (err: any) {
            console.log("Password change error: ", err);
            showAlertMessage('Error', `Password change error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            showAlertMessage('Error', 'Please enter your email address', 'error');
            return;
        }

        const emailExists = await checkEmailExistsInAuth(trimmedEmail);
        if (!emailExists) {
            showAlertMessage('Error', 'No account found with this email address', 'error');
            return;
        }

        setLoading(true);

        const newOtp = otp_generator();
        setGeneratedOtp(newOtp);

        console.log("OTP: ", newOtp);

        try {
            await sendMail({
                to: trimmedEmail,
                subject: `KeeperNest — Password Reset Verification Code`,
                html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f5f7fb 0%, #eef1f9 100%); padding: 40px; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);">
    <div style="background: linear-gradient(135deg, #3b82f6, #60a5fa); color: #fff; padding: 30px 20px;">
      <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.5px;">Password Reset Request</h1>
    </div>

    <div style="padding: 30px 25px; text-align: left;">
      <p style="font-size: 16px; color: #333;">Hi there,</p>
      <p style="color: #555; font-size: 15px; line-height: 1.6;">
        We received a request to reset your KeeperNest account password. 
        Use the verification code below to complete the process.
      </p>

      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #0ea5e9; padding: 25px 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #0369a1; font-size: 14px;">YOUR VERIFICATION CODE</p>
        <div style="background:#ffffff;border:2px dashed #3b82f6;border-radius:8px;padding:15px;display:inline-block;margin:10px 0;">
          <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:10px;color:#000 !important;">
            ${newOtp} <!-- Use the local variable here -->
          </h1>
        </div>
        <p style="font-size:16px;color:#000;">
          <strong>Your OTP code is: ${newOtp}</strong>
        </p>
        <p style="margin: 10px 0 0 0; color: #64748b; font-size: 13px;">
          This code will expire in <strong>10 minutes</strong>
        </p>
      </div>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
          <strong>Important:</strong> 
          <ul style="margin: 8px 0 0 0; padding-left: 20px;">
            <li>Enter this code in the KeeperNest mobile app to verify your identity</li>
            <li>This code is valid for 10 minutes only</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </p>
      </div>

      <p style="color: #444; font-size: 15px; line-height: 1.6;">
        If you're having trouble or didn't request a password reset, please contact our support team immediately.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="color: #333; font-size: 15px;">
        Stay secure,<br>
        <strong>The KeeperNest Security Team</strong>
      </p>
    </div>

    <div style="background: #f9fafb; padding: 15px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">
        This is an automated message. Please do not reply to this email.
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 0;">
        © ${new Date().getFullYear()} KeeperNest. All rights reserved.<br>
        KeeperNest, 123 Security Lane, Digital City
      </p>
    </div>
  </div>
</div>
`,
            });

            setStep(2);
            setOtpSend(true);
            setTimer(600);
            setCanResend(false);
            setOtp('');

            showAlertMessage('Success', `OTP sent to ${trimmedEmail}`, 'success');

        } catch (err) {
            console.log("OTP Send Error:", err);
            showAlertMessage('Error', 'Failed to send OTP. Please try again later.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        const newOtp = otp_generator();
        setGeneratedOtp(newOtp);
        setTimer(600);
        setCanResend(false);
        setOtp('');

        showAlertMessage('Success', 'New OTP generated', 'success');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {step === 1 ? 'Forgot Password' :
                                step === 2 ? 'Enter OTP' :
                                    'Reset Password'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {step === 1 && (
                        <>
                            {/* <View style={styles.stepIndicator}>
                                <View style={[styles.stepDot, styles.activeStep]} />
                                <View style={styles.stepLine} />
                                <View style={styles.stepDot} />
                                <View style={styles.stepLine} />
                                <View style={styles.stepDot} />
                            </View> */}

                            <Text style={styles.modalDescription}>
                                Enter your email address to receive a verification code
                            </Text>

                            <View style={styles.inputContainer}>
                                <Icon name="email-outline" size={22} color="#3b82f6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email address"
                                    placeholderTextColor={colors.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                    cursorColor="#3b82f6"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.primaryButton, (!email || loading) && styles.buttonDisabled]}
                                disabled={!email || loading}
                                onPress={handleSendOTP}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Send OTP</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {/* <View style={styles.stepIndicator}>
                                <View style={[styles.stepDot, styles.completedStep]} />
                                <View style={styles.stepLine} />
                                <View style={[styles.stepDot, styles.activeStep]} />
                                <View style={styles.stepLine} />
                                <View style={styles.stepDot} />
                            </View> */}

                            <Text style={styles.modalDescription}>
                                Enter the 6-digit code sent to {email}
                            </Text>

                            {otpSent && (
                                <View style={styles.timerContainer}>
                                    <Icon name="timer-outline" size={20} color="#f59e0b" />
                                    <Text style={styles.timerText}>
                                        Code expires in {formatTime(timer)}
                                    </Text>
                                </View>
                            )}

                            <TextInput
                                style={styles.otpInput}
                                placeholder="Enter 6-digit OTP"
                                placeholderTextColor={colors.textSecondary}
                                value={otp}
                                onChangeText={setOtp}
                                keyboardType="number-pad"
                                maxLength={6}
                                editable={!loading}
                                textAlign="center"
                                cursorColor="#3b82f6"
                            />

                            <TouchableOpacity
                                style={[styles.primaryButton, (otp.length !== 6 || loading) && styles.buttonDisabled]}
                                disabled={otp.length !== 6 || loading}
                                onPress={handleVerifyOTP}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Verify OTP</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.secondaryButton, (!canResend || loading) && styles.buttonDisabled]}
                                disabled={!canResend || loading}
                                onPress={handleResendOTP}
                            >
                                <Text style={styles.secondaryButtonText}>
                                    {canResend ? 'Resend OTP' : `Resend OTP in ${formatTime(timer)}`}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.secondaryButton, loading && styles.buttonDisabled]}
                                disabled={loading}
                                onPress={() => setStep(1)}
                            >
                                <Text style={styles.secondaryButtonText}>
                                    Change Email
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            {/* <View style={styles.stepIndicator}>
                                <View style={[styles.stepDot, styles.completedStep]} />
                                <View style={styles.stepLine} />
                                <View style={[styles.stepDot, styles.completedStep]} />
                                <View style={styles.stepLine} />
                                <View style={[styles.stepDot, styles.activeStep]} />
                            </View> */}

                            <Text style={styles.modalDescription}>
                                Create your new password
                            </Text>

                            <View style={styles.inputContainer}>
                                <Icon name="lock-outline" size={22} color="#3b82f6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="New password"
                                    placeholderTextColor={colors.textSecondary}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPassword}
                                    editable={!loading}
                                    cursorColor="#3b82f6"
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <Icon
                                        name={showNewPassword ? "eye-off" : "eye"}
                                        size={22}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Icon name="lock-check" size={22} color="#3b82f6" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={colors.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    editable={!loading}
                                    cursorColor="#3b82f6"
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Icon
                                        name={showConfirmPassword ? "eye-off" : "eye"}
                                        size={22}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                                onPress={handleResetPassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Reset Password</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Footer */}
                    <View style={styles.modalFooter}>
                        <Text style={styles.footerText}>
                            Remember your password?{' '}
                            <Text style={styles.footerLink} onPress={onClose}>
                                Sign In
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
            <CustomModal
                show={showAlert}
                title={alertTitle}
                message={alertMessage}
                alertType={alertType}
                confirmText="Okay"
                showCancelButton={false}
                onConfirmPressed={() => setShowAlert(false)}
                onCancelPressed={() => setShowAlert(false)}
                confirmButtonColor={alertType === 'success' ? '#10b981' :
                    alertType === 'error' ? '#ef4444' :
                        alertType === 'warning' ? '#f59e0b' : '#3b82f6'}
            />
        </Modal>
    );
};

const createForgetStyles = (colors: any) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: colors.isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: colors.isDark ? 0.3 : 0.15,
        shadowRadius: 10,
        borderWidth: colors.isDark ? 1 : 0,
        borderColor: colors.isDark ? colors.border : 'transparent',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        letterSpacing: 0.3,
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
        marginTop: 8,
    },
    stepDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colors.isDark ? colors.textSecondary + '40' : colors.border,
    },
    activeStep: {
        backgroundColor: colors.primary,
        transform: [{ scale: 1.3 }],
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    completedStep: {
        backgroundColor: colors.isDark ? '#059669' : '#10b981',
        transform: [{ scale: 1.1 }],
    },
    stepLine: {
        width: 48,
        height: 3,
        backgroundColor: colors.isDark ? colors.textSecondary + '30' : colors.border,
        borderRadius: 1.5,
    },
    modalDescription: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
        paddingHorizontal: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.isDark ? colors.textSecondary + '40' : colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
        height: 56,
        backgroundColor: colors.isDark ? colors.surface + '80' : '#ffffff',
    },
    inputIcon: {
        marginRight: 14,
        color: colors.primary,
        fontSize: 22,
    },
    eyeButton: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
        paddingVertical: 4,
    },
    otpInput: {
        borderWidth: 1.5,
        borderColor: colors.isDark ? colors.textSecondary + '40' : colors.border,
        borderRadius: 12,
        padding: 18,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 4,
        color: colors.text,
        backgroundColor: colors.isDark ? colors.surface + '80' : '#ffffff',
        height: 60,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 16,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    secondaryButton: {
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 8,
    },
    secondaryButtonText: {
        color: colors.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: colors.isDark ? '#92400e20' : '#fef3c7',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.isDark ? '#92400e40' : '#f59e0b30',
    },
    timerText: {
        color: colors.isDark ? '#fbbf24' : '#d97706',
        fontSize: 15,
        marginLeft: 10,
        fontWeight: '600',
    },
    modalFooter: {
        marginTop: 28,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    footerLink: {
        color: colors.primary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});
export const forgetPasswordStyles = createForgetStyles({
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    primary: '#3b82f6',
    border: '#e5e7eb',
    isDark: false,
});