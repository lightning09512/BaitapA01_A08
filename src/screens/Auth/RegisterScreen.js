import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import api from '../../services/api';

export default function RegisterScreen({ navigation }) {
    const [form, setForm] = useState({ username: '', password: '', email: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });

    const validateForm = () => {
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = 'Vui lòng nhập tài khoản';
        } else if (form.username.length < 3) {
            newErrors.username = 'Tài khoản phải có ít nhất 3 ký tự';
        }

        if (!form.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!form.password.trim()) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (form.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/register', form);

            setLoading(false);
            const message = (res.data && res.data.message) || 'Đăng ký thành công! Vui lòng kiểm tra terminal server để xem mã OTP.';
            Alert.alert(
                "Thành công",
                message,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.navigate('VerifyAccount', { email: form.email });
                        }
                    }
                ]
            );
        } catch (e) {
            console.log('Register error:', e);
            setLoading(false);
            const isNetworkError = !e.response && (e.code === 'ECONNREFUSED' || e.code === 'ETIMEDOUT' || (e.message && e.message.includes('Network')));
            const message = isNetworkError
                ? 'Không thể kết nối server. Vui lòng kiểm tra:\n• Server đã chạy chưa (port 3001)\n• IP trong src/services/api.js có đúng với máy chạy server không'
                : (e.response?.data?.message || e.message || 'Đăng ký thất bại');
            Alert.alert("Lỗi", message);
        }
    };

    const updateForm = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' }}>
            <TextInput
                label="Tài khoản"
                value={form.username}
                onChangeText={t => updateForm('username', t)}
                mode="outlined"
                style={{ marginBottom: 15 }}
                disabled={loading}
                error={!!errors.username}
            />
            {errors.username ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.username}</Text> : null}

            <TextInput
                label="Email"
                value={form.email}
                onChangeText={t => updateForm('email', t)}
                mode="outlined"
                style={{ marginBottom: 15 }}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={loading}
                error={!!errors.email}
            />
            {errors.email ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errors.email}</Text> : null}

            <TextInput
                label="Mật khẩu"
                secureTextEntry
                value={form.password}
                onChangeText={t => updateForm('password', t)}
                mode="outlined"
                style={{ marginBottom: 20 }}
                disabled={loading}
                error={!!errors.password}
            />
            {errors.password ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 20 }}>{errors.password}</Text> : null}

            <Button
                mode="contained"
                onPress={handleRegister}
                style={{ backgroundColor: '#2563eb' }}
                loading={loading}
                disabled={loading}
            >
                Tạo Tài Khoản
            </Button>
        </View>
    );
}