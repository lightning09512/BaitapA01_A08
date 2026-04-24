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
function GlassInput({ label, icon, value, onChangeText, disabled, keyboardType, error, errorText }) {
    const [focused, setFocused] = useState(false);
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
                    autoCapitalize="none"
                    keyboardType={keyboardType ?? 'default'}
                    placeholderTextColor="#9ca3af"
                    editable={!disabled}
                    selectionColor="#dc2626"
                />
            </Animated.View>
            {error && errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        </View>
    );
}

// ── OTP Box Input ──────────────────────────────────────────────────────────────
function OtpInput({ value, onChangeText, disabled, error, errorText }) {
    const digits = value.padEnd(6, ' ').split('');
    const inputRef = useRef(null);

    // Animate each filled box
    const scaleAnims = useRef(Array.from({ length: 6 }, () => new Animated.Value(1))).current;

    const handleChange = (t) => {
        const cleaned = t.replace(/[^0-9]/g, '').slice(0, 6);
        const newLen = cleaned.length;
        const oldLen = value.length;
        if (newLen > oldLen && newLen <= 6) {
            Animated.sequence([
                Animated.timing(scaleAnims[newLen - 1], { toValue: 1.2, duration: 80, useNativeDriver: true }),
                Animated.spring(scaleAnims[newLen - 1], { toValue: 1, useNativeDriver: true, bounciness: 12 }),
            ]).start();
        }
        onChangeText(cleaned);
    };

    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Mã OTP</Text>
            <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()}>
                <View style={styles.otpRow}>
                    {digits.map((d, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.otpBox,
                                d.trim() && styles.otpBoxFilled,
                                error && styles.otpBoxError,
                                { transform: [{ scale: scaleAnims[i] }] },
                            ]}
                        >
                            <Text style={styles.otpDigit}>{d.trim()}</Text>
                        </Animated.View>
                    ))}
                </View>
                <TextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={handleChange}
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
export default function VerifyAccountScreen({ navigation, route }) {
    const [email, setEmail] = useState(route?.params?.email || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', otp: '' });
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

    // Shield icon pulse
    const shieldPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 700, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(shieldPulse, { toValue: 1.08, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                Animated.timing(shieldPulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const pressIn = () => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
    const pressOut = () => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, bounciness: 8 }).start();

    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không hợp lệ';
        if (!otp.trim() || otp.length < 6) newErrors.otp = 'Vui lòng nhập đủ 6 số OTP';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleVerify = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const res = await api.post('/verify-account', { email, otp });
            Alert.alert(
                'Xác minh thành công',
                res.data.message,
                [{ text: 'Đăng nhập ngay', onPress: () => navigation.replace('Login') }]
            );
        } catch (e) {
            Alert.alert('Lỗi', e.response?.data?.message || e.message || 'Xác minh thất bại');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        if (field === 'email') setEmail(value);
        else if (field === 'otp') setOtp(value);
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // OTP fill progress
    const progress = otp.length / 6;

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <AnimatedOrb style={[styles.orb, styles.orb1]} delay={0} />
            <AnimatedOrb style={[styles.orb, styles.orb2]} delay={1500} />
            <AnimatedOrb style={[styles.orb, styles.orb3]} delay={800} />

            {/* ── Dot grid overlay ── */}
            <View style={styles.dotGrid} pointerEvents="none" />

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

                    {/* Shield icon */}
                    <View style={styles.shieldWrapper}>
                        <Animated.View style={[styles.shieldGlow, { transform: [{ scale: shieldPulse }] }]} />
                        <Text style={styles.shieldIcon}>🛡️</Text>
                    </View>

                    <Text style={styles.welcomeText}>Xác minh tài khoản</Text>
                    <Text style={styles.subText}>Nhập email và mã OTP đã được gửi tới hộp thư của bạn</Text>

                    {/* Email pre-filled badge */}
                    {route?.params?.email ? (
                        <View style={styles.emailBadge}>
                            <Text style={styles.emailBadgeText}>{email}</Text>
                        </View>
                    ) : (
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
                    )}

                    <OtpInput
                        value={otp}
                        onChangeText={t => updateField('otp', t)}
                        disabled={loading}
                        error={!!errors.otp}
                        errorText={errors.otp}
                    />

                    {/* Progress bar */}
                    <View style={{ height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, marginVertical: 16, overflow: 'hidden' }}>
                        <Animated.View style={{ height: 6, backgroundColor: '#dc2626', width: `${progress * 100}%` }} />
                    </View>
                    <Text style={styles.progressLabel}>{otp.length}/6 ký tự</Text>

                    {/* Verify button */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 20 }}>
                        <Pressable
                            style={[styles.primaryBtn, loading && styles.btnDisabled]}
                            onPress={handleVerify}
                            onPressIn={pressIn}
                            onPressOut={pressOut}
                            disabled={loading}
                        >
                            <View style={styles.btnInner}>
                                <Text style={styles.btnText}>{loading ? 'Đang xác minh...' : 'Xác Minh Tài Khoản'}</Text>
                                {!loading && <Text style={styles.btnArrow}>→</Text>}
                            </View>
                        </Pressable>
                    </Animated.View>

                    {/* Back */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={loading}>
                        <Text style={styles.backText}>← Quay lại</Text>
                    </TouchableOpacity>

                </Animated.View>
            </ScrollView>
        </View>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', overflow: 'hidden' },
    orb: { position: 'absolute', borderRadius: 999 },
    orb1: { width: 320, height: 320, top: -80, left: -80, backgroundColor: 'rgba(220,38,38,0.05)' },
    orb2: { width: 260, height: 260, bottom: -60, right: -60, backgroundColor: 'rgba(239,68,68,0.04)' },
    orb3: { width: 180, height: 180, top: height * 0.35, right: -30, backgroundColor: 'rgba(248,113,113,0.03)' },

    // Dot grid (simulated via border styling)
    dotGrid: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.4,
    },

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
        width: 52, height: 52, borderRadius: 16, backgroundColor: '#dc2626',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#ef4444', shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0, shadowRadius: 0, elevation: 0,
    },
    logoImage: { width: '100%', height: '100%', borderRadius: 16 },
    brandName: { fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: 0.3 },
    brandTagline: { fontSize: 12, color: '#6b7280', marginTop: 1, letterSpacing: 0.4 },

    divider: { height: 1, backgroundColor: '#f3f4f6', marginBottom: 22 },

    // Shield
    shieldWrapper: { alignItems: 'center', marginBottom: 16, position: 'relative' },
    shieldGlow: {
        position: 'absolute', width: 72, height: 72, borderRadius: 36,
        backgroundColor: '#fee2e2',
    },
    shieldIcon: { fontSize: 42 },

    welcomeText: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 6, textAlign: 'center' },
    subText: { fontSize: 13.5, color: '#6b7280', marginBottom: 24, textAlign: 'center', lineHeight: 20 },

    // Email badge
    emailBadge: {
        backgroundColor: '#fef2f2', borderRadius: 10,
        borderWidth: 1, borderColor: '#fee2e2',
        paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20,
    },
    emailBadgeText: { color: '#dc2626', fontSize: 13.5, fontWeight: '600', textAlign: 'center' },

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
    otpDigit: { color: '#111827', fontSize: 22, fontWeight: '700' },
    otpHiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },

    // Progress bar
    progressTrack: {
        height: 6,
        width: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: 3,
        marginVertical: 16,
        overflow: 'hidden',
    },
    progressFill: {
        height: 6,
        backgroundColor: '#dc2626',
        borderRadius: 3,
    },
    progressLabel: {
        fontSize: 11, color: 'rgba(148,163,184,0.5)',
        textAlign: 'right', marginTop: 4, fontWeight: '600',
    },

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

    // Back
    backBtn: { alignItems: 'center', marginTop: 20 },
    backText: { color: 'rgba(100,116,139,0.7)', fontSize: 13, fontWeight: '500' },
});