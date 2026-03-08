import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import api from '../../services/api';

export default function VerifyAccountScreen({ navigation, route }) {
    const [email, setEmail] = useState(route?.params?.email || '');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', otp: '' });

    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!otp.trim()) {
            newErrors.otp = 'Vui lòng nhập mã OTP';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleVerify = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/verify-account', { email, otp });

            Alert.alert(
                "Thành công",
                res.data.message,
                [
                    {
                        text: "OK",
                        onPress: () => navigation.replace('Login')
                    }
                ]
            );
        } catch (e) {
            console.log('Verify account error:', e);
            Alert.alert("Lỗi", e.response?.data?.message || e.message || "Xác minh thất bại");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        if (field === 'email') setEmail(value);
        else if (field === 'otp') setOtp(value);

        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' }}>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                Xác Minh Tài Khoản
            </Text>

            <Text style={{ textAlign: 'center', marginBottom: 20, color: '#666' }}>
                Nhập email và mã OTP đã nhận từ email đăng ký
            </Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={t => updateField('email', t)}
                mode="outlined"
                style={{ marginBottom: 15 }}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={loading}
                error={!!errors.email}
            />
            {errors.email ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.email}</Text> : null}

            <TextInput
                label="Mã OTP"
                value={otp}
                onChangeText={t => updateField('otp', t)}
                mode="outlined"
                style={{ marginBottom: 20 }}
                keyboardType="number-pad"
                maxLength={6}
                disabled={loading}
                error={!!errors.otp}
            />
            {errors.otp ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 20 }}>{errors.otp}</Text> : null}

            <Button
                mode="contained"
                onPress={handleVerify}
                style={{ backgroundColor: '#2563eb' }}
                loading={loading}
                disabled={loading}
            >
                Xác Minh Tài Khoản
            </Button>

            <Button
                mode="text"
                onPress={() => navigation.goBack()}
                style={{ marginTop: 15 }}
                disabled={loading}
            >
                Quay lại
            </Button>
        </View>
    );
}
