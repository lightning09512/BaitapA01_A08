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

// ── Animated orb background ────────────────────────────────────────────────────
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
function GlassInput({ label, icon, value, onChangeText, secureTextEntry, disabled, autoCapitalize, keyboardType, error, errorText }) {
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
            error ? 'rgba(248,113,113,0.6)' : 'rgba(255,255,255,0.12)',
            error ? 'rgba(248,113,113,0.9)' : 'rgba(96,165,250,0.7)',
        ],
    });
    const bgColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.10)'],
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
                    autoCapitalize={autoCapitalize ?? 'none'}
                    keyboardType={keyboardType ?? 'default'}
                    placeholderTextColor="rgba(148,163,184,0.5)"
                    editable={!disabled}
                    selectionColor="#60a5fa"
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                        <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
            {error && errorText ? (
                <Text style={styles.errorText}>⚠ {errorText}</Text>
            ) : null}
        </View>
    );
}

// ── Progress Step Indicator ────────────────────────────────────────────────────
function StepIndicator({ total = 3, current = 0 }) {
    return (
        <View style={styles.stepRow}>
            {Array.from({ length: total }).map((_, i) => (
                <View key={i} style={[styles.stepDot, i <= current && styles.stepDotActive]} />
            ))}
        </View>
    );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function RegisterScreen({ navigation }) {
    const [form, setForm] = useState({ username: '', password: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
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

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 700, delay: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
    }, []);

    const pressIn = () => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
    const pressOut = () => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, bounciness: 8 }).start();

    const validateForm = () => {
        const newErrors = {};
        if (!form.username.trim()) newErrors.username = 'Vui lòng nhập tài khoản';
        else if (form.username.length < 3) newErrors.username = 'Tài khoản phải có ít nhất 3 ký tự';

        if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';

        if (!form.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';
        else if (form.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const res = await api.post('/register', form);
            setLoading(false);
            const message = res.data?.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.';
            Alert.alert('Thành công 🎉', message, [
                { text: 'OK', onPress: () => navigation.navigate('VerifyAccount', { email: form.email }) }
            ]);
        } catch (e) {
            setLoading(false);
            const isNetworkErr = !e.response && (e.code === 'ECONNREFUSED' || e.code === 'ETIMEDOUT' || e.message?.includes('Network'));
            const msg = isNetworkErr
                ? 'Không thể kết nối server.\n• Kiểm tra server đã chạy chưa (port 3001)\n• Kiểm tra IP trong api.js'
                : e.response?.data?.message || e.message || 'Đăng ký thất bại';
            Alert.alert('Lỗi', msg);
        }
    };

    const updateForm = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // Count filled fields for step indicator
    const filledCount = [form.username, form.email, form.password].filter(v => v.trim().length > 0).length;

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Background orbs */}
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
                            <Text style={styles.brandName}>SellphoneK</Text>
                            <Text style={styles.brandTagline}>Công nghệ trong tầm tay</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Header */}
                    <Text style={styles.welcomeText}>Tạo tài khoản mới </Text>
                    <Text style={styles.subText}>Điền thông tin để bắt đầu trải nghiệm</Text>

                    {/* Step indicator */}
                    <StepIndicator total={3} current={filledCount - 1} />

                    {/* Inputs */}
                    <GlassInput
                        label="Tài khoản"
                        icon=""
                        value={form.username}
                        onChangeText={t => updateForm('username', t)}
                        disabled={loading}
                        error={!!errors.username}
                        errorText={errors.username}
                    />
                    <GlassInput
                        label="Email"
                        icon=""
                        value={form.email}
                        onChangeText={t => updateForm('email', t)}
                        disabled={loading}
                        keyboardType="email-address"
                        error={!!errors.email}
                        errorText={errors.email}
                    />
                    <GlassInput
                        label="Mật khẩu"
                        icon=""
                        value={form.password}
                        onChangeText={t => updateForm('password', t)}
                        secureTextEntry
                        disabled={loading}
                        error={!!errors.password}
                        errorText={errors.password}
                    />

                    {/* Password strength hint */}
                    {form.password.length > 0 && (
                        <View style={styles.strengthRow}>
                            {[1, 2, 3, 4].map(i => (
                                <View
                                    key={i}
                                    style={[
                                        styles.strengthBar,
                                        form.password.length >= i * 2 && (
                                            form.password.length < 6 ? styles.strengthWeak :
                                            form.password.length < 10 ? styles.strengthMid :
                                            styles.strengthStrong
                                        )
                                    ]}
                                />
                            ))}
                            <Text style={styles.strengthLabel}>
                                {form.password.length < 6 ? 'Yếu' : form.password.length < 10 ? 'Trung bình' : 'Mạnh'}
                            </Text>
                        </View>
                    )}

                    {/* Register button */}
                    <Animated.View style={[{ transform: [{ scale: buttonScale }] }, { marginTop: 8 }]}>
                        <Pressable
                            style={[styles.registerBtn, loading && styles.btnDisabled]}
                            onPress={handleRegister}
                            onPressIn={pressIn}
                            onPressOut={pressOut}
                            disabled={loading}
                        >
                            <View style={styles.btnInner}>
                                <Text style={styles.btnText}>
                                    {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}
                                </Text>
                                {!loading && <Text style={styles.btnArrow}>→</Text>}
                            </View>
                        </Pressable>
                    </Animated.View>

                    {/* Back to login */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backBtn}
                        disabled={loading}
                    >
                        <Text style={styles.backText}>
                            Đã có tài khoản?{' '}
                            <Text style={styles.backHighlight}>Đăng nhập</Text>
                        </Text>
                    </TouchableOpacity>

                </Animated.View>
            </ScrollView>
        </View>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#050c1a',
        overflow: 'hidden',
    },
    orb: { position: 'absolute', borderRadius: 999 },
    orb1: { width: 320, height: 320, top: -80, left: -80, backgroundColor: 'rgba(37,99,235,0.22)' },
    orb2: { width: 260, height: 260, bottom: -60, right: -60, backgroundColor: 'rgba(99,102,241,0.18)' },
    orb3: { width: 180, height: 180, top: height * 0.35, right: -30, backgroundColor: 'rgba(14,165,233,0.12)' },

    card: {
        marginHorizontal: 22,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.09)',
        padding: 28,
        shadowColor: '#1d4ed8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },

    // Brand
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
    logoBox: {
        width: 52, height: 52, borderRadius: 16,
        backgroundColor: '#1d4ed8', overflow: 'hidden',
        shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0, shadowRadius: 0, elevation: 0,
    },
    logoImage: { width: '100%', height: '100%', borderRadius: 16 },
    brandName: { fontSize: 22, fontWeight: '800', color: '#f0f9ff', letterSpacing: 0.3 },
    brandTagline: { fontSize: 12, color: 'rgba(148,163,184,0.7)', marginTop: 1, letterSpacing: 0.4 },

    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 22 },

    welcomeText: { fontSize: 24, fontWeight: '700', color: '#f1f5f9', marginBottom: 6 },
    subText: { fontSize: 13.5, color: 'rgba(148,163,184,0.75)', marginBottom: 16 },

    // Step indicator
    stepRow: { flexDirection: 'row', gap: 6, marginBottom: 22 },
    stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
    stepDotActive: { backgroundColor: '#2563eb' },

    // Input
    inputWrapper: { marginBottom: 14 },
    inputLabel: {
        fontSize: 12.5, fontWeight: '600', color: 'rgba(148,163,184,0.9)',
        marginBottom: 8, letterSpacing: 0.8, textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, height: 52,
    },
    inputIcon: { fontSize: 16, marginRight: 10, opacity: 0.5 },
    inputIconFocused: { opacity: 1 },
    input: { flex: 1, color: '#f1f5f9', fontSize: 15, fontWeight: '500', height: '100%' },
    eyeBtn: { padding: 4 },
    eyeIcon: { fontSize: 16 },
    errorText: { fontSize: 12, color: '#f87171', marginTop: 5, marginLeft: 2 },

    // Password strength
    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, marginTop: -4 },
    strengthBar: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
    strengthWeak: { backgroundColor: '#ef4444' },
    strengthMid: { backgroundColor: '#f59e0b' },
    strengthStrong: { backgroundColor: '#22c55e' },
    strengthLabel: { fontSize: 11, color: 'rgba(148,163,184,0.7)', fontWeight: '600', minWidth: 60, textAlign: 'right' },

    // Button
    registerBtn: {
        borderRadius: 14, backgroundColor: '#1d4ed8',
        shadowColor: '#2563eb', shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0, shadowRadius: 0, elevation: 0,
    },
    btnDisabled: { opacity: 0.6 },
    btnInner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, paddingVertical: 16,
    },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.4 },
    btnArrow: { color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '600' },

    // Back to login
    backBtn: { alignItems: 'center', marginTop: 20 },
    backText: { color: 'rgba(148,163,184,0.7)', fontSize: 14 },
    backHighlight: { color: '#60a5fa', fontWeight: '700' },
});