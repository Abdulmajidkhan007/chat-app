import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  FirebaseRecaptchaVerifierModal,
  type FirebaseRecaptchaVerifier,
} from 'expo-firebase-recaptcha';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/auth.store';
import { AuthService } from '@/services/auth.service';
import app from '@/config/firebase';

type Props = StackScreenProps<AuthStackParamList, 'OTP'>;

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;

function OTPDigitBox({
  digit,
  isFocused,
  isVerifying,
  theme,
}: {
  digit: string;
  isFocused: boolean;
  isVerifying: boolean;
  theme: ReturnType<typeof useTheme>;
}): React.JSX.Element {
  const styles = StyleSheet.create({
    box: {
      width: 48,
      height: 58,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
    },
    digit: {
      fontSize: 26,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
    },
  });

  const borderColor = isFocused
    ? theme.colors.primary
    : digit
    ? theme.colors.surfaceElevated
    : theme.colors.border;

  const backgroundColor = isVerifying
    ? theme.colors.surfaceElevated
    : digit
    ? theme.colors.surfaceElevated
    : theme.colors.surface;

  return (
    <View style={[styles.box, { borderColor, backgroundColor, opacity: isVerifying ? 0.6 : 1 }]}>
      <Text style={styles.digit}>{digit}</Text>
    </View>
  );
}

const MemoizedOTPDigitBox = React.memo(OTPDigitBox);

export function OTPScreen({ navigation, route }: Props): React.JSX.Element {
  const { phone } = route.params;
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(RESEND_COUNTDOWN);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasVerified = useRef<boolean>(false);
  const resendRecaptchaRef = useRef<FirebaseRecaptchaVerifierModal>(null);

  const shakeX = useSharedValue(0);

  const boxRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  useEffect(() => {
    startCountdown();
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
    // startCountdown is stable via useCallback below — intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(RESEND_COUNTDOWN);
    setIsResendActive(false);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setIsResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage('');
    }, 2500);
  }, []);

  const triggerShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-4, { duration: 60 }),
      withSpring(0, { damping: 10, stiffness: 200 })
    );
  }, [shakeX]);

  const resetBoxes = useCallback(() => {
    setDigits(Array(OTP_LENGTH).fill(''));
    setFocusedIndex(0);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
      hasVerified.current = false;
    }, 100);
  }, []);

  const verifyOTP = useCallback(
    async (code: string) => {
      if (hasVerified.current) return;
      hasVerified.current = true;
      setIsVerifying(true);
      setErrorMessage('');

      const result = await AuthService.verifyOTP(code);

      if (result.success) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setIsVerifying(false);
        setIsSuccess(true);

        await new Promise<void>((resolve) => setTimeout(resolve, 600));

        if (result.isNewUser) {
          navigation.navigate('ProfileSetup', { phone });
        } else {
          // Existing user — load their profile and hydrate the store
          const profile = await AuthService.getProfile(result.uid);
          if (profile) {
            await setCurrentUser(profile);
            // RootNavigator automatically switches to Main when isAuthenticated becomes true
          } else {
            // Profile missing in Firestore despite not being new — treat as new user
            navigation.navigate('ProfileSetup', { phone });
          }
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setIsVerifying(false);
        setErrorMessage(result.message ?? 'Incorrect code. Try again.');
        triggerShake();
        resetBoxes();
      }
    },
    [navigation, phone, triggerShake, resetBoxes, setCurrentUser]
  );

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      const cleaned = value.replace(/\D/g, '');
      if (!cleaned) return;

      const char = cleaned[cleaned.length - 1] ?? '';
      const newDigits = [...digits];
      newDigits[index] = char;
      setDigits(newDigits);
      setErrorMessage('');

      if (index < OTP_LENGTH - 1) {
        const next = index + 1;
        setFocusedIndex(next);
        inputRefs.current[next]?.focus();
      } else {
        inputRefs.current[index]?.blur();
        setFocusedIndex(-1);
        const code = newDigits.join('');
        if (code.length === OTP_LENGTH) {
          verifyOTP(code);
        }
      }
    },
    [digits, verifyOTP]
  );

  const handleKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === 'Backspace') {
        const newDigits = [...digits];
        if (newDigits[index]) {
          newDigits[index] = '';
          setDigits(newDigits);
        } else if (index > 0) {
          const prev = index - 1;
          newDigits[prev] = '';
          setDigits(newDigits);
          setFocusedIndex(prev);
          inputRefs.current[prev]?.focus();
        }
        setErrorMessage('');
        hasVerified.current = false;
      }
    },
    [digits]
  );

  const handleResend = useCallback(async () => {
    if (!isResendActive || isResending) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsResending(true);
    setErrorMessage('');

    const result = await AuthService.requestOTP(phone, resendRecaptchaRef.current);

    setIsResending(false);

    if (result.success) {
      resetBoxes();
      startCountdown();
      showToast('Code sent!');
    } else {
      showToast('Failed to resend code. Try again.');
    }
  }, [isResendActive, isResending, phone, resetBoxes, startCountdown, showToast]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      flex: 1,
      fontSize: theme.fontSizes.xl,
      fontWeight: theme.fontWeights.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.xxl,
      paddingTop: theme.spacing.xxxl,
      alignItems: 'center',
    },
    subtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: theme.spacing.xxxl,
    },
    phoneHighlight: {
      color: theme.colors.text,
      fontWeight: theme.fontWeights.semibold,
    },
    boxRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xxxl,
    },
    hiddenInputWrapper: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1,
      overflow: 'hidden',
    },
    errorText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    resendContainer: {
      alignItems: 'center',
      marginTop: theme.spacing.xl,
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    resendCountdown: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textTertiary,
    },
    resendLink: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.fontWeights.semibold,
    },
    successContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    successIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.success,
      alignItems: 'center',
      justifyContent: 'center',
    },
    verifyingContainer: {
      marginBottom: theme.spacing.xl,
    },
    toastContainer: {
      position: 'absolute',
      bottom: 100,
      left: theme.spacing.xxl,
      right: theme.spacing.xxl,
      backgroundColor: theme.colors.surfaceElevated,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    toastText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      fontWeight: theme.fontWeights.medium,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Hidden reCAPTCHA modal for the resend flow */}
      <FirebaseRecaptchaVerifierModal
        ref={resendRecaptchaRef}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enter Code</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {"We've sent an SMS with a code to "}
            <Text style={styles.phoneHighlight}>{phone}</Text>
          </Text>

          <Animated.View style={[styles.boxRow, boxRowStyle]}>
            {digits.map((digit, index) => (
              <MemoizedOTPDigitBox
                key={index}
                digit={digit}
                isFocused={focusedIndex === index}
                isVerifying={isVerifying}
                theme={theme}
              />
            ))}
          </Animated.View>

          {digits.map((_, index) => (
            <View key={index} style={styles.hiddenInputWrapper}>
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digits[index]}
                onChangeText={(value) => handleDigitChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                onFocus={() => setFocusedIndex(index)}
                keyboardType="number-pad"
                maxLength={2}
                caretHidden
                autoFocus={index === 0}
                editable={!isVerifying}
                accessibilityLabel={`OTP digit ${index + 1} of ${OTP_LENGTH}`}
              />
            </View>
          ))}

          {isVerifying && (
            <View style={styles.verifyingContainer}>
              <ActivityIndicator color={theme.colors.primary} size="small" />
            </View>
          )}

          {isSuccess && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={32} color="#FFFFFF" />
              </View>
            </Animated.View>
          )}

          {errorMessage.length > 0 && (
            <Animated.Text entering={FadeIn.duration(200)} style={styles.errorText}>
              {errorMessage}
            </Animated.Text>
          )}

          <View style={styles.resendContainer}>
            {isResendActive ? (
              <>
                {isResending ? (
                  <ActivityIndicator color={theme.colors.primary} size="small" />
                ) : (
                  <TouchableOpacity
                    onPress={handleResend}
                    accessibilityLabel="Resend verification code"
                    accessibilityRole="button"
                  >
                    <Text style={styles.resendLink}>Resend Code</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.resendCountdown}>
                Resend code in {countdown}s
              </Text>
            )}
          </View>
        </View>
      </View>

      {toastMessage.length > 0 && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
}
