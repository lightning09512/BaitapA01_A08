import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Easing,
    Image,
    Keyboard,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import api from '../../services/api';

const { height } = Dimensions.get('window');

// ── Animated Orb ───────────────────────────────────────────────────────────────
function AnimatedOrb({ style, delay = 0 }) {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, { toValue: 1, duration: 4000, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(anim, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        ).start();
    }, []);
    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
    return <Animated.View style={[style, { transform: [{ translateY }, { scale }] }]} />;
}

// ── Glass Input ────────────────────────────────────────────────────────────────
function GlassInput({ label, icon, value, onChangeText, secureTextEntry, disabled, keyboardType, maxLength, error, errorText }) {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => {
        setFocused(true);
        Animated.timing(borderAnim, { toValue: 1, duration: 250, useNativeDriver: false }).start();
    };
    const handleBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [
            error ? 'rgba(248,113,113,0.6)' : '#e5e7eb',
            error ? 'rgba(248,113,113,0.9)' : '#dc2626',
        ],
    });
    const bgColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#f9fafb', '#ffffff'],
    });

    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{label}</Text>
            <Animated.View style={[styles.inputContainer, { borderColor, backgroundColor: bgColor }]}>
                <Text style={[styles.inputIcon, focused && styles.inputIconFocused]}>{icon}</Text>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={secureTextEntry && !showPassword}
                    autoCapitalize="none"
                    keyboardType={keyboardType ?? 'default'}
                    maxLength={maxLength}
                    placeholderTextColor="#9ca3af"
                    editable={!disabled}
                    selectionColor="#dc2626"
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                        <Text style={styles.eyeIcon}>{showPassword ? 'Ẩn' : 'Hiện'}</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
            {error && errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
    );
}

// ── OTP Box Input ──────────────────────────────────────────────────────────────
function OtpInput({ value, onChangeText, disabled, error, errorText }) {
    const digits = value.padEnd(6, ' ').split('');
    const inputRef = useRef(null);

    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Mã OTP</Text>
            <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()}>
                <View style={styles.otpRow}>
                    {digits.map((d, i) => (
                        <View
                            key={i}
                            style={[
                                styles.otpBox,
                                d.trim() && styles.otpBoxFilled,
                                error && styles.otpBoxError,
                            ]}
                        >
                            <Text style={styles.otpDigit}>{d.trim()}</Text>
                        </View>
                    ))}
                </View>
                <TextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={t => onChangeText(t.replace(/[^0-9]/g, '').slice(0, 6))}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!disabled}
                    style={styles.otpHiddenInput}
                    caretHidden
                />
            </TouchableOpacity>
            {error && errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
    );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1 = email, 2 = otp + new password
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', otp: '', password: '' });
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Keyboard listener
    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', e => setKeyboardHeight(e.endCoordinates.height));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
        return () => { showSub.remove(); hideSub.remove(); };
    }, []);

    // Entry animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    // Step transition animation
    const stepFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 700, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
    }, []);

    const pressIn = () => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
    const pressOut = () => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, bounciness: 8 }).start();

    const transitionToStep2 = () => {
        Animated.sequence([
            Animated.timing(stepFade, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(stepFade, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
        setStep(2);
    };

    const validateEmail = () => {
        if (!email.trim()) { setErrors(p => ({ ...p, email: 'Vui lòng nhập email' })); return false; }
        if (!/\S+@\S+\.\S+/.test(email)) { setErrors(p => ({ ...p, email: 'Email không hợp lệ' })); return false; }
        setErrors(p => ({ ...p, email: '' }));
        return true;
    };

    const validateResetForm = () => {
        const newErrors = {};
        if (!otp.trim() || otp.length < 6) newErrors.otp = 'Vui lòng nhập đủ 6 số OTP';
        if (!newPassword.trim()) newErrors.password = 'Vui lòng nhập mật khẩu mới';
        else if (newPassword.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async () => {
        if (!validateEmail()) return;
        setLoading(true);
        try {
            const res = await api.post('/forgot-password', { email });
            Alert.alert(
                'Đã gửi OTP 📬',
                res.data.message || `Mã OTP đã được gửi tới ${email}`,
                [{ text: 'OK', onPress: transitionToStep2 }]
            );
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || e.message || 'Không thể gửi OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!validateResetForm()) return;
        setLoading(true);
        try {
            const res = await api.post('/reset-password', { email, otp, newPassword });
            if (res.data.requiresVerification) {
                Alert.alert(
                    'Cần xác minh',
                    'Tài khoản chưa được xác minh. Vui lòng xác minh trước.',
                    [{ text: 'OK', onPress: () => navigation.navigate('VerifyAccount') }]
                );
                return;
            }
            Alert.alert(
                'Thành công',
                'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || e.message || 'Đặt lại mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        if (field === 'email') setEmail(value);
        else if (field === 'otp') setOtp(value);
        else if (field === 'password') setNewPassword(value);
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <AnimatedOrb style={[styles.orb, styles.orb1]} delay={0} />
            <AnimatedOrb style={[styles.orb, styles.orb2]} delay={1500} />
            <AnimatedOrb style={[styles.orb, styles.orb3]} delay={800} />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24, paddingBottom: keyboardHeight }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
            >
                <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                    {/* Brand */}
                    <View style={styles.brandRow}>
                        <View style={styles.logoBox}>
                            <Image
                                source={{ uri: 'https://brasol.vn/wp-content/uploads/2022/09/logo-dai-hoc-su-pham-ky-thuat-tp-hcm.jpg' }}
                                style={styles.logoImage}
                                resizeMode="cover"
                            />
                        </View>
                        <View>
                            <Text style={styles.brandName}>CellphoneK</Text>
                            <Text style={styles.brandTagline}>Công nghệ trong tầm tay</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Step progress pills */}
                    <View style={styles.stepRow}>
                        <View style={[styles.stepPill, styles.stepPillActive]}>
                            <Text style={styles.stepPillText}>1 Email</Text>
                        </View>
                        <View style={[styles.stepConnector, step === 2 && styles.stepConnectorActive]} />
                        <View style={[styles.stepPill, step === 2 && styles.stepPillActive]}>
                            <Text style={[styles.stepPillText, step !== 2 && styles.stepPillTextInactive]}>2 Đặt lại</Text>
                        </View>
                    </View>

                    <Animated.View style={{ opacity: stepFade }}>
                        {step === 1 ? (
                            <>
                                <Text style={styles.welcomeText}>Quên mật khẩu? </Text>
                                <Text style={styles.subText}>Nhập email để nhận mã OTP đặt lại mật khẩu</Text>

                                <GlassInput
                                    label="Email"
                                    icon=""
                                    value={email}
                                    onChangeText={t => updateField('email', t)}
                                    keyboardType="email-address"
                                    disabled={loading}
                                    error={!!errors.email}
                                    errorText={errors.email}
                                />

                                <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 8 }}>
                                    <Pressable
                                        style={[styles.primaryBtn, loading && styles.btnDisabled]}
                                        onPress={handleSendOTP}
                                        onPressIn={pressIn}
                                        onPressOut={pressOut}
                                        disabled={loading}
                                    >
                                        <View style={styles.btnInner}>
                                            <Text style={styles.btnText}>{loading ? 'Đang gửi...' : 'Gửi Mã OTP'}</Text>
                                            {!loading && <Text style={styles.btnArrow}>→</Text>}
                                        </View>
                                    </Pressable>
                                </Animated.View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.welcomeText}>Nhập mã xác nhận 📩</Text>
                                <View style={styles.emailBadge}>
                                    <Text style={styles.emailBadgeText}>{email}</Text>
                                </View>

                                <OtpInput
                                    value={otp}
                                    onChangeText={t => updateField('otp', t)}
                                    disabled={loading}
                                    error={!!errors.otp}
                                    errorText={errors.otp}
                                />

                                <GlassInput
                                    label="Mật khẩu mới"
                                    icon=""
                                    value={newPassword}
                                    onChangeText={t => updateField('password', t)}
                                    secureTextEntry
                                    disabled={loading}
                                    error={!!errors.password}
                                    errorText={errors.password}
                                />

                                {/* Password strength */}
                                {newPassword.length > 0 && (
                                    <View style={styles.strengthRow}>
                                        {[1, 2, 3, 4].map(i => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.strengthBar,
                                                    newPassword.length >= i * 2 && (
                                                        newPassword.length < 6 ? styles.strengthWeak :
                                                        newPassword.length < 10 ? styles.strengthMid :
                                                        styles.strengthStrong
                                                    )
                                                ]}
                                            />
                                        ))}
                                        <Text style={styles.strengthLabel}>
                                            {newPassword.length < 6 ? 'Yếu' : newPassword.length < 10 ? 'Trung bình' : 'Mạnh'}
                                        </Text>
                                    </View>
                                )}

                                <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 8 }}>
                                    <Pressable
                                        style={[styles.primaryBtn, loading && styles.btnDisabled]}
                                        onPress={handleResetPassword}
                                        onPressIn={pressIn}
                                        onPressOut={pressOut}
                                        disabled={loading}
                                    >
                                        <View style={styles.btnInner}>
                                            <Text style={styles.btnText}>{loading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}</Text>
                                            {!loading && <Text style={styles.btnArrow}>→</Text>}
                                        </View>
                                    </Pressable>
                                </Animated.View>

                                {/* Resend OTP */}
                                <TouchableOpacity
                                    onPress={() => { setStep(1); setOtp(''); setErrors({}); }}
                                    style={styles.resendBtn}
                                    disabled={loading}
                                >
                                    <Text style={styles.resendText}>Không nhận được? <Text style={styles.resendHighlight}>Gửi lại</Text></Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Animated.View>

                    {/* Back */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={loading}>
                        <Text style={styles.backText}>← Quay lại đăng nhập</Text>
                    </TouchableOpacity>

                </Animated.View>
            </ScrollView>
        </View>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#ffffff', overflow: 'hidden' },
    orb: { position: 'absolute', borderRadius: 999 },
    orb1: { width: 320, height: 320, top: -80, left: -80, backgroundColor: 'rgba(220,38,38,0.05)' },
    orb2: { width: 260, height: 260, bottom: -60, right: -60, backgroundColor: 'rgba(239,68,68,0.04)' },
    orb3: { width: 180, height: 180, top: height * 0.35, right: -30, backgroundColor: 'rgba(248,113,113,0.03)' },

    card: {
        marginHorizontal: 22,
        backgroundColor: '#ffffff',
        borderRadius: 28,
        padding: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },

    // Brand
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
    logoBox: {
        width: 52, height: 52, borderRadius: 16, backgroundColor: '#dc2626', overflow: 'hidden',
        shadowColor: '#ef4444', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0,
    },
    logoImage: { width: '100%', height: '100%', borderRadius: 16 },
    brandName: { fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: 0.3 },
    brandTagline: { fontSize: 12, color: '#6b7280', marginTop: 1, letterSpacing: 0.4 },

    divider: { height: 1, backgroundColor: '#f3f4f6', marginBottom: 22 },
    stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    stepPill: {
        paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
        backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fee2e2',
    },
    stepPillActive: { backgroundColor: '#fee2e2', borderColor: '#fca5a5' },
    stepPillText: { fontSize: 12, fontWeight: '700', color: '#dc2626', letterSpacing: 0.5 },
    stepPillTextInactive: { color: '#9ca3af' },
    stepConnector: { flex: 1, height: 1.5, backgroundColor: '#f3f4f6', marginHorizontal: 8 },
    stepConnectorActive: { backgroundColor: '#dc2626' },

    welcomeText: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6 },
    subText: { fontSize: 13.5, color: '#6b7280', marginBottom: 24 },

    // Email badge
    emailBadge: {
        backgroundColor: '#fef2f2', borderRadius: 10,
        borderWidth: 1, borderColor: '#fee2e2',
        paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20,
    },
    emailBadgeText: { color: '#dc2626', fontSize: 13.5, fontWeight: '600' },

    // Input
    inputWrapper: { marginBottom: 14 },
    inputLabel: {
        fontSize: 12.5, fontWeight: '600', color: '#4b5563',
        marginBottom: 8, letterSpacing: 0.8, textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, height: 52,
    },
    inputIcon: { fontSize: 16, marginRight: 10, opacity: 0.5 },
    inputIconFocused: { opacity: 1 },
    input: { flex: 1, color: '#111827', fontSize: 15, fontWeight: '500', height: '100%' },
    eyeBtn: { padding: 4 },
    eyeIcon: { fontSize: 16 },
    errorText: { fontSize: 12, color: '#f87171', marginTop: 5, marginLeft: 2 },

    // OTP boxes
    otpRow: { flexDirection: 'row', gap: 8 },
    otpBox: {
        flex: 1, height: 52, borderRadius: 12,
        backgroundColor: '#f9fafb',
        borderWidth: 1.5, borderColor: '#e5e7eb',
        justifyContent: 'center', alignItems: 'center',
    },
    otpBoxFilled: { borderColor: '#dc2626', backgroundColor: '#ffffff' },
    otpBoxError: { borderColor: 'rgba(248,113,113,0.7)' },
    otpDigit: { color: '#111827', fontSize: 20, fontWeight: '700' },
    otpHiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },

    // Password strength
    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, marginTop: -4 },
    strengthBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
    strengthWeak: { backgroundColor: '#ef4444' },
    strengthMid: { backgroundColor: '#f59e0b' },
    strengthStrong: { backgroundColor: '#22c55e' },
    strengthLabel: { fontSize: 11, color: 'rgba(148,163,184,0.7)', fontWeight: '600', minWidth: 60, textAlign: 'right' },

    // Button
    primaryBtn: {
        borderRadius: 14, backgroundColor: '#dc2626',
        shadowColor: '#dc2626', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    btnDisabled: { opacity: 0.6 },
    btnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.4 },
    btnArrow: { color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '600' },

    // Resend
    resendBtn: { alignItems: 'center', marginTop: 16 },
    resendText: { color: '#6b7280', fontSize: 13 },
    resendHighlight: { color: '#dc2626', fontWeight: '700' },

    // Back
    backBtn: { alignItems: 'center', marginTop: 20 },
    backText: { color: 'rgba(100,116,139,0.7)', fontSize: 13, fontWeight: '500' },
});