import AsyncStorage from '@react-native-async-storage/async-storage';
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
    View
} from 'react-native';
import api, { setAuthToken } from '../../services/api';

const { width, height } = Dimensions.get('window');

// ── Orb / blob background (pure RN animated) ──────────────────────────────────
function AnimatedOrb({ style, delay = 0 }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 4000,
                    delay,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
    const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

    return <Animated.View style={[style, { transform: [{ translateY }, { scale }] }]} />;
}

// ── Custom Input ───────────────────────────────────────────────────────────────
function GlassInput({ label, icon, value, onChangeText, secureTextEntry, disabled, autoCapitalize }) { 
    const [focused, setFocused] = useState(false); 
    const [showPassword, setShowPassword] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => { //Khi input được focus
        setFocused(true);
        Animated.timing(borderAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => { //Khi input bị blur
        setFocused(false);
        Animated.timing(borderAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255,255,255,0.12)', 'rgba(96,165,250,0.7)'],
    });
    const bgColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.10)'],
    });

    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{label}</Text>
            <Animated.View
                style={[
                    styles.inputContainer,
                    { borderColor, backgroundColor: bgColor },
                ]}
            >
                {/* Icon slot */}
                <Text style={[styles.inputIcon, focused && styles.inputIconFocused]}>
                    {icon}
                </Text>

                <TextInput 
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={secureTextEntry && !showPassword}
                    autoCapitalize={autoCapitalize ?? 'none'}
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
        </View>
    );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });
        return () => { showSub.remove(); hideSub.remove(); };
    }, []);

    // Entry animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                delay: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                delay: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const pressIn = () =>
        Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
    const pressOut = () =>
        Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, bounciness: 8 }).start();

    const handleLogin = async () => {
        if (!username.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tài khoản');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/login', { username, password });

            if (res.data?.requiresVerification) {
                setLoading(false);
                Alert.alert(
                    'Cần xác minh',
                    'Tài khoản chưa được xác minh. Vui lòng kiểm tra email.'
                );
                return;
            }

            if (res.data?.token) setAuthToken(res.data.token);

            try {
                await AsyncStorage.setItem('TOKEN', res.data.token);
            } catch (e) {
                console.log('AsyncStorage error:', e);
            }

            setLoading(false);
            Alert.alert('Thành công', `Chào mừng ${res.data?.user?.name || username}!`);
            navigation.replace('MainApp');
        } catch (e) {
            setLoading(false);
            const isNetworkErr =
                !e.response &&
                (e.code === 'ECONNREFUSED' ||
                    e.code === 'ETIMEDOUT' ||
                    e.message?.includes('Network'));
            const msg = isNetworkErr
                ? 'Không thể kết nối server.\n• Kiểm tra server đã chạy chưa (port 3001)\n• Kiểm tra IP trong api.js'
                : e.response?.data?.message || e.message || 'Đăng nhập thất bại';
            Alert.alert('Lỗi', msg);
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* ── Background orbs ── */}
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
                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* Logo / Brand */}
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

                    {/* Divider */}
                    <View style={styles.divider} />

                    <Text style={styles.welcomeText}>Chào mừng trở lại </Text>
                    <Text style={styles.subText}>Đăng nhập để tiếp tục trải nghiệm</Text>

                    {/* Inputs */}
                    <GlassInput
                        label="Tài khoản"
                        icon=""
                        value={username}
                        onChangeText={setUsername}
                        disabled={loading}
                        autoCapitalize="none"
                    />
                    <GlassInput
                        label="Mật khẩu"
                        icon=""
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        disabled={loading}
                    />

                    {/* Forgot password */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ForgotPassword')}
                        style={styles.forgotBtn}
                        disabled={loading}
                    >
                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Login button */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <Pressable
                            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                            onPress={handleLogin}
                            onPressIn={pressIn}
                            onPressOut={pressOut}
                            disabled={loading}
                        >
                            <View style={styles.loginBtnInner}>
                                {loading ? (
                                    <Text style={styles.loginBtnText}>Đang đăng nhập...</Text>
                                ) : (
                                    <>
                                        <Text style={styles.loginBtnText}>Đăng Nhập</Text>
                                        <Text style={styles.loginBtnArrow}>→</Text>
                                    </>
                                )}
                            </View>
                        </Pressable>
                    </Animated.View>

                    {/* Divider with text */}
                    <View style={styles.orDividerRow}>
                        <View style={styles.orLine} />
                        <Text style={styles.orText}>hoặc</Text>
                        <View style={styles.orLine} />
                    </View>

                    {/* Register */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        style={styles.registerBtn}
                        disabled={loading}
                    >
                        <Text style={styles.registerText}>
                            Chưa có tài khoản?{' '}
                            <Text style={styles.registerHighlight}>Đăng ký ngay</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Guest */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Homepage')}
                        style={styles.guestBtn}
                        disabled={loading}
                    >
                        <Text style={styles.guestText}>Xem thông tin sinh viên →</Text>
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
        justifyContent: 'center',
        overflow: 'hidden',
    },

    // Orbs
    orb: {
        position: 'absolute',
        borderRadius: 999,
    },
    orb1: {
        width: 320,
        height: 320,
        top: -80,
        left: -80,
        backgroundColor: 'rgba(37,99,235,0.22)',
    },
    orb2: {
        width: 260,
        height: 260,
        bottom: -60,
        right: -60,
        backgroundColor: 'rgba(99,102,241,0.18)',
    },
    orb3: {
        width: 180,
        height: 180,
        top: height * 0.35,
        right: -30,
        backgroundColor: 'rgba(14,165,233,0.12)',
    },

    // Dot grid (simulated via border styling)
    dotGrid: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.4,
    },

    // Card
    card: {
        marginHorizontal: 22,
        marginVertical: 'auto',
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
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
    },
    logoBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#1d4ed8',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    brandName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#f0f9ff',
        letterSpacing: 0.3,
    },
    brandTagline: {
        fontSize: 12,
        color: 'rgba(148,163,184,0.7)',
        marginTop: 1,
        letterSpacing: 0.4,
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginBottom: 22,
    },

    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#f1f5f9',
        marginBottom: 6,
    },
    subText: {
        fontSize: 13.5,
        color: 'rgba(148,163,184,0.75)',
        marginBottom: 24,
    },

    // Input
    inputWrapper: { marginBottom: 16 },
    inputLabel: {
        fontSize: 12.5,
        fontWeight: '600',
        color: 'rgba(148,163,184,0.9)',
        marginBottom: 8,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 1.5,
        paddingHorizontal: 14,
        height: 52,
    },
    inputIcon: { fontSize: 16, marginRight: 10, opacity: 0.5 },
    inputIconFocused: { opacity: 1 },
    input: {
        flex: 1,
        color: '#f1f5f9',
        fontSize: 15,
        fontWeight: '500',
        height: '100%',
    },
    eyeBtn: { padding: 4 },
    eyeIcon: { fontSize: 16 },

    // Forgot
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 22, marginTop: -4 },
    forgotText: {
        fontSize: 13,
        color: '#60a5fa',
        fontWeight: '600',
    },

    // Login button
    loginBtn: {
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#1d4ed8',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    loginBtnDisabled: { opacity: 0.6 },
    loginBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    loginBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.4,
    },
    loginBtnArrow: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 18,
        fontWeight: '600',
    },

    // OR divider
    orDividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        gap: 12,
    },
    orLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
    orText: { color: 'rgba(148,163,184,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },

    // Register
    registerBtn: { alignItems: 'center', marginBottom: 12 },
    registerText: {
        color: 'rgba(148,163,184,0.7)',
        fontSize: 14,
    },
    registerHighlight: {
        color: '#60a5fa',
        fontWeight: '700',
    },

    // Guest
    guestBtn: { alignItems: 'center', paddingVertical: 6 },
    guestText: {
        color: 'rgba(100,116,139,0.7)',
        fontSize: 13,
        fontWeight: '500',
    },
});