import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import api from '../../services/api';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', otp: '', password: '' });

    const validateEmail = () => {
        if (!email.trim()) {
            setErrors(prev => ({ ...prev, email: 'Vui lòng nhập email' }));
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors(prev => ({ ...prev, email: 'Email không hợp lệ' }));
            return false;
        }
        setErrors(prev => ({ ...prev, email: '' }));
        return true;
    };

    const validateResetForm = () => {
        const newErrors = {};

        if (!otp.trim()) {
            newErrors.otp = 'Vui lòng nhập mã OTP';
        }

        if (!newPassword.trim()) {
            newErrors.password = 'Vui lòng nhập mật khẩu mới';
        } else if (newPassword.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async () => {
        if (!validateEmail()) {
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/forgot-password', { email });

            Alert.alert(
                "Thành công",
                res.data.message || `Đã gửi mã OTP đến ${email}\n\nVui lòng kiểm tra terminal server để xem mã OTP!`,
                [
                    { text: "OK", onPress: () => setStep(2) }
                ]
            );
        } catch (e) {
            console.log('Send OTP error:', e);
            Alert.alert("Lỗi", e.response?.data?.message || e.message || "Không thể gửi OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!validateResetForm()) {
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/reset-password', { email, otp, newPassword });

            // Kiểm tra nếu tài khoản cần xác minh
            if (res.data.requiresVerification) {
                Alert.alert(
                    "Cần xác minh",
                    "Tài khoản của bạn chưa được xác minh. Vui lòng xác minh tài khoản trước khi đặt lại mật khẩu.",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate('VerifyAccount')
                        }
                    ]
                );
                return;
            }

            Alert.alert(
                "Thành công",
                "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
                [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]
            );
        } catch (e) {
            console.log('Reset password error:', e);
            Alert.alert("Lỗi", e.response?.data?.message || e.message || "Đặt lại mật khẩu thất bại");
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
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' }}>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Quên Mật Khẩu</Text>

            {step === 1 ? (
                <>
                    <TextInput
                        label="Nhập Email của bạn"
                        value={email}
                        onChangeText={t => updateField('email', t)}
                        mode="outlined"
                        style={{ marginBottom: 15 }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        disabled={loading}
                        error={!!errors.email}
                    />
                    {errors.email ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.email}</Text> : null}

                    <Button
                        mode="contained"
                        onPress={handleSendOTP}
                        style={{ backgroundColor: '#2563eb' }}
                        loading={loading}
                        disabled={loading}
                    >
                        Gửi Mã OTP
                    </Button>
                </>
            ) : (
                <>
                    <Text style={{ textAlign: 'center', marginBottom: 15, color: '#666' }}>
                        OTP đã được gửi tới {email}
                    </Text>

                    <TextInput
                        label="Mã OTP"
                        value={otp}
                        onChangeText={t => updateField('otp', t)}
                        mode="outlined"
                        style={{ marginBottom: 15 }}
                        keyboardType="number-pad"
                        maxLength={6}
                        disabled={loading}
                        error={!!errors.otp}
                    />
                    {errors.otp ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.otp}</Text> : null}

                    <TextInput
                        label="Mật khẩu mới"
                        value={newPassword}
                        onChangeText={t => updateField('password', t)}
                        secureTextEntry
                        mode="outlined"
                        style={{ marginBottom: 20 }}
                        disabled={loading}
                        error={!!errors.password}
                    />
                    {errors.password ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 20 }}>{errors.password}</Text> : null}

                    <Button
                        mode="contained"
                        onPress={handleResetPassword}
                        style={{ backgroundColor: '#2563eb' }}
                        loading={loading}
                        disabled={loading}
                    >
                        Đặt Lại Mật Khẩu
                    </Button>
                </>
            )}
            <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 15 }} disabled={loading}>Quay lại Đăng nhập</Button>
        </View>
    );
}