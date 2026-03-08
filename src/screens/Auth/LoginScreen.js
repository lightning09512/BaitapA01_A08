import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import api, { setAuthToken } from '../../services/api';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Validation
        if (!username.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tài khoản");
            return;
        }

        if (!password.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/login', { username, password });

            // Kiểm tra nếu tài khoản cần xác minh
            if (res.data && res.data.requiresVerification) {
                setLoading(false);
                Alert.alert(
                    "Cần xác minh",
                    "Tài khoản của bạn chưa được xác minh. Vui lòng kiểm tra email để xác minh tài khoản trước khi đăng nhập."
                );
                return;
            }

            // Lưu token vào header mặc định để các API /profile tự có Authorization
            if (res.data?.token) {
                setAuthToken(res.data.token);
            }

            // Thử lưu AsyncStorage (nếu môi trường hỗ trợ), nếu lỗi thì vẫn tiếp tục
            try {
                await AsyncStorage.setItem('TOKEN', res.data.token);
            } catch (storageErr) {
                console.log('AsyncStorage error:', storageErr);
            }

            setLoading(false);
            Alert.alert("Thành công", `Chào mừng ${(res.data && res.data.user && res.data.user.name) || username}!`);
            navigation.replace('MainApp'); // Chuyển vào luồng Bottom Tabs
        } catch (e) {
            console.log('Login error:', e);
            setLoading(false);
            const isNetworkError = !e.response && (e.code === 'ECONNREFUSED' || e.code === 'ETIMEDOUT' || e.message?.includes('Network'));
            const message = isNetworkError
                ? 'Không thể kết nối server. Vui lòng kiểm tra:\n• Server đã chạy chưa (port 3001)\n• IP trong src/services/api.js có đúng với máy chạy server không'
                : (e.response?.data?.message || e.message || 'Đăng nhập thất bại');
            Alert.alert("Lỗi", message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' }}>
            <Text variant="displaySmall" style={{ textAlign: 'center', fontWeight: 'bold', color: '#2563eb', marginBottom: 30 }}>E-Commerce</Text>
            <TextInput
                label="Tài khoản"
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={{ marginBottom: 15 }}
                autoCapitalize="none"
                disabled={loading}
                error={!username.trim()}
            />
            <TextInput
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={{ marginBottom: 20 }}
                disabled={loading}
                error={!password.trim()}
            />
            <Button
                mode="contained"
                onPress={handleLogin}
                style={{ backgroundColor: '#2563eb' }}
                loading={loading}
                disabled={loading}
            >
                Đăng Nhập
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('ForgotPassword')} style={{ marginTop: 10 }} disabled={loading}>Quên mật khẩu?</Button>
            <Button mode="text" onPress={() => navigation.navigate('Register')} style={{ marginTop: 10 }} disabled={loading}>Chưa có tài khoản? Đăng ký</Button>
            <Button mode="text" onPress={() => navigation.navigate('Homepage')} style={{ marginTop: 10, color: '#3b82f6' }} disabled={loading}>Xem thông tin sinh viên</Button>
        </View>
    );
}